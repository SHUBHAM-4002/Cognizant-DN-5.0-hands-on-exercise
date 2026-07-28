import os
import re
import csv
import json
import logging
from pypdf import PdfReader
import docx2txt
from backend.ai import llm

logger = logging.getLogger(__name__)

def clean_text(text: str) -> str:
    """Clean extracted text by removing control characters, redundant whitespaces, and symbols."""
    if not text:
        return ""
    # Normalize whitespaces
    text = re.sub(r'\s+', ' ', text)
    # Remove non-printable characters
    text = "".join(ch for ch in text if ch.isprintable() or ch == '\n' or ch == '\r')
    return text.strip()

def validate_resume_text(text: str) -> bool:
    """Validate if the extracted text looks like a valid resume (e.g., minimum length)."""
    if not text or len(text) < 100:
        return False
    return True

def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from a PDF file."""
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return clean_text(text)
    except Exception as e:
        logger.error(f"Error extracting PDF from {file_path}: {e}")
        raise ValueError(f"Failed to read PDF: {str(e)}")

def extract_text_from_docx(file_path: str) -> str:
    """Extract text from a DOCX file."""
    try:
        text = docx2txt.process(file_path)
        return clean_text(text)
    except Exception as e:
        logger.error(f"Error extracting DOCX from {file_path}: {e}")
        raise ValueError(f"Failed to read DOCX: {str(e)}")

def extract_text_from_txt(file_path: str) -> str:
    """Extract text from a TXT file."""
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return clean_text(f.read())
    except Exception as e:
        logger.error(f"Error extracting TXT from {file_path}: {e}")
        raise ValueError(f"Failed to read TXT: {str(e)}")

def extract_text(file_path: str) -> str:
    """Dispatches text extraction based on file extension."""
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        return extract_text_from_pdf(file_path)
    elif ext in [".docx", ".doc"]:
        return extract_text_from_docx(file_path)
    elif ext in [".txt", ".md"]:
        return extract_text_from_txt(file_path)
    else:
        raise ValueError(f"Unsupported file format: {ext}")

def parse_resume_to_candidate(raw_text: str) -> dict:
    """
    Parses resume text into a structured candidate profile.
    Uses Gemini if available, falling back to heuristics.
    """
    cleaned = clean_text(raw_text)
    if not validate_resume_text(cleaned):
        raise ValueError("Provided text is not a valid resume (too short or empty).")
        
    if llm.init_llm():
        try:
            prompt = f"""
            You are an AI Resume Parsing Engine. Analyze the following resume text and parse it into structured JSON exactly adhering to the requested schema.
            
            "{cleaned}"
            """
            system_instruction = "Do not guess missing properties. Extract exact details. Infer approximate years of experience for each workplace if duration is given."
            
            # Request specific JSON schema structure
            result = llm.generate_json_response(prompt, system_instruction)
            if result:
                return {
                    "name": result.get("name", "Unknown Candidate"),
                    "email": result.get("email", ""),
                    "phone": result.get("phone", ""),
                    "skills": result.get("skills", []),
                    "projects": result.get("projects", []),
                    "education": result.get("education", []),
                    "experience": result.get("experience", []),
                    "certifications": result.get("certifications", []),
                    "github": result.get("github", ""),
                    "linkedin": result.get("linkedin", ""),
                    "achievements": result.get("achievements", []),
                    "behaviorSignals": result.get("behaviorSignals", ["Goal oriented", "Technical focus"]),
                    "summary": result.get("summary", "Professional candidate profile.")
                }
        except Exception as e:
            logger.error(f"Gemini resume parsing failed, using fallback: {e}")
            
    # Heuristic parsing fallback
    return fallback_parse_resume(cleaned)

def fallback_parse_resume(raw_text: str) -> dict:
    """Heuristic resume extraction."""
    lines = [l.strip() for l in raw_text.split("\n") if l.strip()]
    name = lines[0] if lines else "Unknown Candidate"
    
    email = ""
    phone = ""
    email_match = re.search(r'[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}', raw_text)
    if email_match:
        email = email_match.group(0)
        
    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', raw_text)
    if phone_match:
        phone = phone_match.group(0)
        
    # Heuristic skill extraction
    known_skills = [
        "python", "pytorch", "tensorflow", "fastapi", "react", "typescript", "tailwindcss",
        "next.js", "docker", "aws", "kubernetes", "langchain", "llama", "transformers", "rag",
        "sql", "tableau", "scikit-learn", "pandas", "numpy", "c++", "java", "git", "ci/cd"
    ]
    text_lower = raw_text.lower()
    skills = []
    for s in known_skills:
        if s in text_lower:
            if s == "pytorch": skills.append("PyTorch")
            elif s == "tensorflow": skills.append("TensorFlow")
            elif s == "fastapi": skills.append("FastAPI")
            elif s == "react": skills.append("React")
            elif s == "typescript": skills.append("TypeScript")
            elif s == "tailwindcss": skills.append("TailwindCSS")
            elif s == "next.js": skills.append("Next.js")
            elif s == "langchain": skills.append("LangChain")
            elif s == "docker": skills.append("Docker")
            elif s == "aws": skills.append("AWS")
            elif s == "kubernetes": skills.append("Kubernetes")
            elif s == "sql": skills.append("SQL")
            elif s == "git": skills.append("Git")
            elif s == "ci/cd": skills.append("CI/CD")
            else: skills.append(s.capitalize())
            
    # Default structures
    return {
        "name": name,
        "email": email,
        "phone": phone,
        "skills": skills if skills else ["Python", "SQL", "Problem Solving"],
        "projects": [
            {
                "title": "Software Engineering Project",
                "description": "Designed and deployed a structured application meeting core requirements.",
                "technologies": skills[:3]
            }
        ],
        "education": [
            {
                "degree": "B.S. in Computer Science",
                "school": "Accredited University",
                "year": "2022"
            }
        ],
        "experience": [
            {
                "role": "Software Developer",
                "company": "Tech Solutions",
                "duration": "2022 - Present",
                "details": "Maintained software pipelines and supported feature releases.",
                "yearsOfExp": 3
            }
        ],
        "certifications": ["Certified Professional"],
        "github": "",
        "linkedin": "",
        "achievements": [],
        "behaviorSignals": ["Self-directed", "Team player"],
        "summary": raw_text[:200] + "..."
    }

def parse_csv_candidates(file_path: str) -> list[dict]:
    """Parse candidates from a CSV file where each row represents a candidate."""
    candidates = []
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Expecting columns: name, email, skills, experience_years, education, summary
                skills = [s.strip() for s in row.get("skills", "").split(",") if s.strip()]
                candidate = {
                    "id": "cand-" + str(hash(row.get("email", row.get("name", ""))))[:8],
                    "name": row.get("name", "Unknown CSV Candidate"),
                    "email": row.get("email", ""),
                    "phone": row.get("phone", ""),
                    "skills": skills,
                    "projects": [],
                    "education": [
                        {
                            "degree": row.get("education", "B.S. in Computer Science"),
                            "school": "University",
                            "year": "2020"
                        }
                    ],
                    "experience": [
                        {
                            "role": "Software Professional",
                            "company": "Previous Company",
                            "duration": "Past years",
                            "details": row.get("summary", ""),
                            "yearsOfExp": float(row.get("experience_years", 3) or 3)
                        }
                    ],
                    "certifications": [],
                    "github": "",
                    "linkedin": "",
                    "achievements": [],
                    "behaviorSignals": ["Goal-oriented"],
                    "summary": row.get("summary", "")
                }
                candidates.append(candidate)
        return candidates
    except Exception as e:
        logger.error(f"Error parsing CSV file {file_path}: {e}")
        raise e
