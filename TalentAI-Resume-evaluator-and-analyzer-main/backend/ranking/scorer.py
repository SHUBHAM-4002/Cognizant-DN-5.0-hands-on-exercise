import re
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

def parse_required_years(exp_str: str) -> float:
    if not exp_str:
        return 0.0
    match = re.search(r'(\d+)', exp_str)
    return float(match.group(1)) if match else 3.0

def compute_skills_score(candidate: dict, job: dict) -> float:
    # Get required and preferred skills
    jd_required = [s.lower().strip() for s in job.get("required_skills", [])]
    jd_preferred = [s.lower().strip() for s in job.get("preferred_skills", [])]
    
    skills = candidate.get("skills", [])
    cand_skills = []
    if isinstance(skills, list):
        for s in skills:
            if isinstance(s, dict):
                cand_skills.append(s.get("name", "").lower().strip())
            elif isinstance(s, str):
                cand_skills.append(s.lower().strip())
                
    if not jd_required:
        return 100.0
        
    # Match required skills
    req_matches = sum(1 for rs in jd_required if any(rs in cs or cs in rs for cs in cand_skills))
    req_score = (req_matches / len(jd_required)) * 100.0
    
    # Match preferred skills
    pref_score = 100.0
    if jd_preferred:
        pref_matches = sum(1 for ps in jd_preferred if any(ps in cs or cs in ps for cs in cand_skills))
        pref_score = (pref_matches / len(jd_preferred)) * 100.0
        
    # Combined score: 80% required skills, 20% preferred skills
    score = (req_score * 0.8) + (pref_score * 0.2)
    return float(max(0, min(100, score)))

def compute_experience_score(candidate: dict, job: dict) -> float:
    profile = candidate.get("profile")
    if not isinstance(profile, dict):
        profile = {}
        
    cand_years = profile.get("years_of_experience")
    if cand_years is None:
        experience = candidate.get("experience", [])
        if isinstance(experience, list):
            cand_years = sum([float(exp.get("yearsOfExp", 0.0)) for exp in experience if isinstance(exp, dict)])
        else:
            cand_years = 0.0
    else:
        cand_years = float(cand_years)
        
    req_years = parse_required_years(job.get("experience", ""))
    
    if req_years == 0:
        base_score = 100.0
    elif cand_years >= req_years:
        base_score = 100.0
    else:
        base_score = (cand_years / req_years) * 100.0
        
    # Check seniority / trajectory
    job_title_lower = job.get("title", "").lower()
    is_senior_job = "sr" in job_title_lower or "senior" in job_title_lower or "lead" in job_title_lower or "principal" in job_title_lower
    
    recent_roles = candidate.get("career_history") or candidate.get("experience") or []
    if not isinstance(recent_roles, list):
        recent_roles = []
        
    has_senior_role = False
    for exp in recent_roles[:2]: # Check recent roles
        if isinstance(exp, dict):
            role_lower = (exp.get("title") or exp.get("role") or "").lower()
            if any(w in role_lower for w in ["sr", "senior", "lead", "principal", "architect", "head", "manager"]):
                has_senior_role = True
                break
            
    trajectory_bonus = 0.0
    if is_senior_job and has_senior_role:
        trajectory_bonus = 10.0
    elif is_senior_job and not has_senior_role:
        trajectory_bonus = -15.0 # Penalty for lack of senior trajectory
        
    score = base_score + trajectory_bonus
    return float(max(0, min(100, score)))

def compute_career_history_score(candidate: dict, job: dict) -> float:
    # Checks stability, title matches, industry relevance
    history = candidate.get("career_history") or candidate.get("experience") or []
    if not isinstance(history, list):
        history = []
        
    if not history:
        return 40.0
        
    jd_industry = job.get("industry", "").lower()
    
    scores = []
    # 1. Stability check: average duration per job
    durations = []
    for j in history:
        if isinstance(j, dict):
            dm = j.get("duration_months")
            if dm is not None:
                durations.append(float(dm))
            else:
                yoe = j.get("yearsOfExp")
                if yoe is not None:
                    durations.append(float(yoe) * 12.0)
                else:
                    durations.append(12.0)
                    
    avg_duration = sum(durations) / len(durations) if durations else 0
    stability_score = min(100.0, (avg_duration / 24.0) * 100.0) # 2 years per job = 100
    scores.append(stability_score)
    
    # 2. Industry matching
    ind_match = 0
    for job_item in history:
        if isinstance(job_item, dict):
            if jd_industry in job_item.get("industry", "").lower():
                ind_match += 1
    industry_score = 100.0 if ind_match > 0 else 50.0
    scores.append(industry_score)
    
    # 3. Product company check (disqualifier / down-weighting IT services)
    consulting_firms = ["tcs", "tata consultancy", "infosys", "wipro", "accenture", "cognizant", "capgemini", "hcl", "tech mahindra", "l&t", "cts"]
    only_consulting = True
    has_experience = False
    for j in history:
        if isinstance(j, dict):
            has_experience = True
            comp = j.get("company", "").lower()
            if not any(cf in comp for cf in consulting_firms):
                only_consulting = False
                break
            
    consulting_penalty = 0.0
    if has_experience and only_consulting:
        consulting_penalty = 50.0 # Heavy penalty for consulting-only background
        
    base_avg = sum(scores) / len(scores)
    return float(max(0, min(100, base_avg - consulting_penalty)))

def compute_education_score(candidate: dict, job: dict) -> float:
    edu_list = candidate.get("education", [])
    if not isinstance(edu_list, list):
        edu_list = []
        
    if not edu_list:
        return 50.0
        
    max_degree_score = 60.0
    has_cs_domain = False
    tier_bonus = 0.0
    
    for edu in edu_list:
        if isinstance(edu, dict):
            deg = edu.get("degree", "").lower()
            field = (edu.get("field_of_study") or edu.get("field") or "").lower()
            tier = edu.get("tier", "unknown")
        else:
            deg = str(edu).lower()
            field = ""
            tier = "unknown"
        
        # Check level
        if "ph" in deg or "doctor" in deg:
            max_degree_score = max(max_degree_score, 100.0)
        elif "master" in deg or "m.s" in deg or "m.tech" in deg or "mba" in deg or "mca" in deg:
            max_degree_score = max(max_degree_score, 90.0)
        elif "bachelor" in deg or "b.s" in deg or "b.tech" in deg or "b.e" in deg or "bca" in deg:
            max_degree_score = max(max_degree_score, 80.0)
            
        # Check domain
        if any(domain in field or domain in deg for domain in ["computer", "science", "software", "information", "data", "it", "engineering", "math"]):
            has_cs_domain = True
            
        # Check tier
        if tier == "tier_1":
            tier_bonus = max(tier_bonus, 10.0)
        elif tier == "tier_2":
            tier_bonus = max(tier_bonus, 5.0)
            
    domain_bonus = 10.0 if has_cs_domain else 0.0
    score = max_degree_score + domain_bonus + tier_bonus
    return float(max(0, min(100, score)))

def compute_certifications_score(candidate: dict, job: dict) -> float:
    certs = candidate.get("certifications", [])
    if not isinstance(certs, list):
        certs = []
        
    if not certs:
        return 50.0
        
    jd_skills = [s.lower().strip() for s in job.get("required_skills", [])]
    
    matched_certs = 0
    for cert in certs:
        cert_lower = cert.get("name", "").lower() if isinstance(cert, dict) else str(cert).lower()
        keywords = ["aws", "azure", "gcp", "google", "cloud", "kubernetes", "tensorflow", "nvidia", "pytorch"]
        if any(kw in cert_lower for kw in keywords) or any(js in cert_lower for js in jd_skills):
            matched_certs += 1
            
    base_score = 70.0
    cert_relevance_bonus = min(30.0, matched_certs * 15.0)
    score = base_score + cert_relevance_bonus
    return float(max(0, min(100, score)))
