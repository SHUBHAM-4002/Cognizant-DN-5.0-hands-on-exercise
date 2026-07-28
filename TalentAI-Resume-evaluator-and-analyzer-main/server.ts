import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import os from "os";
import { spawn, execSync } from "child_process";
// @ts-ignore
import officeParser from "officeparser";
import { seedJobs, seedCandidates } from "./src/server/seed";
import { analyzeJobDescription, parseResume, scoreCandidateForJob, getCopilotResponse } from "./src/server/ai";
import { JobDescription, Candidate, CandidateScore } from "./src/types";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to free up development ports dynamically on startup
function killPort(port: number) {
  try {
    if (process.platform === "win32") {
      const stdout = execSync("netstat -ano").toString();
      const lines = stdout.split("\n");
      const pids = new Set<string>();
      for (const line of lines) {
        if (line.includes(`:${port}`) || line.includes(` ${port} `)) {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && /^\d+$/.test(pid) && pid !== "0" && pid !== process.pid.toString()) {
            pids.add(pid);
          }
        }
      }
      for (const pid of pids) {
        try {
          console.log(`Port ${port} is occupied by PID ${pid}. Terminating process...`);
          execSync(`taskkill /F /PID ${pid}`);
        } catch (e) {
          // ignore
        }
      }
    } else {
      const stdout = execSync(`lsof -t -i:${port} 2>/dev/null`).toString().trim();
      if (stdout) {
        const pids = stdout.split("\n");
        for (const pid of pids) {
          if (pid && pid !== process.pid.toString()) {
            try {
              console.log(`Port ${port} is occupied by PID ${pid}. Terminating process...`);
              execSync(`kill -9 ${pid}`);
            } catch (e) {
              // ignore
            }
          }
        }
      }
    }
  } catch (err) {
    // Ignore command execution errors
  }
}

// Clear development ports at script entry
try {
  killPort(3008);
  killPort(24688);
  killPort(5001);
} catch (e) {
  // ignore
}

const app = express();
app.use(express.json({ limit: "50mb" }));

// In-Memory Database (Loaded with realistic Seeds)
let jobs: JobDescription[] = [...seedJobs];
let candidates: Candidate[] = [...seedCandidates];
let scores: CandidateScore[] = [];

// Helper to spawn the Python API backend automatically
function startPythonBackend() {
  console.log("Starting Python FastAPI Backend Service...");
  // Spawn process using virtual environment python if it exists, otherwise system python
  const pythonCmd = process.platform === "win32" ? ".venv\\Scripts\\python.exe" : ".venv/bin/python";
  const useVenv = fs.existsSync(pythonCmd);
  
  const pyProcess = spawn(useVenv ? pythonCmd : "python", ["-m", "backend.api.app"], {
    stdio: "inherit",
    shell: true
  });
  
  pyProcess.on("error", (err) => {
    console.error("Failed to start Python backend process:", err);
  });
  
  // Terminate python server when node exits
  process.on("exit", () => {
    pyProcess.kill();
  });
}

// Helper to poll Python backend health endpoint
async function waitForPythonBackend(retries = 15, delayMs = 1000): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch("http://127.0.0.1:5001/api/health");
      if (res.ok) {
        console.log("Python backend is healthy and ready.");
        return true;
      }
    } catch (e) {
      // Ignore errors during startup polling
    }
    console.log(`Waiting for Python backend to start... (retry ${i + 1}/${retries})`);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return false;
}

// Precompute matching scores for seeded jobs and candidates on launch
async function precomputeScores() {
  // Start Python service first
  startPythonBackend();
  const ready = await waitForPythonBackend();
  if (!ready) {
    console.error("Python backend failed to start in time. Candidate sync may fail.");
  }

  console.log("Precomputing matches for seeded JDs and candidates...");
  
  // Sync seeded candidates to Python FAISS DB
  for (const candidate of candidates) {
    try {
      await fetch("http://127.0.0.1:5001/api/add-candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate })
      });
    } catch (err) {
      console.warn(`Could not sync candidate ${candidate.name} to Python FAISS DB on start.`);
    }
  }

  for (const job of jobs) {
    for (const candidate of candidates) {
      try {
        const result = await scoreCandidateForJob(candidate, job, true);
        scores.push(result);
      } catch (err) {
        console.error(`Failed precomputing score for candidate ${candidate.name} vs job ${job.title}:`, err);
      }
    }
  }
  // Re-rank scores
  recomputeRanks();
  console.log(`Precomputed ${scores.length} match records.`);
}

function recomputeRanks() {
  // Group scores by job ID and sort by score desc to calculate ranks
  const jobsMap = new Map<string, CandidateScore[]>();
  scores.forEach((s) => {
    const list = jobsMap.get(s.jobId) || [];
    list.push(s);
    jobsMap.set(s.jobId, list);
  });

  jobsMap.forEach((jobScores) => {
    jobScores.sort((a, b) => b.score - a.score);
    jobScores.forEach((s, idx) => {
      s.rank = idx + 1;
    });
  });
}

// Ensure precomputing runs in background safely
precomputeScores().catch(console.error);

// ==========================================
// API ENDPOINTS
// ==========================================

// Jobs
app.get("/api/jobs", (req: Request, res: Response) => {
  res.json(jobs);
});

app.post("/api/jobs", async (req: Request, res: Response) => {
  try {
    const { rawText } = req.body;
    if (!rawText || rawText.trim() === "") {
      return res.status(400).json({ error: "Job description text is required" });
    }

    const analyzed = await analyzeJobDescription(rawText);
    const newJob: JobDescription = {
      ...analyzed,
      id: "job-" + Date.now(),
      createdAt: new Date().toISOString()
    };

    jobs.unshift(newJob);

    // Score all current candidates against this new job
    for (const candidate of candidates) {
      try {
        const scoreResult = await scoreCandidateForJob(candidate, newJob);
        scores.push(scoreResult);
      } catch (e) {
        console.error(`Error scoring candidate ${candidate.name} against new job:`, e);
      }
    }
    recomputeRanks();

    res.json(newJob);
  } catch (error: any) {
    console.error("Error creating job:", error);
    res.status(500).json({ error: error.message || "Failed to analyze Job Description" });
  }
});

app.delete("/api/jobs/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  jobs = jobs.filter((j) => j.id !== id);
  scores = scores.filter((s) => s.jobId !== id);
  recomputeRanks();
  res.json({ success: true });
});

// Helper for parsing any document buffer using officeparser
async function parseFileBuffer(buffer: Buffer, fileName: string): Promise<string> {
  const extension = fileName ? path.extname(fileName).toLowerCase() : ".txt";
  
  if (extension === ".txt" || !extension) {
    return buffer.toString("utf-8");
  }

  // Create a temporary file to let officeparser parse it reliably
  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, `upload-${Date.now()}${extension}`);
  
  try {
    await fs.promises.writeFile(tempFilePath, buffer);
    // officeParser.parsePromise can take path to any supported file
    const text = await (officeParser as any).parsePromise(tempFilePath);
    if (!text || typeof text !== "string" || text.trim() === "") {
      throw new Error("Extracted text is empty or invalid");
    }
    return text;
  } catch (err: any) {
    console.error(`officeparser failed for ${fileName}:`, err);
    throw new Error(`Failed to extract text from ${fileName}: ${err.message}`);
  } finally {
    try {
      if (fs.existsSync(tempFilePath)) {
        await fs.promises.unlink(tempFilePath);
      }
    } catch (cleanupErr) {
      console.error("Failed to clean up temp file:", cleanupErr);
    }
  }
}

// Document parsing API endpoint
app.post("/api/parse-document", async (req: Request, res: Response) => {
  try {
    const { base64, fileName } = req.body;
    if (!base64) {
      return res.status(400).json({ error: "Base64 data is required" });
    }
    const buffer = Buffer.from(base64, "base64");
    const text = await parseFileBuffer(buffer, fileName);
    res.json({ text });
  } catch (error: any) {
    console.error("Error parsing document:", error);
    res.status(500).json({ error: error.message || "Failed to parse document" });
  }
});

// Candidates
app.get("/api/candidates", (req: Request, res: Response) => {
  res.json(candidates);
});

app.post("/api/candidates", async (req: Request, res: Response) => {
  try {
    let { rawText, fileName, base64 } = req.body;
    
    // If we have base64 data, we parse it into rawText on the server
    if (base64) {
      try {
        const buffer = Buffer.from(base64, "base64");
        rawText = await parseFileBuffer(buffer, fileName || "resume.docx");
      } catch (parseErr: any) {
        console.error("Document parser failed on backend, falling back to heuristics:", parseErr);
        return res.status(400).json({ error: `Could not parse resume: ${parseErr.message}` });
      }
    }

    if (!rawText || rawText.trim() === "") {
      return res.status(400).json({ error: "Resume text content is required" });
    }

    const parsed = await parseResume(rawText);
    const newCandidate: Candidate = {
      ...parsed,
      id: "cand-" + Date.now(),
      createdAt: new Date().toISOString()
    };

    // Keep name realistic if missing
    if (!newCandidate.name || newCandidate.name === "Unknown Candidate") {
      if (fileName) {
        // clean fileName to name
        const cleanName = fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
        newCandidate.name = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      }
    }

    candidates.unshift(newCandidate);

    // Sync candidate to Python FAISS DB
    try {
      await fetch("http://127.0.0.1:5001/api/add-candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate: newCandidate })
      });
    } catch (err) {
      console.warn("Failed syncing new candidate to Python FAISS:", err);
    }

    // Score this new candidate against all existing jobs
    for (const job of jobs) {
      try {
        const scoreResult = await scoreCandidateForJob(newCandidate, job);
        scores.push(scoreResult);
      } catch (e) {
        console.error(`Error scoring new candidate against job ${job.title}:`, e);
      }
    }
    recomputeRanks();

    res.json(newCandidate);
  } catch (error: any) {
    console.error("Error creating candidate:", error);
    res.status(500).json({ error: error.message || "Failed to parse resume" });
  }
});

app.delete("/api/candidates/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  candidates = candidates.filter((c) => c.id !== id);
  scores = scores.filter((s) => s.candidateId !== id);
  
  // Delete from Python FAISS DB
  try {
    await fetch(`http://127.0.0.1:5001/api/candidates/${id}`, {
      method: "DELETE"
    });
  } catch (err) {
    console.warn("Failed deleting candidate from Python FAISS:", err);
  }

  recomputeRanks();
  res.json({ success: true });
});

// Match Scores
app.get("/api/scores", (req: Request, res: Response) => {
  res.json(scores);
});

// Recruiter Copilot Chat
app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { prompt, history } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const responseText = await getCopilotResponse(
      prompt,
      history || [],
      jobs,
      candidates,
      scores
    );

    res.json({ text: responseText });
  } catch (error: any) {
    console.error("Error in Copilot Chat:", error);
    res.status(500).json({ error: error.message || "Copilot experienced an error" });
  }
});

// Analytics Dashboard Statistics
app.get("/api/stats", async (req: Request, res: Response) => {
  const jobId = req.query.jobId as string;
  const job = jobs.find((j) => j.id === jobId);
  
  if (job) {
    try {
      // Delegate to Python FastAPI server
      const response = await fetch("http://127.0.0.1:5001/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job,
          candidates: candidates
        })
      });
      if (response.ok) {
        const data = await response.json();
        return res.json(data);
      }
    } catch (err) {
      console.warn("FastAPI stats calculation failed, falling back to Express heuristic:", err);
    }
  }

  // Fallback to Express heuristic stats calculation
  const activeScores = jobId ? scores.filter((s) => s.jobId === jobId) : scores;
  const totalCandidates = candidates.length;
  const topMatches = activeScores.filter((s) => s.score >= 85).length;
  const sumScores = activeScores.reduce((acc, s) => acc + s.score, 0);
  const averageScore = activeScores.length > 0 ? Math.round((sumScores / activeScores.length) * 10) / 10 : 0;

  const skillCounts: { [key: string]: number } = {};
  candidates.forEach((c) => {
    c.skills.forEach((s) => {
      const standardName = s.trim();
      skillCounts[standardName] = (skillCounts[standardName] || 0) + 1;
    });
  });
  const skillsDistribution = Object.entries(skillCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Experience Distribution
  const expCounts = {
    "Junior (0-2 yrs)": 0,
    "Mid-Level (3-4 yrs)": 0,
    "Senior (5-8 yrs)": 0,
    "Principal (9+ yrs)": 0,
  };
  candidates.forEach((c) => {
    const totalExp = c.experience.reduce((sum, e) => sum + (e.yearsOfExp || 0), 0);
    if (totalExp <= 2) expCounts["Junior (0-2 yrs)"]++;
    else if (totalExp <= 4) expCounts["Mid-Level (3-4 yrs)"]++;
    else if (totalExp <= 8) expCounts["Senior (5-8 yrs)"]++;
    else expCounts["Principal (9+ yrs)"]++;
  });
  const experienceDistribution = Object.entries(expCounts).map(([name, count]) => ({ name, count }));

  // Education Distribution
  const eduCounts = {
    "Bachelor's": 0,
    "Master's / MBA": 0,
    "Ph.D. / Doctorate": 0,
    "Other/Self-taught": 0
  };
  candidates.forEach((c) => {
    const text = c.education.map((e) => e.degree.toLowerCase()).join(" ");
    if (text.includes("ph.d") || text.includes("phd") || text.includes("doctor")) {
      eduCounts["Ph.D. / Doctorate"]++;
    } else if (text.includes("master") || text.includes("m.s") || text.includes("m.tech") || text.includes("mba")) {
      eduCounts["Master's / MBA"]++;
    } else if (text.includes("bachelor") || text.includes("b.s") || text.includes("b.tech")) {
      eduCounts["Bachelor's"]++;
    } else {
      eduCounts["Other/Self-taught"]++;
    }
  });
  const educationDistribution = Object.entries(eduCounts).map(([name, count]) => ({ name, count }));

  // Score Histogram Distribution
  const ranges = ["< 50", "50 - 59", "60 - 69", "70 - 79", "80 - 89", "90 - 100"];
  const rangeCounts: { [key: string]: number } = {};
  ranges.forEach((r) => { rangeCounts[r] = 0; });

  activeScores.forEach((s) => {
    if (s.score < 50) rangeCounts["< 50"]++;
    else if (s.score <= 59) rangeCounts["50 - 59"]++;
    else if (s.score <= 69) rangeCounts["60 - 69"]++;
    else if (s.score <= 79) rangeCounts["70 - 79"]++;
    else if (s.score <= 89) rangeCounts["80 - 89"]++;
    else rangeCounts["90 - 100"]++;
  });
  const scoreHistogram = Object.entries(rangeCounts).map(([range, count]) => ({ range, count }));

  res.json({
    totalCandidates,
    topMatches,
    averageScore,
    skillsDistribution,
    experienceDistribution,
    educationDistribution,
    scoreHistogram,
  });
});

// Semantic Candidate search endpoint (delegated to Python FAISS)
app.get("/api/search", async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string;
    const limit = req.query.limit as string || "5";
    if (!query) {
      return res.status(400).json({ error: "query parameter is required" });
    }
    const response = await fetch(`http://127.0.0.1:5001/api/search?query=${encodeURIComponent(query)}&limit=${limit}`);
    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    }
    res.status(500).json({ error: "Failed to perform search on Python backend" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to connect to Python backend" });
  }
});

// CSV Export for Ranked Candidates
app.get("/api/export/csv", (req: Request, res: Response) => {
  const jobId = req.query.jobId as string;
  if (!jobId) {
    return res.status(400).send("jobId query parameter is required");
  }

  const job = jobs.find((j) => j.id === jobId);
  if (!job) {
    return res.status(404).send("Job description not found");
  }

  const jobScores = scores.filter((s) => s.jobId === jobId).sort((a, b) => b.score - a.score);

  // Generate CSV rows
  let csvContent = "candidate_id,candidate_name,score,rank,recommendation,pros,cons\n";
  jobScores.forEach((s, idx) => {
    const cand = candidates.find((c) => c.id === s.candidateId);
    if (cand) {
      const cleanName = cand.name.replace(/"/g, '""');
      const cleanRec = s.explanation.recommendation.replace(/"/g, '""').replace(/\n/g, " ");
      const cleanPros = s.explanation.pros.join(" | ").replace(/"/g, '""').replace(/\n/g, " ");
      const cleanCons = s.explanation.cons.join(" | ").replace(/"/g, '""').replace(/\n/g, " ");
      csvContent += `"${cand.id}","${cleanName}",${s.score},${idx + 1},"${cleanRec}","${cleanPros}","${cleanCons}"\n`;
    }
  });

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="talentai_ranking_${jobId}.csv"`);
  res.status(200).send(csvContent);
});

// Excel Export for Ranked Candidates
app.get("/api/export/excel", async (req: Request, res: Response) => {
  const jobId = req.query.jobId as string;
  if (!jobId) return res.status(400).send("jobId query parameter is required");
  const job = jobs.find((j) => j.id === jobId);
  if (!job) return res.status(404).send("Job description not found");

  const jobScores = scores.filter((s) => s.jobId === jobId).sort((a, b) => b.score - a.score);

  try {
    const response = await fetch("http://127.0.0.1:5001/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scores: jobScores,
        candidates: candidates,
        jobTitle: job.title,
        format: "excel"
      })
    });
    if (response.ok) {
      const resData = await response.json();
      const buffer = Buffer.from(resData.data, "base64");
      res.setHeader("Content-Type", resData.contentType);
      res.setHeader("Content-Disposition", `attachment; filename="${resData.fileName}"`);
      return res.status(200).send(buffer);
    }
  } catch (err) {
    console.error("Failed Excel generation on Python server:", err);
  }
  res.status(500).send("Failed to export Excel report");
});

// PDF/HTML Export for Ranked Candidates
app.get("/api/export/pdf", async (req: Request, res: Response) => {
  const jobId = req.query.jobId as string;
  if (!jobId) return res.status(400).send("jobId query parameter is required");
  const job = jobs.find((j) => j.id === jobId);
  if (!job) return res.status(404).send("Job description not found");

  const jobScores = scores.filter((s) => s.jobId === jobId).sort((a, b) => b.score - a.score);

  try {
    const response = await fetch("http://127.0.0.1:5001/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scores: jobScores,
        candidates: candidates,
        jobTitle: job.title,
        format: "pdf"
      })
    });
    if (response.ok) {
      const resData = await response.json();
      const htmlContent = Buffer.from(resData.data, "base64").toString("utf-8");
      res.setHeader("Content-Type", "text/html");
      return res.status(200).send(htmlContent);
    }
  } catch (err) {
    console.error("Failed PDF generation on Python server:", err);
  }
  res.status(500).send("Failed to export PDF/HTML report");
});

// ==========================================
// VITE CLIENT INTEGRATION
// ==========================================

const PORT = 3008;

async function startServer() {
  if (process.env.NODE_ENV === "production") {
    // Serve static frontend in production
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    // Running in development mode - load Vite Dev Middleware dynamically
    console.log("Loading Vite dev middleware...");
    const { createServer } = await import("vite");
    const viteDevServer = await createServer({
      server: {
        middlewareMode: true,
        hmr: {
          port: 24688
        }
      },
      appType: "spa",
    });
    app.use(viteDevServer.middlewares);
  }

  app.listen(PORT, "localhost", () => {
    console.log(`TalentAI Platform listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
});
