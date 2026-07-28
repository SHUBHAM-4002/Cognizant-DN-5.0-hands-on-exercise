export interface JobDescription {
  id: string;
  title: string;
  experience: string;
  skills: string[];
  education: string;
  responsibilities: string[];
  preferredSkills: string[];
  industry: string;
  softSkills: string[];
  rawText: string;
  createdAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  projects: {
    title: string;
    description: string;
    technologies: string[];
  }[];
  education: {
    degree: string;
    school: string;
    year: string;
  }[];
  experience: {
    role: string;
    company: string;
    duration: string;
    details: string;
    yearsOfExp: number;
  }[];
  certifications: string[];
  github?: string;
  linkedin?: string;
  achievements: string[];
  behaviorSignals: string[];
  summary: string;
  createdAt: string;
}

export interface ScoreBreakdown {
  semantic: number; // 40%
  experience: number; // 20%
  skills: number; // 15%
  projects: number; // 10%
  education: number; // 5%
  certifications: number; // 5%
  behavior: number; // 5%
}

export interface ScoreExplanation {
  pros: string[];
  cons: string[];
  skillGap: string[];
  recommendation: string;
  interviewQuestions: string[];
  emailDraft: string;
}

export interface CandidateScore {
  candidateId: string;
  jobId: string;
  score: number;
  rank: number;
  breakdown: ScoreBreakdown;
  explanation: ScoreExplanation;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface RecruiterStats {
  totalCandidates: number;
  topMatches: number;
  averageScore: number;
  skillsDistribution: { name: string; count: number }[];
  experienceDistribution: { name: string; count: number }[];
  educationDistribution: { name: string; count: number }[];
  scoreHistogram: { range: string; count: number }[];
}
