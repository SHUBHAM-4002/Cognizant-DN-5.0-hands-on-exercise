import re
from typing import Dict, Any, List

def clean_company_name(name: str) -> str:
    if not name:
        return ""
    name = name.strip()
    # Remove common corporate suffixes
    suffixes = [r"\binc\.?\b", r"\bllc\b", r"\bltd\.?\b", r"\bpvt\.?\s*ltd\.?\b", r"\bcorp\.?\b", r"\bcorporation\b", r"\bco\.?\b", r"\bsolutions\b"]
    for suff in suffixes:
        name = re.sub(suff, "", name, flags=re.IGNORECASE)
    # Clean multiple spaces
    name = re.sub(r"\s+", " ", name).strip()
    return name

def clean_title(title: str) -> str:
    if not title:
        return ""
    title = title.strip().lower()
    
    # Normalize common technical variations
    if any(x in title for x in ["ml engineer", "machine learning engineer", "machine learning"]):
        return "Machine Learning Engineer"
    if any(x in title for x in ["ai engineer", "artificial intelligence engineer"]):
        return "AI Engineer"
    if any(x in title for x in ["data scientist", "data science"]):
        return "Data Scientist"
    if "software" in title:
        if "senior" in title or "sr" in title:
            return "Senior Software Engineer"
        return "Software Engineer"
    if "product manager" in title:
        return "Product Manager"
    if "project manager" in title:
        return "Project Manager"
    
    # Capitalize words
    return " ".join(w.capitalize() for w in title.split())

def clean_degree(degree: str) -> str:
    if not degree:
        return "Other"
    d = degree.strip().lower()
    if any(x in d for x in ["ph.d", "phd", "doctor"]):
        return "Ph.D. / Doctorate"
    if any(x in d for x in ["master", "m.s", "m.tech", "mba", "m.c.a", "mca"]):
        return "Master's"
    if any(x in d for x in ["bachelor", "b.s", "b.tech", "btech", "b.e", "be", "bca"]):
        return "Bachelor's"
    return "Other"

def clean_skill(skill: str) -> str:
    if not skill:
        return ""
    s = skill.strip().lower()
    # Standardize skill synonyms
    synonyms = {
        "python3": "python",
        "py torch": "pytorch",
        "tensor flow": "tensorflow",
        "scikit learn": "scikit-learn",
        "sci-kit learn": "scikit-learn",
        "large language models": "llm",
        "large language model": "llm",
        "rag systems": "rag",
        "retrieval augmented generation": "rag",
        "fast api": "fastapi",
        "nextjs": "next.js",
        "reactjs": "react",
        "typescriptjs": "typescript",
        "javascriptjs": "javascript",
        "node": "node.js",
        "nodejs": "node.js",
    }
    return synonyms.get(s, s)

def normalize_candidate(cand: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normalizes candidate fields in place and returns a cleaned candidate dictionary.
    """
    normalized = cand.copy()
    
    # 1. Normalize profile titles and companies
    if "profile" in normalized:
        profile = normalized["profile"].copy()
        profile["current_title"] = clean_title(profile.get("current_title", ""))
        profile["current_company"] = clean_company_name(profile.get("current_company", ""))
        normalized["profile"] = profile
        
    # 2. Normalize career history
    if "career_history" in normalized:
        new_history = []
        for job in normalized["career_history"]:
            job_copy = job.copy()
            job_copy["title"] = clean_title(job_copy.get("title", ""))
            job_copy["company"] = clean_company_name(job_copy.get("company", ""))
            new_history.append(job_copy)
        normalized["career_history"] = new_history
        
    # 3. Normalize education degrees
    if "education" in normalized:
        new_edu = []
        for edu in normalized["education"]:
            edu_copy = edu.copy()
            edu_copy["degree"] = clean_degree(edu_copy.get("degree", ""))
            new_edu.append(edu_copy)
        normalized["education"] = new_edu
        
    # 4. Normalize skills names
    if "skills" in normalized:
        new_skills = []
        for sk in normalized["skills"]:
            sk_copy = sk.copy()
            sk_copy["name"] = clean_skill(sk_copy.get("name", ""))
            new_skills.append(sk_copy)
        normalized["skills"] = new_skills
        
    return normalized
