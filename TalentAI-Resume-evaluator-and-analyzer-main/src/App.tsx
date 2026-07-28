import React, { useState, useEffect, useRef } from "react";
import {
  Briefcase,
  Users,
  FileText,
  BarChart3,
  MessageSquare,
  Settings,
  Plus,
  Search,
  Download,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Mail,
  Upload,
  RefreshCw,
  X,
  ExternalLink,
  Award,
  BookOpen,
  TrendingUp,
  UserCheck,
  Compass,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Trash2,
  FileDown,
  Lock,
  Menu,
  ChevronDown
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { JobDescription, Candidate, CandidateScore, ChatMessage, RecruiterStats } from "./types";

// Standard UI Notification helper
interface AlertMessage {
  type: "success" | "error" | "info";
  text: string;
}

export default function App() {
  // Navigation & Authentication
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Start directly logged in for quick evaluation
  const [adminUser, setAdminUser] = useState<string>("Recruiter Demo");
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Core Data State
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [scores, setScores] = useState<CandidateScore[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobDescription | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filtered candidate pool based on name, skills, and projects
  const filteredCandidates = React.useMemo(() => {
    if (!searchQuery.trim()) return candidates;
    const query = searchQuery.toLowerCase().trim();
    return candidates.filter((cand) => {
      // 1. Name match
      const nameMatch = cand.name?.toLowerCase().includes(query);
      if (nameMatch) return true;

      // 2. Skills match
      const skillsMatch = cand.skills?.some((s) => s.toLowerCase().includes(query));
      if (skillsMatch) return true;

      // 3. Projects match (title, description, or technologies)
      const projectsMatch = cand.projects?.some((p) => {
        const titleMatch = p.title?.toLowerCase().includes(query);
        const descMatch = p.description?.toLowerCase().includes(query);
        const techMatch = p.technologies?.some((t) => t.toLowerCase().includes(query));
        return titleMatch || descMatch || techMatch;
      });
      if (projectsMatch) return true;

      return false;
    });
  }, [candidates, searchQuery]);

  // Stats State
  const [stats, setStats] = useState<RecruiterStats | null>(null);

  // Loading States
  const [loadingJobs, setLoadingJobs] = useState<boolean>(false);
  const [loadingCandidates, setLoadingCandidates] = useState<boolean>(false);
  const [loadingStats, setLoadingStats] = useState<boolean>(false);
  const [analyzingJD, setAnalyzingJD] = useState<boolean>(false);
  const [parsingResume, setParsingResume] = useState<boolean>(false);
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // Job Posting Inputs
  const [jdText, setJdText] = useState<string>("");
  const [jdUploadFile, setJdUploadFile] = useState<File | null>(null);

  // Resume Upload Inputs
  const [resumeText, setResumeText] = useState<string>("");
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  const [pastedResumeName, setPastedResumeName] = useState<string>("");

  // Candidate Comparison Selection
  const [compareCandA, setCompareCandA] = useState<Candidate | null>(null);
  const [compareCandB, setCompareCandB] = useState<Candidate | null>(null);

  // Copilot Chat
  const [chatInput, setChatInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hi! I am **TalentAI Copilot**. Ask me anything about your current candidate pool, e.g., *'Find experienced NLP engineers with Python'* or *'Suggest the best fit for our Senior Frontend position'*.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Alert system
  const [alert, setAlert] = useState<AlertMessage | null>(null);

  // Auto-clear alert
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Fetch initial data
  const loadData = async () => {
    setLoadingJobs(true);
    setLoadingCandidates(true);
    try {
      // Jobs
      const jobsRes = await fetch("/api/jobs");
      const jobsData = await jobsRes.json();
      setJobs(jobsData);
      if (jobsData.length > 0 && !selectedJob) {
        setSelectedJob(jobsData[0]);
      }

      // Candidates
      const candRes = await fetch("/api/candidates");
      const candData = await candRes.json();
      setCandidates(candData);

      // Scores
      const scoresRes = await fetch("/api/scores");
      const scoresData = await scoresRes.json();
      setScores(scoresData);
    } catch (err) {
      console.error("Failed to load initial data", err);
      setAlert({ type: "error", text: "Error loading core server data. Ensure server is active." });
    } finally {
      setLoadingJobs(false);
      setLoadingCandidates(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Fetch stats based on selected job ID
  const loadStats = async (jobId?: string) => {
    setLoadingStats(true);
    try {
      const url = jobId ? `/api/stats?jobId=${jobId}` : "/api/stats";
      const res = await fetch(url);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to load statistics", err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    loadStats(selectedJob?.id);
  }, [selectedJob, candidates, scores]);

  // Auto-select candidate for details pane when job/candidates change
  useEffect(() => {
    if (selectedJob && filteredCandidates.length > 0) {
      // Keep selectedCandidate if it is still in the filtered candidate pool
      if (selectedCandidate && filteredCandidates.some((c) => c.id === selectedCandidate.id)) {
        return;
      }
      const activeScores = scores.filter((s) => s.jobId === selectedJob.id);
      if (activeScores.length > 0) {
        const sorted = [...activeScores].sort((a, b) => b.score - a.score);
        // Find the highest scoring candidate that matches the filter
        const sortedFiltered = [...filteredCandidates].sort((a, b) => {
          const scoreA = scores.find((s) => s.candidateId === a.id && s.jobId === selectedJob.id)?.score || 0;
          const scoreB = scores.find((s) => s.candidateId === b.id && s.jobId === selectedJob.id)?.score || 0;
          return scoreB - scoreA;
        });
        setSelectedCandidate(sortedFiltered[0] || filteredCandidates[0]);
      } else {
        setSelectedCandidate(filteredCandidates[0]);
      }
    } else {
      setSelectedCandidate(null);
    }
  }, [selectedJob, scores, filteredCandidates]);

  // Handle JD Creation
  const handleCreateJD = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdText.trim()) {
      setAlert({ type: "error", text: "Please enter or upload a Job Description." });
      return;
    }

    setAnalyzingJD(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: jdText }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const newJob = await res.json();
      setJobs((prev) => [newJob, ...prev]);
      setSelectedJob(newJob);
      setJdText("");
      setAlert({ type: "success", text: `Successfully parsed & added: ${newJob.title}!` });
      setActiveTab("dashboard");
      loadData(); // Reload rankings and candidates
    } catch (err: any) {
      setAlert({ type: "error", text: `JD Parsing Failed: ${err.message}` });
    } finally {
      setAnalyzingJD(false);
    }
  };

  // Handle Resume Creation
  const handleCreateResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      setAlert({ type: "error", text: "Please paste or drag-and-drop a Resume." });
      return;
    }

    setParsingResume(true);
    try {
      const res = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText: resumeText,
          fileName: pastedResumeName || "Manual_Resume.txt"
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const newCand = await res.json();
      setCandidates((prev) => [newCand, ...prev]);
      setResumeText("");
      setPastedResumeName("");
      setAlert({ type: "success", text: `Successfully parsed & indexed: ${newCand.name}!` });
      loadData(); // Reload scores
      setActiveTab("ranking");
    } catch (err: any) {
      setAlert({ type: "error", text: `Resume Parsing Failed: ${err.message}` });
    } finally {
      setParsingResume(false);
    }
  };

  // Handle Job Description Text File Upload
  const handleJdFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzingJD(true);
    setAlert({ type: "info", text: `Extracting text from Job Spec: ${file.name}...` });

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const dataUrl = event.target?.result as string;
        const base64 = dataUrl.split(",")[1];

        const res = await fetch("/api/parse-document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64,
            fileName: file.name
          }),
        });

        if (!res.ok) {
          throw new Error(await res.text());
        }

        const data = await res.json();
        setJdText(data.text);
        setAlert({ type: "success", text: `Loaded & extracted ${file.name} text into analyzer.` });
      } catch (err: any) {
        console.error("Failed to parse Job Spec:", err);
        setAlert({ type: "error", text: `Failed to parse document: ${err.message}` });
      } finally {
        setAnalyzingJD(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Multiple Resumes File Upload
  const handleResumeMultipleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setParsingResume(true);
    setAlert({ type: "info", text: `Uploading and parsing ${files.length} resume(s)...` });
    let count = 0;
    let failedCount = 0;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const dataUrl = event.target?.result as string;
          const base64 = dataUrl.split(",")[1];

          const res = await fetch("/api/candidates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              base64,
              fileName: file.name
            }),
          });
          
          if (res.ok) {
            count++;
          } else {
            console.error("Failed uploading candidate:", file.name, await res.text());
            failedCount++;
          }
        } catch (err) {
          console.error("Failed uploading bulk file:", file.name, err);
          failedCount++;
        } finally {
          const processed = count + failedCount;
          if (processed === files.length) {
            if (count > 0) {
              setAlert({ 
                type: "success", 
                text: `Processed & matched ${count} resume(s) successfully!${failedCount > 0 ? ` (${failedCount} failed)` : ""}` 
              });
              loadData();
            } else {
              setAlert({ type: "error", text: `Failed parsing all ${failedCount} resume(s).` });
            }
            setParsingResume(false);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle Chat Assist Submit
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory((prev) => [...prev, userMsg]);
    const originalInput = chatInput;
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: originalInput,
          history: chatHistory.map(h => ({ sender: h.sender, text: h.text }))
        }),
      });

      if (!res.ok) throw new Error("Chat api failed");

      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: "ai-" + Date.now(),
        sender: "ai",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory((prev) => [...prev, aiMsg]);
    } catch (err) {
      setAlert({ type: "error", text: "Chat server error. Verify API status." });
      setChatHistory((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          sender: "ai",
          text: "I experienced an authentication or timeout challenge. Please check your credentials.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Helper: Delete candidate
  const handleDeleteCandidate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to remove this candidate from TalentAI?")) return;
    try {
      const res = await fetch(`/api/candidates/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCandidates((prev) => prev.filter((c) => c.id !== id));
        setScores((prev) => prev.filter((s) => s.candidateId !== id));
        setAlert({ type: "info", text: "Candidate successfully deleted." });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper: Delete Job
  const handleDeleteJob = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this job description?")) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j.id !== id));
        setScores((prev) => prev.filter((s) => s.jobId !== id));
        if (selectedJob?.id === id) {
          setSelectedJob(jobs[0] || null);
        }
        setAlert({ type: "info", text: "Job specification deleted." });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper: Render markdown styling in Chat
  const renderMarkdown = (text: string) => {
    // Basic helper for bolding and italics
    const formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-300 font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-white/90 font-medium">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-black/40 text-rose-300 px-1 py-0.5 rounded text-[11px] font-mono">$1</code>')
      .replace(/\n/g, '<br />');

    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  // Score extraction for candidate
  const getCandidateScoreObj = (candId: string): CandidateScore | undefined => {
    if (!selectedJob) return undefined;
    return scores.find((s) => s.candidateId === candId && s.jobId === selectedJob.id);
  };

  // Sort candidates by score for selected JD
  const getSortedCandidatesForActiveJob = () => {
    if (!selectedJob) return filteredCandidates;
    return [...filteredCandidates].sort((a, b) => {
      const scoreA = getCandidateScoreObj(a.id)?.score || 0;
      const scoreB = getCandidateScoreObj(b.id)?.score || 0;
      return scoreB - scoreA;
    });
  };

  // CSV generation link trigger
  const handleDownloadCSV = () => {
    if (!selectedJob) return;
    window.open(`/api/export/csv?jobId=${selectedJob.id}`, "_blank");
  };

  // Trigger PDF print directly in browser (custom printable screen layout)
  const handlePrintPDF = () => {
    window.print();
  };

  // Handle automated demo setups for fast presentation walkthroughs
  const handleAddSampleResume = () => {
    setResumeText(`Sandro De Luca
sandro.luca@cloudarchitect.tech
+1 (555) 602-1234
San Francisco, CA

PROFESSIONAL SUMMARY
Senior Cloud & AI Solutions Architect with 6 years experience designing distributed infrastructures and machine learning models in production environments. Strong advocate of developer tools, reproducible datasets, and secure APIs.

TECHNICAL SKILLS
Python, PyTorch, FastAPI, Docker, AWS, Kubernetes, Terraform, SQL, PostgreSQL, langchain, REST APIs, Git, Pandas, NumPy, Generative AI, LlamaIndex, Pinecone.

EXPERIENCE
Lead Infrastructure & ML Engineer | CloudCore Systems (2022 - Present)
- Designed and maintained production-grade FastAPI microservices handling 2.5 million daily requests.
- Integrated LangChain and Pinecone to support proprietary customer vector search systems.
- Supervised standard cloud deployments reducing operating latency by 32% using Docker.
Machine Learning Developer | GreenLabs AI (2020 - 2022)
- Built predictive analytics pipelines on complex tabular data sheets.
- Managed secure Git integrations, continuous delivery pipelines, and REST gateways.

EDUCATION
B.S. in Computer Science | University of Southern California (USC) - 2020

CERTIFICATIONS
- AWS Solution Architect - Professional
- HashiCorp Terraform Associate`);
    setPastedResumeName("Sandro_De_Luca_Resume.txt");
    setAlert({ type: "info", text: "Seeded Sandro De Luca's resume in parser textbox!" });
  };

  const handleAddSampleJD = () => {
    setJdText(`Role: Machine Learning Operations (MLOps) Engineer
Experience Required: 3+ years
Core Skills: Python, FastAPI, Docker, Kubernetes, AWS, SQL, CI/CD, Model Monitoring, PyTorch, Pandas.
Responsibilities:
- Build and operate robust automated machine learning pipelines (MLOps).
- Package models in Docker containers and orchestrate microservices using Kubernetes.
- Collaborate with AI scientists to optimize inference latency and server costs.
- Deploy secure web servers with FastAPI.`);
    setAlert({ type: "info", text: "Loaded 'MLOps Engineer' description in analyzer!" });
  };

  const activeJobCandidates = getSortedCandidatesForActiveJob();
  const currentCandidateScore = selectedCandidate ? getCandidateScoreObj(selectedCandidate.id) : undefined;

  // Render comparative Recommendation fit for the comparison module
  const getComparisonRecommendation = () => {
    if (!compareCandA || !compareCandB) return "";
    const scoreA = selectedJob ? getCandidateScoreObj(compareCandA.id)?.score || 70 : 70;
    const scoreB = selectedJob ? getCandidateScoreObj(compareCandB.id)?.score || 70 : 70;

    const diff = Math.abs(scoreA - scoreB);
    const winner = scoreA > scoreB ? compareCandA.name : compareCandB.name;
    const loser = scoreA > scoreB ? compareCandB.name : compareCandA.name;

    if (diff < 4) {
      return `Both candidates present exceptional, highly comparable scores. We recommend conducting a collaborative whiteboard interview focusing heavily on cultural traits and team alignment to distinguish their fit.`;
    } else {
      return `Based on Semantic alignment, ${winner} exhibits a stronger structural fit (+${diff} points) compared to ${loser}. ${winner} has superior portfolio depth matching the requested job requirements of "${selectedJob?.title || "our role"}".`;
    }
  };

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-[#05010d] text-white">
      {/* Background Mesh Gradients */}
      <div className="absolute inset-0 mesh-gradient pointer-events-none z-0"></div>

      {/* Main Container */}
      <div className="relative flex h-full w-full overflow-hidden z-10">
        
        {/* Sidebar */}
        <aside className="glass-sidebar w-64 shrink-0 flex flex-col p-5 border-r border-white/5 bg-white/[0.01] backdrop-blur-xl">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl accent-gradient flex items-center justify-center font-extrabold text-white text-lg tracking-wider shadow-lg shadow-indigo-500/10">
              T
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight glow-text font-sans bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-100">
                TalentAI
              </h1>
              <p className="text-[9px] text-indigo-300 font-mono tracking-widest uppercase">Intelligence</p>
            </div>
          </div>

          {/* Active Job Selection dropdown in sidebar */}
          <div className="mb-6">
            <label className="block text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2 px-1">
              Active Job Scope
            </label>
            <div className="relative">
              <select
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer appearance-none"
                value={selectedJob?.id || ""}
                onChange={(e) => {
                  const found = jobs.find((j) => j.id === e.target.value);
                  if (found) setSelectedJob(found);
                }}
              >
                {jobs.map((job) => (
                  <option key={job.id} value={job.id} className="bg-[#0b071a] text-white text-xs">
                    {job.title.length > 25 ? job.title.slice(0, 25) + "..." : job.title}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2.5 top-2.5 text-white/40">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>

          {/* Primary Navigation */}
          <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === "dashboard"
                  ? "bg-white/10 border border-white/10 text-white shadow-md shadow-white/5"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <BarChart3 size={16} className={activeTab === "dashboard" ? "text-indigo-400" : ""} />
              Recruiter Dashboard
            </button>

            <button
              onClick={() => setActiveTab("job-desc")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === "job-desc"
                  ? "bg-white/10 border border-white/10 text-white shadow-md shadow-white/5"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Briefcase size={16} className={activeTab === "job-desc" ? "text-indigo-400" : ""} />
              Job Specifications
            </button>

            <button
              onClick={() => setActiveTab("resume")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === "resume"
                  ? "bg-white/10 border border-white/10 text-white shadow-md shadow-white/5"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Upload size={16} className={activeTab === "resume" ? "text-indigo-400" : ""} />
              Upload Resumes
            </button>

            <button
              onClick={() => setActiveTab("ranking")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === "ranking"
                  ? "bg-white/10 border border-white/10 text-white shadow-md shadow-white/5"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Users size={16} className={activeTab === "ranking" ? "text-indigo-400" : ""} />
              Ranking Matrix
            </button>

            <button
              onClick={() => setActiveTab("comparison")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === "comparison"
                  ? "bg-white/10 border border-white/10 text-white shadow-md shadow-white/5"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Compass size={16} className={activeTab === "comparison" ? "text-indigo-400" : ""} />
              Candidate Compare
            </button>

            <button
              onClick={() => setActiveTab("chat")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === "chat"
                  ? "bg-white/10 border border-white/10 text-white shadow-md shadow-white/5"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <MessageSquare size={16} className={activeTab === "chat" ? "text-indigo-400" : ""} />
              Recruiter Copilot
            </button>
          </nav>

          {/* System status at bottom */}
          <div className="mt-auto pt-4 border-t border-white/5">
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider">
                  Gemini API Status
                </span>
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 font-mono uppercase">
                  Connected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <p className="text-[11px] text-white/70">Semantic Models Ready</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          
          {/* Header */}
          <header className="h-16 shrink-0 flex items-center justify-between px-8 border-b border-white/5 bg-white/[0.01] backdrop-blur-md z-10">
            <div className="flex items-center gap-4">
              <div className="space-y-0.5">
                <p className="text-xs text-indigo-400/80 font-bold font-mono tracking-wider uppercase">
                  Challenge Environment
                </p>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Active Analysis:</span>
                  <span className="text-indigo-300 font-extrabold">
                    {selectedJob ? selectedJob.title : "No Job Selected"}
                  </span>
                </h2>
              </div>
            </div>

            {/* Global Search Bar */}
            <div className="flex-1 max-w-md mx-6 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
                <Search size={16} />
              </div>
              <input
                id="global-search-bar"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidates by name, skills, or projects..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-8 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
              />
              {searchQuery && (
                <button
                  id="clear-search-button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Quick Actions & Profile */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrintPDF}
                className="hidden md:flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all"
              >
                <FileDown size={14} className="text-indigo-400" />
                Print Dossier PDF
              </button>
              
              <button
                onClick={handleDownloadCSV}
                className="hidden md:flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all"
              >
                <Download size={14} className="text-indigo-400" />
                Export CSV
              </button>

              <div className="w-px h-6 bg-white/10"></div>

              {/* User badge */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-xs shadow-md border border-white/15">
                  RD
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold leading-none">{adminUser}</p>
                  <p className="text-[9px] text-white/40 leading-tight">Lead Recruiter</p>
                </div>
              </div>
            </div>
          </header>

          {/* Alert bar */}
          {alert && (
            <div className={`mx-8 mt-4 p-3 rounded-xl border flex items-center gap-3 text-xs z-20 ${
              alert.type === "success" 
                ? "bg-green-500/10 border-green-500/20 text-green-300"
                : alert.type === "error"
                ? "bg-rose-500/10 border-rose-500/20 text-rose-300"
                : "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
            }`}>
              <Sparkles size={16} className="shrink-0" />
              <p className="flex-1">{alert.text}</p>
              <button onClick={() => setAlert(null)} className="hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>
          )}

          {/* Dynamic Module Panel Container */}
          <div className="flex-1 overflow-hidden p-8 flex flex-col min-h-0">
            
            {/* ========================================================= */}
            {/* MODULE 1: RECRUITER DASHBOARD                             */}
            {/* ========================================================= */}
            {activeTab === "dashboard" && (
              <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
                
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Card 1 */}
                  <div className="glass-card p-5 rounded-2xl flex items-center justify-between shadow-lg">
                    <div className="space-y-1">
                      <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">
                        Total Candidates
                      </p>
                      <h3 className="text-3xl font-extrabold font-mono tracking-tight text-white glow-text">
                        {stats?.totalCandidates || 0}
                      </h3>
                      <p className="text-[10px] text-indigo-400 font-medium">In talent pool</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/15">
                      <Users size={22} />
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="glass-card p-5 rounded-2xl flex items-center justify-between shadow-lg">
                    <div className="space-y-1">
                      <p className="text-indigo-300 text-[10px] uppercase font-bold tracking-widest">
                        Top Matches
                      </p>
                      <h3 className="text-3xl font-extrabold font-mono tracking-tight text-indigo-100 glow-text">
                        {stats?.topMatches || 0}
                      </h3>
                      <p className="text-[10px] text-green-400 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse"></span>
                        Score &ge; 85%
                      </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-indigo-500/10 border-indigo-500/20 text-indigo-400 bg-indigo-500/10">
                      <UserCheck size={22} />
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="glass-card p-5 rounded-2xl flex items-center justify-between shadow-lg">
                    <div className="space-y-1">
                      <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">
                        Average Fit Score
                      </p>
                      <h3 className="text-3xl font-extrabold font-mono tracking-tight text-white glow-text">
                        {stats?.averageScore || 0}%
                      </h3>
                      <p className="text-[10px] text-indigo-400 font-medium">For active JD</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/15">
                      <TrendingUp size={22} />
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="glass-card p-5 rounded-2xl flex items-center justify-between shadow-lg">
                    <div className="space-y-1">
                      <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">
                        AI Model Version
                      </p>
                      <h3 className="text-xl font-bold font-mono tracking-tight text-indigo-300 mt-1">
                        Gemini 3.5 Flash
                      </h3>
                      <p className="text-[10px] text-white/50">Semantic analysis v4.2</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
                      <Sparkles size={22} />
                    </div>
                  </div>
                </div>

                {/* Main Charts & Overview Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Chart: Score Distribution Histogram */}
                  <div className="lg:col-span-8 glass-card p-6 rounded-2xl flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-sm font-bold text-white">Candidate Fit Score Distribution</h4>
                        <p className="text-white/40 text-[11px]">Frequency count of candidate scores across the active job description requirements</p>
                      </div>
                      <span className="text-[10px] font-mono bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 text-indigo-300">
                        Normalized Score / 100
                      </span>
                    </div>

                    <div className="flex-1 min-h-[220px]">
                      {stats && stats.scoreHistogram.length > 0 ? (
                        <ResponsiveContainer width="100%" height={240}>
                          <BarChart data={stats.scoreHistogram} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="range" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                            <Tooltip
                              contentStyle={{ background: "#0b071a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                              labelStyle={{ color: "rgba(255,255,255,0.6)", fontSize: "11px" }}
                              itemStyle={{ color: "#818cf8", fontSize: "12px", fontWeight: "bold" }}
                            />
                            <Bar dataKey="count" fill="url(#barGradient)" radius={[4, 4, 0, 0]}>
                              <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#6366f1" />
                                  <stop offset="100%" stopColor="#a855f7" />
                                </linearGradient>
                              </defs>
                              {stats.scoreHistogram.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index >= 4 ? "#a855f7" : "#6366f1"} opacity={0.8 + (index * 0.04)} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-xs text-white/40">
                          Waiting for statistics to load...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Chart: Skills distribution */}
                  <div className="lg:col-span-4 glass-card p-6 rounded-2xl flex flex-col">
                    <h4 className="text-sm font-bold text-white mb-1">Top Skills in Talent Pool</h4>
                    <p className="text-white/40 text-[11px] mb-4">Most frequently parsed candidate skills</p>

                    <div className="flex-1 flex flex-col justify-center">
                      {stats && stats.skillsDistribution.length > 0 ? (
                        <div className="space-y-3">
                          {stats.skillsDistribution.slice(0, 6).map((skill, index) => {
                            const maxVal = stats.skillsDistribution[0]?.count || 1;
                            const pct = Math.round((skill.count / maxVal) * 100);
                            return (
                              <div key={skill.name} className="space-y-1">
                                <div className="flex justify-between text-xs font-mono">
                                  <span className="text-white/80 font-medium">{skill.name}</span>
                                  <span className="text-indigo-300 font-bold">{skill.count} candidates</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                                    style={{ width: `${pct}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center text-xs text-white/40 py-8">No skills distribution calculated yet.</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Stats: Experience Distribution and Education Demographics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Experience distribution */}
                  <div className="glass-card p-6 rounded-2xl">
                    <h4 className="text-sm font-bold text-white mb-1">Experience Distribution</h4>
                    <p className="text-white/40 text-[11px] mb-4">Total years of experience brackets for matching profiles</p>

                    <div className="h-[200px] flex items-center justify-center">
                      {stats && stats.experienceDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stats.experienceDistribution} layout="vertical">
                            <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                            <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.6)" fontSize={10} width={100} tickLine={false} />
                            <Tooltip
                              contentStyle={{ background: "#0b071a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                              itemStyle={{ color: "#a855f7", fontSize: "11px", fontWeight: "bold" }}
                            />
                            <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={12} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-xs text-white/40">No data.</p>
                      )}
                    </div>
                  </div>

                  {/* Education distribution */}
                  <div className="glass-card p-6 rounded-2xl">
                    <h4 className="text-sm font-bold text-white mb-1">Education Brackets</h4>
                    <p className="text-white/40 text-[11px] mb-4">Educational backgrounds parsed from resumes</p>

                    <div className="h-[200px] flex items-center justify-center">
                      {stats && stats.educationDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={stats.educationDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={4}
                              dataKey="count"
                            >
                              {stats.educationDistribution.map((entry, index) => {
                                const colors = ["#6366f1", "#a855f7", "#3b82f6", "#10b981"];
                                return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                              })}
                            </Pie>
                            <Tooltip
                              contentStyle={{ background: "#0b071a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                              itemStyle={{ fontSize: "11px", fontWeight: "bold" }}
                            />
                            <Legend wrapperStyle={{ fontSize: "10px", color: "rgba(255,255,255,0.6)" }} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-xs text-white/40">No data.</p>
                      )}
                    </div>
                  </div>

                </div>

                {/* Quick Walkthrough helper */}
                <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                      <Sparkles size={14} /> Recruiter Presentation Tip
                    </h4>
                    <p className="text-xs text-white/70 leading-relaxed mt-1 max-w-2xl">
                      To showcase real-time vector embeddings and Gemini logic, navigate to the <strong>Upload Resumes</strong> or <strong>Job Specifications</strong> tabs. Paste or load some requirements, and witness TalentAI immediately regenerate semantic matches, score distributions, and detailed explanations.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("job-desc")}
                    className="shrink-0 flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl accent-gradient hover:accent-gradient-hover text-white transition-all shadow-md shadow-indigo-500/10 self-start md:self-auto"
                  >
                    Set New Job Scope
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* MODULE 2: JOB DESCRIPTION MODULE                          */}
            {/* ========================================================= */}
            {activeTab === "job-desc" && (
              <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-8 overflow-y-auto custom-scrollbar pr-2">
                
                {/* Left Side: Create / Analyze JD Form */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-white">Analyze Job Description</h3>
                      <button
                        type="button"
                        onClick={handleAddSampleJD}
                        className="text-[10px] text-indigo-400 font-bold hover:underline"
                      >
                        Insert Demo MLOps JD
                      </button>
                    </div>
                    <p className="text-white/40 text-[11px] mb-4">
                      Paste a technical job specification or drag a text/docx file. TalentAI parses requirements, defines critical skills vectors, and triggers pool-wide evaluation.
                    </p>

                    <form onSubmit={handleCreateJD} className="space-y-4">
                      <div>
                        <label className="block text-[10px] text-indigo-300 uppercase font-bold tracking-widest mb-1.5">
                          Job Spec Document (Txt / Docx / Pasted)
                        </label>
                        <textarea
                          rows={11}
                          className="w-full bg-black/30 border border-white/10 rounded-xl p-3.5 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono custom-scrollbar"
                          placeholder="Paste full job description text here..."
                          value={jdText}
                          onChange={(e) => setJdText(e.target.value)}
                        ></textarea>
                      </div>

                      {/* File Upload zone */}
                      <div className="p-4 border-2 border-dashed border-white/10 hover:border-indigo-500/40 rounded-xl text-center bg-white/[0.01] transition-all relative">
                        <input
                          type="file"
                          accept=".txt,.docx,.pdf,.pptx"
                          onChange={handleJdFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-1.5">
                          <Upload size={18} className="text-indigo-400" />
                          <p className="text-xs text-white/70 font-semibold">Upload specification file</p>
                          <p className="text-[10px] text-white/40">Supports PDF, Word, PPTX, and text specifications</p>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={analyzingJD}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl accent-gradient hover:accent-gradient-hover text-white text-xs font-bold transition-all disabled:opacity-50"
                      >
                        {analyzingJD ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            Analyzing with Gemini LLM...
                          </>
                        ) : (
                          <>
                            <Sparkles size={14} />
                            Parse & Analyze Requirements
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right Side: Active / Existing JDs list and parsed insights */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  {/* Extracted JD Info */}
                  {selectedJob && (
                    <div className="glass-card p-6 rounded-2xl flex flex-col gap-5">
                      <div className="flex justify-between items-start border-b border-white/5 pb-4">
                        <div>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono uppercase tracking-wider">
                            Extracted JD Schema
                          </span>
                          <h3 className="text-lg font-bold text-white mt-1.5">{selectedJob.title}</h3>
                          <p className="text-xs text-white/50">{selectedJob.industry} • {selectedJob.experience}</p>
                        </div>
                        <button
                          onClick={(e) => handleDeleteJob(selectedJob.id, e)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-white/40 hover:text-rose-400 transition-colors"
                          title="Delete job"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                        
                        {/* Skills Required */}
                        <div className="space-y-2">
                          <h4 className="font-bold text-indigo-300 uppercase tracking-widest text-[10px]">
                            Core Technologies Extracted (Vector Targets)
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedJob.skills.map((skill) => (
                              <span key={skill} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Preferred Skills */}
                        <div className="space-y-2">
                          <h4 className="font-bold text-indigo-300 uppercase tracking-widest text-[10px]">
                            Preferred & Nice-To-Have Skills
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedJob.preferredSkills.length > 0 ? (
                              selectedJob.preferredSkills.map((pSkill) => (
                                <span key={pSkill} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-200">
                                  {pSkill}
                                </span>
                              ))
                            ) : (
                              <span className="text-white/40 italic text-xs">None specified</span>
                            )}
                          </div>
                        </div>

                        {/* Key Responsibilities */}
                        <div className="space-y-2 md:col-span-2">
                          <h4 className="font-bold text-indigo-300 uppercase tracking-widest text-[10px]">
                            Key Recruiter Responsibilities
                          </h4>
                          <ul className="space-y-1.5 text-white/80 list-disc list-inside pl-1 leading-relaxed">
                            {selectedJob.responsibilities.map((resp, i) => (
                              <li key={i}>{resp}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Education Required */}
                        <div className="space-y-1">
                          <h4 className="font-bold text-indigo-300 uppercase tracking-widest text-[10px]">
                            Target Academic Level
                          </h4>
                          <p className="text-white/80 leading-relaxed font-medium">{selectedJob.education}</p>
                        </div>

                        {/* Soft Skills */}
                        <div className="space-y-1">
                          <h4 className="font-bold text-indigo-300 uppercase tracking-widest text-[10px]">
                            Behavior & Soft Skills Cues
                          </h4>
                          <p className="text-white/80 leading-relaxed font-medium">
                            {selectedJob.softSkills.join(", ") || "Collaborator, communicator"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Existing JD list for selection */}
                  <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3">
                      All Indexed Job Specifications ({jobs.length})
                    </h3>
                    <div className="space-y-2 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
                      {jobs.map((job) => (
                        <div
                          key={job.id}
                          onClick={() => setSelectedJob(job)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                            selectedJob?.id === job.id
                              ? "bg-white/10 border-white/20 text-white"
                              : "bg-white/[0.01] border-white/5 text-white/60 hover:bg-white/5"
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold">{job.title}</p>
                            <p className="text-[10px] text-white/40 mt-0.5">{job.industry} • {job.experience}</p>
                          </div>
                          <ChevronRight size={14} className={selectedJob?.id === job.id ? "text-indigo-400" : "text-white/20"} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================= */}
            {/* MODULE 3: RESUME UPLOAD MODULE                            */}
            {/* ========================================================= */}
            {activeTab === "resume" && (
              <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-8 overflow-y-auto custom-scrollbar pr-2">
                
                {/* Left side: Upload area */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  
                  {/* Pasting or Manual Parser */}
                  <div className="glass-card p-6 rounded-2xl flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-white">Paste Individual Resume</h3>
                      <button
                        onClick={handleAddSampleResume}
                        className="text-[10px] text-indigo-400 font-bold hover:underline"
                      >
                        Load Sample Sandro De Luca
                      </button>
                    </div>
                    <p className="text-white/40 text-[11px] mb-4">
                      Directly paste raw ASCII resume text. Our semantic parser uses Gemini 3.5 Flash to structured extraction.
                    </p>

                    <form onSubmit={handleCreateResume} className="space-y-4">
                      <div>
                        <label className="block text-[10px] text-white/50 uppercase font-bold tracking-widest mb-1.5">
                          Candidate Full Name / File Ref (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Sandro_Luca_CV.pdf"
                          className="w-full bg-black/30 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 mb-3"
                          value={pastedResumeName}
                          onChange={(e) => setPastedResumeName(e.target.value)}
                        />

                        <label className="block text-[10px] text-white/50 uppercase font-bold tracking-widest mb-1.5">
                          Resume Content Text
                        </label>
                        <textarea
                          rows={11}
                          className="w-full bg-black/30 border border-white/10 rounded-xl p-3.5 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono custom-scrollbar"
                          placeholder="Contact Info, Skills, Education, Work History..."
                          value={resumeText}
                          onChange={(e) => setResumeText(e.target.value)}
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={parsingResume}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl accent-gradient hover:accent-gradient-hover text-white text-xs font-bold transition-all disabled:opacity-50"
                      >
                        {parsingResume ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            Parsing & Calculating Embeddings...
                          </>
                        ) : (
                          <>
                            <Sparkles size={14} />
                            Parse & Save Resume
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right side: Bulk upload & Candidate List */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  
                  {/* Bulk file drop zone */}
                  <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-sm font-bold text-white mb-2">Bulk Resume Processing</h3>
                    <p className="text-white/40 text-[11px] mb-4">
                      Upload multiple candidate resume files simultaneously. Our model automatically parses each in the background and indexes their vector projections.
                    </p>

                    <div className="p-8 border-2 border-dashed border-white/10 hover:border-indigo-500/40 rounded-2xl text-center bg-white/[0.01] transition-all relative">
                      <input
                        type="file"
                        multiple
                        accept=".txt,.docx,.doc,.pdf,.pptx"
                        onChange={handleResumeMultipleUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-300">
                          <Upload size={32} />
                        </div>
                        <div>
                          <p className="text-sm text-white font-bold">Select Multiple Resumes</p>
                          <p className="text-xs text-white/40 mt-1">Supports PDF, Word, PPTX, and text resume files</p>
                        </div>
                        <span className="text-[10px] px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                          Batch Parser Ready
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Candidate list roster */}
                  <div className="glass-card p-6 rounded-2xl flex-1 flex flex-col min-h-0">
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3">
                      Currently Indexed Candidate Profiles ({searchQuery ? `${filteredCandidates.length} of ${candidates.length}` : candidates.length})
                    </h3>
                    <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-1 max-h-[300px]">
                      {filteredCandidates.map((cand) => {
                        const totalExp = cand.experience.reduce((sum, e) => sum + (e.yearsOfExp || 0), 0);
                        return (
                          <div
                            key={cand.id}
                            className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] flex justify-between items-center"
                          >
                            <div>
                              <p className="text-xs font-bold text-white">{cand.name}</p>
                              <p className="text-[10px] text-indigo-300 font-medium mt-0.5">
                                {cand.email} • {totalExp} Years Cumulative Experience
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {cand.skills.slice(0, 4).map((skill) => (
                                  <span key={skill} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/70">
                                    {skill}
                                  </span>
                                ))}
                                {cand.skills.length > 4 && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/40">
                                    +{cand.skills.length - 4}
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={(e) => handleDeleteCandidate(cand.id, e)}
                              className="p-1.5 rounded-lg hover:bg-rose-500/20 text-white/40 hover:text-rose-400 transition-colors shrink-0"
                              title="Delete profile"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* ========================================================= */}
            {/* MODULE 4: RANKING MATRIX DASHBOARD                        */}
            {/* ========================================================= */}
            {activeTab === "ranking" && (
              <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-8 overflow-hidden">
                
                {/* Left column: List of ranked candidate cards */}
                <div className="lg:col-span-4 flex flex-col min-h-0">
                  <div className="flex items-center justify-between mb-3 shrink-0">
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest">
                      Ranked Candidate Roster
                    </h3>
                    <span className="text-[10px] text-indigo-400 font-bold font-mono">
                      By Hybrid Scoring Engine
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
                    {activeJobCandidates.map((cand, idx) => {
                      const scoreObj = getCandidateScoreObj(cand.id);
                      const isSelected = selectedCandidate?.id === cand.id;
                      const scoreVal = scoreObj ? scoreObj.score : 0;
                      const totalExp = cand.experience.reduce((sum, e) => sum + (e.yearsOfExp || 0), 0);

                      return (
                        <div
                          key={cand.id}
                          onClick={() => setSelectedCandidate(cand)}
                          className={`glass-card p-4 rounded-2xl cursor-pointer transition-all border-l-4 ${
                            isSelected
                              ? "bg-white/10 border-l-indigo-500 border-white/20 shadow-md"
                              : "border-l-transparent hover:bg-white/5"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <div>
                              <h4 className="font-bold text-white text-xs">{cand.name}</h4>
                              <p className="text-[10px] text-white/50">{cand.summary.slice(0, 50)}...</p>
                            </div>
                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl font-mono tracking-tight shrink-0 shadow-sm ${
                              scoreVal >= 85 
                                ? "bg-green-500/20 text-green-400 border border-green-500/20"
                                : scoreVal >= 70
                                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/20"
                                : "bg-white/10 text-white/70 border border-white/10"
                            }`}>
                              {scoreVal}%
                            </span>
                          </div>

                          <p className="text-[10px] text-indigo-400 font-semibold mb-2.5">
                            Rank #{idx + 1} • {totalExp} Years Exp
                          </p>

                          <div className="flex flex-wrap gap-1">
                            {cand.skills.slice(0, 3).map((skill) => (
                              <span key={skill} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/80">
                                {skill}
                              </span>
                            ))}
                            {cand.skills.length > 3 && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/40 font-mono">
                                +{cand.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right column: In-depth report with explainable AI */}
                <div className="lg:col-span-8 flex flex-col min-h-0">
                  {selectedCandidate ? (
                    <div className="glass-card rounded-2xl flex-1 flex flex-col overflow-hidden">
                      
                      {/* Header bar of candidate profile */}
                      <div className="p-6 border-b border-white/5 bg-white/[0.01] shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl accent-gradient flex items-center justify-center text-xl font-black text-white shadow-lg shadow-indigo-500/10 shrink-0">
                            {selectedCandidate.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                              {selectedCandidate.name}
                              {currentCandidateScore && currentCandidateScore.score >= 85 && (
                                <span className="text-[9px] px-2 py-0.5 rounded bg-green-500/20 text-green-400 font-mono font-bold uppercase tracking-wider">
                                  Top Match
                                </span>
                              )}
                            </h3>
                            <p className="text-xs text-indigo-300 font-semibold flex items-center gap-1.5 mt-0.5">
                              {selectedCandidate.email} • {selectedCandidate.phone}
                            </p>
                          </div>
                        </div>

                        {/* Top quick metrics */}
                        <div className="flex gap-3">
                          <div className="bg-white/5 px-4 py-2 rounded-xl text-center min-w-[80px] border border-white/10">
                            <p className="text-[9px] text-white/40 uppercase font-bold">Fit Score</p>
                            <p className="text-base font-extrabold text-white font-mono">{currentCandidateScore?.score || "N/A"}%</p>
                          </div>
                          <div className="accent-gradient px-4 py-2 rounded-xl text-center min-w-[80px] shadow-md shadow-indigo-500/10">
                            <p className="text-[9px] text-indigo-100 uppercase font-bold">Global Rank</p>
                            <p className="text-base font-extrabold text-white font-mono">#{currentCandidateScore?.rank || "1"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Content panel */}
                      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6">
                        
                        {/* Summary & Tags */}
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                            Candidate Profile Summary
                          </h4>
                          <p className="text-xs text-white/80 leading-relaxed font-medium">
                            {selectedCandidate.summary}
                          </p>
                        </div>

                        {/* Hybrid Score breakdown sliders */}
                        {currentCandidateScore && (
                          <div className="space-y-4 pt-2 border-t border-white/5">
                            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                              Hybrid Score Factor Breakdown
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs font-mono">
                                  <span className="text-white/60">Semantic Similarity (40%)</span>
                                  <span className="text-indigo-300 font-bold">{currentCandidateScore.breakdown.semantic}</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${currentCandidateScore.breakdown.semantic}%` }}></div>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-xs font-mono">
                                  <span className="text-white/60">Work History & Seniority (20%)</span>
                                  <span className="text-indigo-300 font-bold">{currentCandidateScore.breakdown.experience}</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${currentCandidateScore.breakdown.experience}%` }}></div>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-xs font-mono">
                                  <span className="text-white/60">Skills Overlap (15%)</span>
                                  <span className="text-indigo-300 font-bold">{currentCandidateScore.breakdown.skills}</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${currentCandidateScore.breakdown.skills}%` }}></div>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-xs font-mono">
                                  <span className="text-white/60">Portfolio Relevance (10%)</span>
                                  <span className="text-indigo-300 font-bold">{currentCandidateScore.breakdown.projects}</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${currentCandidateScore.breakdown.projects}%` }}></div>
                                </div>
                              </div>

                            </div>
                          </div>
                        )}

                        {/* Explainable AI block */}
                        {currentCandidateScore && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                            
                            {/* Key Strengths */}
                            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10 space-y-2">
                              <h5 className="text-[10px] font-bold text-green-400 uppercase tracking-wider flex items-center gap-1.5">
                                <CheckCircle size={12} /> Recruitment Strengths (Pros)
                              </h5>
                              <ul className="space-y-1.5 text-xs text-green-300/80 list-disc list-inside">
                                {currentCandidateScore.explanation.pros.map((pro, i) => (
                                  <li key={i} className="leading-normal">{pro}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Weaknesses / Gaps */}
                            <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10 space-y-2">
                              <h5 className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                                <AlertTriangle size={12} /> Limitations / Missing Elements
                              </h5>
                              <ul className="space-y-1.5 text-xs text-yellow-300/80 list-disc list-inside">
                                {currentCandidateScore.explanation.cons.map((con, i) => (
                                  <li key={i} className="leading-normal">{con}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Full Recruiter Recommendation fit */}
                            <div className="md:col-span-2 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 space-y-1.5">
                              <h5 className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                                Strategic AI Recommendation
                              </h5>
                              <p className="text-xs text-indigo-100/90 leading-relaxed font-medium">
                                {currentCandidateScore.explanation.recommendation}
                              </p>
                            </div>

                            {/* Custom Interview Questions */}
                            <div className="md:col-span-2 p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                              <h5 className="text-[10px] font-bold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                                <MessageSquare size={12} /> Tailored Screening Questions
                              </h5>
                              <div className="space-y-1.5">
                                {currentCandidateScore.explanation.interviewQuestions.map((q, idx) => (
                                  <div key={idx} className="p-2.5 rounded bg-black/20 text-xs text-white/90 leading-relaxed border border-white/5">
                                    <strong className="text-indigo-300 mr-1">Q{idx + 1}:</strong> {q}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Recruiter Email Draft */}
                            <div className="md:col-span-2 p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                              <div className="flex items-center justify-between">
                                <h5 className="text-[10px] font-bold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                                  <Mail size={12} /> Recruiter Copilot: Email Template Draft
                                </h5>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(currentCandidateScore.explanation.emailDraft);
                                    setAlert({ type: "success", text: "Email template copied to clipboard!" });
                                  }}
                                  className="text-[10px] text-indigo-400 font-bold hover:underline"
                                >
                                  Copy Template
                                </button>
                              </div>
                              <pre className="p-3 bg-black/30 border border-white/5 rounded-lg text-xs font-mono text-white/80 whitespace-pre-wrap leading-relaxed overflow-x-auto custom-scrollbar">
                                {currentCandidateScore.explanation.emailDraft}
                              </pre>
                            </div>

                          </div>
                        )}

                        {/* Experience Timeline */}
                        <div className="space-y-3 pt-4 border-t border-white/5">
                          <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                            Professional Timeline History
                          </h4>
                          <div className="space-y-3">
                            {selectedCandidate.experience.map((exp, idx) => (
                              <div key={idx} className="relative pl-4 border-l border-white/10">
                                <div className="absolute left-[-4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border border-white"></div>
                                <p className="text-xs font-bold text-white">
                                  {exp.role} — <span className="text-indigo-300">{exp.company}</span>
                                </p>
                                <p className="text-[10px] text-white/40 mt-0.5">{exp.duration} ({exp.yearsOfExp} years calculated)</p>
                                <p className="text-xs text-white/70 leading-relaxed mt-1">{exp.details}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Education details */}
                        <div className="space-y-3 pt-4 border-t border-white/5">
                          <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                            Education Profile
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            {selectedCandidate.education.map((edu, idx) => (
                              <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10">
                                <p className="font-bold text-white">{edu.degree}</p>
                                <p className="text-white/60 mt-0.5">{edu.school} • {edu.year}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Projects portfolio list */}
                        <div className="space-y-3 pt-4 border-t border-white/5">
                          <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                            Technical Portfolios & Projects
                          </h4>
                          <div className="space-y-3">
                            {selectedCandidate.projects.map((proj, idx) => (
                              <div key={idx} className="p-4 rounded-xl bg-[#0b071a] border border-white/5 space-y-2">
                                <div className="flex justify-between items-start">
                                  <p className="text-xs font-bold text-white">{proj.title}</p>
                                  <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                                    Project
                                  </span>
                                </div>
                                <p className="text-xs text-white/70 leading-relaxed">{proj.description}</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {proj.technologies.map((t) => (
                                    <span key={t} className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-white/80 border border-white/10">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Behavioral Traits */}
                        <div className="space-y-2 pt-4 border-t border-white/5">
                          <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                            Recruiter Behavioral Signals Cues
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedCandidate.behaviorSignals.map((sig, i) => (
                              <span key={i} className="text-xs px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200">
                                {sig}
                              </span>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-xs text-white/40 glass-card rounded-2xl">
                      Select a candidate from the roster on the left to display report analysis.
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ========================================================= */}
            {/* MODULE 5: CANDIDATE COMPARISON PAGE                       */}
            {/* ========================================================= */}
            {activeTab === "comparison" && (
              <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
                
                {/* Selector Bars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Select candidate A */}
                  <div className="glass-card p-5 rounded-2xl space-y-3">
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">
                      Primary Candidate (A)
                    </label>
                    <select
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                      value={compareCandA?.id || ""}
                      onChange={(e) => {
                        const found = candidates.find((c) => c.id === e.target.value);
                        if (found) setCompareCandA(found);
                      }}
                    >
                      <option value="" className="bg-[#0b071a]">Select Candidate A</option>
                      {filteredCandidates.map((c) => (
                        <option key={c.id} value={c.id} className="bg-[#0b071a]">{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Select candidate B */}
                  <div className="glass-card p-5 rounded-2xl space-y-3">
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">
                      Compare Candidate (B)
                    </label>
                    <select
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                      value={compareCandB?.id || ""}
                      onChange={(e) => {
                        const found = candidates.find((c) => c.id === e.target.value);
                        if (found) setCompareCandB(found);
                      }}
                    >
                      <option value="" className="bg-[#0b071a]">Select Candidate B</option>
                      {filteredCandidates.map((c) => (
                        <option key={c.id} value={c.id} className="bg-[#0b071a]">{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Main comparison matrix */}
                {compareCandA && compareCandB ? (
                  <div className="space-y-6">
                    
                    {/* Visual Comparison cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Card A */}
                      <div className="glass-card p-6 rounded-2xl relative border-l-4 border-l-indigo-500">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">CANDIDATE A</span>
                            <h3 className="text-lg font-bold text-white mt-1">{compareCandA.name}</h3>
                            <p className="text-xs text-white/50">{compareCandA.email}</p>
                          </div>
                          <span className="text-2xl font-black text-indigo-300 font-mono">
                            {selectedJob ? getCandidateScoreObj(compareCandA.id)?.score || "N/A" : "N/A"}%
                          </span>
                        </div>
                        <p className="text-xs text-white/80 leading-relaxed mb-4">{compareCandA.summary}</p>
                      </div>

                      {/* Card B */}
                      <div className="glass-card p-6 rounded-2xl relative border-l-4 border-l-purple-500">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">CANDIDATE B</span>
                            <h3 className="text-lg font-bold text-white mt-1">{compareCandB.name}</h3>
                            <p className="text-xs text-white/50">{compareCandB.email}</p>
                          </div>
                          <span className="text-2xl font-black text-purple-300 font-mono">
                            {selectedJob ? getCandidateScoreObj(compareCandB.id)?.score || "N/A" : "N/A"}%
                          </span>
                        </div>
                        <p className="text-xs text-white/80 leading-relaxed mb-4">{compareCandB.summary}</p>
                      </div>
                    </div>

                    {/* Compare Table */}
                    <div className="glass-card rounded-2xl overflow-hidden">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-white/5 text-indigo-300 uppercase font-mono tracking-wider font-bold">
                            <th className="p-4">Dimension</th>
                            <th className="p-4">Candidate A: {compareCandA.name}</th>
                            <th className="p-4">Candidate B: {compareCandB.name}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          <tr>
                            <td className="p-4 font-bold text-white/70">Cumulative Experience</td>
                            <td className="p-4">
                              {compareCandA.experience.reduce((sum, e) => sum + (e.yearsOfExp || 0), 0)} Years
                            </td>
                            <td className="p-4">
                              {compareCandB.experience.reduce((sum, e) => sum + (e.yearsOfExp || 0), 0)} Years
                            </td>
                          </tr>
                          <tr>
                            <td className="p-4 font-bold text-white/70">Academic Background</td>
                            <td className="p-4">
                              {compareCandA.education.map((e) => `${e.degree} (${e.school})`).join(", ")}
                            </td>
                            <td className="p-4">
                              {compareCandB.education.map((e) => `${e.degree} (${e.school})`).join(", ")}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-4 font-bold text-white/70">Key Technologies Overlap</td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1">
                                {compareCandA.skills.map((s) => (
                                  <span key={s} className="px-1.5 py-0.5 rounded bg-white/5 text-white/80 border border-white/5 text-[9px]">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1">
                                {compareCandB.skills.map((s) => (
                                  <span key={s} className="px-1.5 py-0.5 rounded bg-white/5 text-white/80 border border-white/5 text-[9px]">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-4 font-bold text-white/70">Active Portfolios</td>
                            <td className="p-4">
                              <ul className="list-disc list-inside space-y-1">
                                {compareCandA.projects.map((p) => (
                                  <li key={p.title}>{p.title}</li>
                                ))}
                              </ul>
                            </td>
                            <td className="p-4">
                              <ul className="list-disc list-inside space-y-1">
                                {compareCandB.projects.map((p) => (
                                  <li key={p.title}>{p.title}</li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-4 font-bold text-white/70">Strengths Highlight</td>
                            <td className="p-4">
                              <ul className="list-disc list-inside space-y-1 text-green-300">
                                {selectedJob ? getCandidateScoreObj(compareCandA.id)?.explanation.pros.slice(0, 2).map((p, i) => (
                                  <li key={i}>{p}</li>
                                )) : <li>Decent overlap</li>}
                              </ul>
                            </td>
                            <td className="p-4">
                              <ul className="list-disc list-inside space-y-1 text-green-300">
                                {selectedJob ? getCandidateScoreObj(compareCandB.id)?.explanation.pros.slice(0, 2).map((p, i) => (
                                  <li key={i}>{p}</li>
                                )) : <li>Robust skills</li>}
                              </ul>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Comparative Verdict block */}
                    <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                        <Sparkles size={14} /> TalentAI Fit Decision Matrix Verdict
                      </h4>
                      <p className="text-xs text-white/80 leading-relaxed font-medium">
                        {getComparisonRecommendation()}
                      </p>
                    </div>

                  </div>
                ) : (
                  <div className="h-[280px] flex flex-col items-center justify-center text-xs text-white/40 glass-card rounded-2xl">
                    Please select both Candidate A and Candidate B from the dropdown controllers to compute the compare matrix.
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* MODULE 6: RECRUITER COPILOT CHAT                          */}
            {/* ========================================================= */}
            {activeTab === "chat" && (
              <div className="flex-1 flex flex-col overflow-hidden glass-card rounded-2xl border border-white/5 bg-white/[0.01]">
                
                {/* Chat window top header */}
                <div className="p-4 border-b border-white/5 bg-white/[0.01] shrink-0 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <div>
                      <h3 className="text-xs font-bold text-white">Active Recruiter AI Assistant</h3>
                      <p className="text-[10px] text-white/40">Powered by Gemini 3.5 Flash & Semantic Retrieval</p>
                    </div>
                  </div>
                  
                  {/* Preset quick questions */}
                  <div className="hidden lg:flex items-center gap-2">
                    <button
                      onClick={() => setChatInput("Find experienced NLP engineers with Python")}
                      className="text-[10px] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg text-indigo-300 font-medium transition-all"
                    >
                      "Find NLP engineers"
                    </button>
                    <button
                      onClick={() => setChatInput("Draft an interview prep screening check for Priya")}
                      className="text-[10px] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg text-indigo-300 font-medium transition-all"
                    >
                      "Interview check for Priya"
                    </button>
                  </div>
                </div>

                {/* Messages roster */}
                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4">
                  {chatHistory.map((msg) => {
                    const isAi = msg.sender === "ai";
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 max-w-[80%] ${isAi ? "self-start" : "ml-auto flex-row-reverse"}`}
                      >
                        {/* Initials badge */}
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-md ${
                          isAi ? "accent-gradient text-white" : "bg-white/10 text-indigo-200 border border-white/10"
                        }`}>
                          {isAi ? "AI" : "RC"}
                        </div>

                        {/* Bubble */}
                        <div className="space-y-1">
                          <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                            isAi 
                              ? "bg-white/5 text-white/95 border border-white/5" 
                              : "accent-gradient text-white"
                          }`}>
                            {renderMarkdown(msg.text)}
                          </div>
                          <span className={`text-[9px] block text-white/30 font-mono px-1.5 ${isAi ? "text-left" : "text-right"}`}>
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing/Loading block */}
                  {chatLoading && (
                    <div className="flex gap-3 self-start max-w-[60%]">
                      <div className="w-8 h-8 rounded-xl accent-gradient flex items-center justify-center font-bold text-xs shrink-0 animate-pulse">
                        AI
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-white/50 flex items-center gap-2">
                        <RefreshCw size={12} className="animate-spin text-indigo-400" />
                        Analyzing candidates & scoring matrix...
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer text field */}
                <form onSubmit={handleSendChat} className="p-4 border-t border-white/5 bg-[#0b071a]/40 shrink-0 flex gap-3">
                  <input
                    type="text"
                    placeholder="Ask Copilot, e.g., 'Compare Sarah Chen and Priya Sharma's strengths'..."
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={chatLoading}
                    className="px-5 py-3 rounded-xl accent-gradient hover:accent-gradient-hover text-white text-xs font-bold shadow-md shadow-indigo-500/10 transition-all disabled:opacity-50"
                  >
                    Ask AI
                  </button>
                </form>

              </div>
            )}

          </div>

          {/* Footer branding */}
          <footer className="h-10 shrink-0 flex items-center justify-between px-8 border-t border-white/5 bg-white/[0.01] text-[10px] text-white/30">
            <p>TalentAI • Powered by Gemini 3.5 Flash & High Density Vector Matcher</p>
            <p>Data & AI Challenge Edition • 2026</p>
          </footer>

        </main>

      </div>
    </div>
  );
}
