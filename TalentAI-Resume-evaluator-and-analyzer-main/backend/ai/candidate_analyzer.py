import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

def generate_candidate_summary_text(cand: Dict[str, Any]) -> str:
    """
    Generates a structured, unified text summary of the candidate.
    This summary is designed to be fed into the embedding generator.
    """
    profile = cand.get("profile")
    if not isinstance(profile, dict):
        profile = {}
        
    name = profile.get("anonymized_name") or cand.get("name") or "Candidate"
    headline = profile.get("headline") or cand.get("summary") or ""
    summary = profile.get("summary") or cand.get("summary") or ""
    
    # Calculate years of experience
    years_exp = profile.get("years_of_experience")
    if years_exp is None:
        experience = cand.get("experience", [])
        if isinstance(experience, list):
            years_exp = sum([float(exp.get("yearsOfExp", 0.0)) for exp in experience if isinstance(exp, dict)])
        else:
            years_exp = 0.0
    else:
        years_exp = float(years_exp)
        
    current_title = profile.get("current_title") or ""
    current_company = profile.get("current_company") or ""
    current_industry = profile.get("current_industry") or ""
    
    # Career history text
    history_items = []
    career_history = cand.get("career_history")
    if isinstance(career_history, list):
        for job in career_history:
            if isinstance(job, dict):
                company = job.get("company", "")
                title = job.get("title", "")
                duration = job.get("duration_months", 0)
                desc = job.get("description", "")
                history_items.append(f"Worked at {company} as {title} for {duration} months: {desc}")
                
    experience_list = cand.get("experience")
    if isinstance(experience_list, list):
        for job in experience_list:
            if isinstance(job, dict):
                company = job.get("company", "")
                role = job.get("role", "") or job.get("title", "")
                duration = job.get("duration", "")
                details = job.get("details", "")
                history_items.append(f"Worked at {company} as {role} for {duration}: {details}")
                
    history_text = "; ".join(history_items)
    
    # Skills text
    skills_list = []
    skills = cand.get("skills", [])
    if isinstance(skills, list):
        for sk in skills:
            if isinstance(sk, dict):
                skills_list.append(f"{sk.get('name', '')} ({sk.get('proficiency', '')})")
            elif isinstance(sk, str):
                skills_list.append(sk)
    skills_text = ", ".join(skills_list)
    
    # Education text
    edu_list = []
    education = cand.get("education", [])
    if isinstance(education, list):
        for edu in education:
            if isinstance(edu, dict):
                degree = edu.get("degree", "")
                field = edu.get("field_of_study", "") or edu.get("field", "")
                institution = edu.get("institution", "") or edu.get("school", "")
                year = edu.get("year", "")
                year_str = f" in {year}" if year else ""
                field_str = f" in {field}" if field else ""
                edu_list.append(f"{degree}{field_str} from {institution}{year_str}")
            elif isinstance(edu, str):
                edu_list.append(edu)
    edu_text = "; ".join(edu_list)
    
    # Certifications
    certs_list = []
    certifications = cand.get("certifications", [])
    if isinstance(certifications, list):
        for c in certifications:
            if isinstance(c, dict):
                name_val = c.get("name", "")
                if name_val:
                    certs_list.append(name_val)
            elif isinstance(c, str):
                certs_list.append(c)
    certs_text = ", ".join(certs_list) if certs_list else "None"
    
    # Signals summary
    signals = cand.get("redrob_signals")
    if not isinstance(signals, dict):
        signals = {}
    open_to_work = "Open to work" if signals.get("open_to_work_flag") else "Not marked open to work"
    github = f"GitHub activity score: {signals.get('github_activity_score', -1)}"
    
    # Build complete consolidated summary
    consolidated = (
        f"Candidate ID: {cand.get('candidate_id') or cand.get('id', '')}. Name: {name}. Headline: {headline}. "
        f"Profile Summary: {summary}. Total Experience: {years_exp} years. Current Title: {current_title} at {current_company} in {current_industry} industry. "
        f"Career History: {history_text}. Skills: {skills_text}. Education: {edu_text}. "
        f"Certifications: {certs_text}. Work status: {open_to_work}. {github}."
    )
    return consolidated
