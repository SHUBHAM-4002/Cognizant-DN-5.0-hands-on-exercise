import logging
import re
from backend.ai import llm

logger = logging.getLogger(__name__)

def analyze_job_description(raw_text: str) -> dict:
    """
    Extract structured requirements from raw JD text using Gemini, falling back to heuristics.
    """
    if not raw_text or not raw_text.strip():
        raise ValueError("Job description text cannot be empty.")
        
    if llm.init_llm():
        try:
            prompt = f"""
            You are an expert technical recruiter. Analyze the following job description text and extract structured fields in JSON format:
            
            "{raw_text}"
            """
            system_instruction = (
                "Extract detailed job specifications. Be literal and accurate. Standardize technology names. "
                "Identify required skills, preferred skills, industry, role, seniority, responsibilities, soft skills, "
                "education, years of experience, tools, and technology stack."
            )
            
            result = llm.generate_json_response(prompt, system_instruction)
            if result:
                return {
                    "title": result.get("title", "Software Engineer"),
                    "experience": result.get("experience", "Not specified"),
                    "skills": result.get("skills", []),
                    "education": result.get("education", "Not specified"),
                    "responsibilities": result.get("responsibilities", []),
                    "preferredSkills": result.get("preferredSkills", []),
                    "industry": result.get("industry", "Technology"),
                    "softSkills": result.get("softSkills", []),
                    "seniority": result.get("seniority", "Mid-Level"),
                    "tools": result.get("tools", []),
                    "techStack": result.get("techStack", []),
                    "rawText": raw_text
                }
        except Exception as e:
            logger.error(f"Gemini JD analysis failed, using fallback: {e}")
            
    return fallback_analyze_jd(raw_text)

def fallback_analyze_jd(raw_text: str) -> dict:
    """Heuristic job analysis."""
    text_lower = raw_text.lower()
    
    title = "Software Engineer"
    seniority = "Mid-Level"
    if any(k in text_lower for k in ["sr", "senior", "lead", "principal", "staff"]):
        seniority = "Senior"
        if "lead" in text_lower: seniority = "Lead"
        elif "principal" in text_lower: seniority = "Principal"
        title = "Senior Technical Engineer"
    elif "junior" in text_lower or "jr" in text_lower:
        seniority = "Junior"
        title = "Junior Software Engineer"
        
    if "ai" in text_lower or "llm" in text_lower or "nlp" in text_lower:
        title = f"{seniority} AI Engineer (LLM & GenAI)"
    elif "frontend" in text_lower or "react" in text_lower:
        title = f"{seniority} Frontend Engineer"
    elif "data scientist" in text_lower:
        title = f"{seniority} Data Scientist"
        
    # Heuristic skill extraction
    known_skills = [
        "python", "pytorch", "tensorflow", "fastapi", "react", "typescript", "tailwindcss",
        "next.js", "docker", "aws", "kubernetes", "langchain", "llama", "transformers", "rag", "sql"
    ]
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
            else: skills.append(s.capitalize())
            
    # Guess required experience
    exp = "3+ years"
    match = re.search(r'(\d+)\+?\s*years?', text_lower)
    if match:
        exp = f"{match.group(1)}+ years"
        
    return {
        "title": title,
        "experience": exp,
        "skills": skills if skills else ["Python", "SQL"],
        "education": "Bachelor's in Computer Science or equivalent",
        "responsibilities": [
            "Participate in product architecture planning and detail design.",
            "Write clear, maintainable, and well-tested code.",
            "Maintain service pipelines and deployments."
        ],
        "preferredSkills": ["Docker", "Git"],
        "industry": "Enterprise SaaS",
        "softSkills": ["Communication", "Problem Solving", "Self-motivation"],
        "seniority": seniority,
        "tools": ["Git", "Docker"],
        "techStack": skills,
        "rawText": raw_text
    }
