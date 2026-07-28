# 🚀 TalentAI - AI-Powered Intelligent Candidate Ranking System

> **Hire by Understanding, Not Keywords**

TalentAI is an AI-powered recruitment intelligence platform built for the **Data & AI Challenge**. Unlike traditional Applicant Tracking Systems (ATS) that rely on keyword matching, TalentAI uses **Natural Language Processing (NLP), Semantic Search, Vector Embeddings, Hybrid AI Scoring, and Explainable AI** to identify and rank the best candidates based on a job description.

---

# 📌 Problem Statement

Recruiters often miss highly qualified candidates because traditional ATS systems rely on exact keyword matching.

TalentAI solves this by:

- Understanding the Job Description
- Understanding the complete Candidate Profile
- Performing semantic matching instead of keyword matching
- Generating recruiter-friendly candidate rankings
- Explaining why each candidate is recommended

---

# 🎯 Features

## 🤖 AI Job Description Analyzer

- Extracts required skills
- Identifies preferred skills
- Determines experience requirements
- Understands responsibilities
- Detects education requirements
- Identifies industry/domain
- Extracts technology stack

---

## 👤 Candidate Intelligence

TalentAI analyzes each candidate using:

- Skills
- Experience
- Career History
- Education
- Certifications
- Projects
- Behavioral Signals
- Platform Activity
- Professional Summary

---

## 🧠 Semantic Search

Instead of matching keywords, TalentAI understands meaning using vector embeddings.

Example searches:

- Python Developer with AWS
- AI Engineer with NLP experience
- HR Manager with Recruitment experience
- Data Scientist with Machine Learning

---

## ⚡ Hybrid AI Ranking Engine

Candidate ranking is generated using multiple intelligent factors.

| Component | Weight |
|-----------|--------|
| Semantic Similarity | 35% |
| Skill Match | 20% |
| Experience Match | 15% |
| Career History | 10% |
| Education | 5% |
| Certifications | 5% |
| Platform Signals | 10% |

Final Score = Weighted Hybrid Score

---

## 🔍 Explainable AI

Every recommendation includes:

- Overall Match Score
- Strengths
- Weaknesses
- Missing Skills
- Skill Gap
- Hiring Recommendation
- Confidence Score

---

## 📊 Recruiter Dashboard

Features include:

- Candidate Ranking
- AI Analytics
- Candidate Comparison
- Semantic Search
- Recruiter Copilot
- Skill Distribution
- Hiring Funnel
- Score Analytics
- Export Reports

---

# 🏗️ System Architecture

```
                     Job Description
                            │
                            ▼
                  AI Job Analyzer (LLM)
                            │
                            ▼
                  Refactored API timeout & fallbacks
                            │
                            ▼
                  Wait for python/node sync
                            │
 ──────────────────────────────────────────────────────────────

                  Candidate Dataset (JSONL)
                            │
                            ▼
                  Dataset Loader & Validator
                            │
                            ▼
                   Candidate Profile Builder
                            │
                            ▼
              Generate Candidate Embeddings
                            │
                            ▼
                      FAISS Vector Index
                            │
                            ▼
                  Semantic Candidate Search
                            │
                            ▼
                  Hybrid AI Ranking Engine
                            │
                            ▼
                  Explainable AI Generator
                            │
                            ▼
                  Recruiter Dashboard
                            │
                            ▼
                submission.csv / PDF Report
```

---

# 📂 Project Structure

```
TalentAI/
│
├── assets/
│
├── backend/
│   ├── ai/
│   ├── api/
│   ├── config/
│   ├── dataset/
│   ├── ranking/
│   ├── reports/
│   └── vector/
│
├── datasets/
│   ├── candidates.jsonl
│   ├── candidate_schema.json
│   ├── job_description.docx
│   ├── sample_submission.csv
│   ├── validate_submission.py
│   └── redrob_signals_doc.docx
│
├── outputs/
│
├── src/
│
├── faiss_index.bin
├── faiss_metadata.json
├── package.json
├── server.ts
└── README.md
```

---

# 🛠 Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide Icons

---

## Backend

- Python
- FastAPI
- Node.js
- Express

---

## Artificial Intelligence

- Sentence Transformers
- FAISS
- Google Gemini
- LangChain
- Scikit-learn
- Pandas

---

## Data Processing

- JSONL
- DOCX
- CSV

---

# 📊 AI Pipeline

```
Job Description

↓

LLM Analysis

↓

Embedding Generation

↓

Candidate Dataset

↓

Candidate Embeddings

↓

FAISS Search

↓

Semantic Similarity

↓

Hybrid Scoring

↓

Explainable AI

↓

Ranked Candidates
```

---

# 📈 Ranking Formula

```
Final Score =

0.35 × Semantic Similarity

+

0.20 × Skills Match

+

0.15 × Experience Match

+

0.10 × Career History

+

0.05 × Education

+

0.05 × Certifications

+

0.10 × Redrob Platform Signals
```

---

# 📦 Dataset

This project uses the official **Data & AI Challenge** dataset provided by the organizers.

Dataset includes:

- Candidate Profiles
- Job Description
- Candidate Schema
- Platform Signals
- Validation Script
- Submission Template

---

# 📤 Output

TalentAI generates:

- Ranked Candidate List
- Candidate Scores
- AI Explanations
- Recruiter Summary
- submission.csv
- PDF Reports

---

# 📊 Dashboard Features

- AI Candidate Ranking
- Candidate Comparison
- Analytics Dashboard
- Semantic Candidate Search
- Recruiter Copilot
- Explainable AI
- Skill Distribution
- Hiring Insights

---

# 🤖 Recruiter Copilot

Recruiters can ask:

- Why is Candidate A ranked first?
- Compare Candidate A and Candidate B.
- Find candidates with Python and AWS.
- Generate interview questions.
- Show missing skills.
- Summarize top candidates.

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/TalentAI.git
```

---

## Install Frontend

```bash
npm install
```

---

## Install Backend

```bash
pip install -r requirements.txt
```

---

## Start Frontend

```bash
npm run dev
```

---

## Start Backend

```bash
python server.py
```

---

# 📄 Environment Variables

Create a `.env` file:

```env
GEMINI_API_KEY=YOUR_API_KEY
EMBEDDING_MODEL=all-MiniLM-L6-v2
FAISS_INDEX_PATH=faiss_index.bin
```

---

# 🎯 Future Improvements

- Multi-language Resume Support
- Voice-Based Recruiter Assistant
- Interview Scheduling
- Candidate Skill Graph
- Bias Detection
- Salary Prediction
- Resume Quality Score
- Career Growth Prediction
- AI Talent Recommendation Engine

---

# 📚 Challenge Deliverables

- ✅ Working AI Recruitment Platform
- ✅ GitHub Repository
- ✅ Presentation (PDF)
- ✅ Ranked Candidate Output
- ✅ Explainable AI
- ✅ Hybrid AI Ranking Engine
- ✅ Semantic Search
- ✅ Recruiter Dashboard

---

# 👨‍💻 Developed By

**KARTIK SINGH**,
**SHUBHAM KUMAR**,
**RAKSHITA PRADHAN**

AI & Data Science Engineer And Cyber security

Built for the **Data & AI Challenge** using Artificial Intelligence, Semantic Search, and Explainable AI.

---

# ⭐ Acknowledgements

- Data & AI Challenge Organizers
- Google Gemini
- Sentence Transformers
- FAISS
- FastAPI
- React
- Vite
- Tailwind CSS

---

## 📜 License

This project is developed for educational and hackathon purposes.
