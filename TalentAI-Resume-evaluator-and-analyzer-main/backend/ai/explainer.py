import logging
from typing import Dict, Any
from backend.ai import llm

logger = logging.getLogger(__name__)

def generate_explanation(candidate: Dict[str, Any], job: Dict[str, Any], score: float, breakdown: Dict[str, float]) -> Dict[str, Any]:
    """
    Generates structured explanation for the candidate matching recommendation.
    Uses Gemini if available, falling back to a structured rule-based generator.
    """
    profile = candidate.get("profile")
    if not isinstance(profile, dict):
        profile = {}
        
    cand_id = candidate.get("candidate_id") or candidate.get("id") or ""
    cand_name = profile.get("anonymized_name") or candidate.get("name") or "Candidate"
    
    cand_skills = []
    skills = candidate.get("skills", [])
    if isinstance(skills, list):
        for s in skills:
            if isinstance(s, dict):
                cand_skills.append(s.get("name", ""))
            elif isinstance(s, str):
                cand_skills.append(s)
                
    years_exp = profile.get("years_of_experience")
    if years_exp is None:
        experience = candidate.get("experience", [])
        if isinstance(experience, list):
            years_exp = sum([float(exp.get("yearsOfExp", 0.0)) for exp in experience if isinstance(exp, dict)])
        else:
            years_exp = 0.0
    else:
        years_exp = float(years_exp)
        
    current_title = profile.get("current_title")
    if not current_title:
        recent_roles = candidate.get("career_history") or candidate.get("experience") or []
        if isinstance(recent_roles, list) and recent_roles and isinstance(recent_roles[0], dict):
            current_title = recent_roles[0].get("title") or recent_roles[0].get("role") or ""
        else:
            current_title = "Software Engineer"
            
    current_company = profile.get("current_company") or ""
    if not current_company:
        recent_roles = candidate.get("career_history") or candidate.get("experience") or []
        if isinstance(recent_roles, list) and recent_roles and isinstance(recent_roles[0], dict):
            current_company = recent_roles[0].get("company", "")
    
    if llm.init_llm():
        try:
            prompt = f"""
            Analyze the suitability of candidate {cand_name} (ID: {cand_id}) for the role of {job.get('title', 'Senior AI Engineer')}.
            Overall match score is {score:.1f}/100.
            Score Breakdown: {breakdown}
            
            Candidate profile details:
            - Headline: {profile.get('headline') or candidate.get('summary') or ''}
            - Summary: {profile.get('summary') or candidate.get('summary') or ''}
            - Skills: {cand_skills}
            - Years of Exp: {years_exp}
            - Current title: {current_title} at {current_company}
            """
            system_instruction = """
            Explain candidate fit as an expert recruiter.
            Return a JSON object with keys:
            - overallMatch (string): 1 sentence explaining the match
            - strengths (list of strings): 3 key strengths
            - weaknesses (list of strings): 1-2 limitations
            - missingSkills (list of strings): skills in JD missing in candidate
            - skillGap (list of strings): specific concepts/tools they need to catch up on
            - reasoning (string): brief explanation of why they got this score
            - hiringRecommendation (string): final decision summary (e.g. Hire, Strong Hire, Reject, Hold)
            - confidence (string): High, Medium, or Low
            """
            result = llm.generate_json_response(prompt, system_instruction)
            if result:
                return result
        except Exception as e:
            logger.error(f"Gemini explanation generation failed: {e}")

    # Heuristic fallback explanation
    skills_cand = set(s.lower() for s in cand_skills if s)
    skills_req = set(s.lower() for s in job.get("required_skills", []))
    missing = list(skills_req - skills_cand)
    
    strengths = [
        f"Has {years_exp:.1f} years of professional experience.",
        f"Currently holds role as {current_title}.",
    ]
    if len(skills_cand) > 0:
        strengths.append(f"Possesses technical skills in {', '.join(list(skills_cand)[:3])}.")

    weaknesses = []
    if missing:
        weaknesses.append(f"Lacks explicit mentions of: {', '.join(missing[:2])}.")
    if years_exp < 5:
        weaknesses.append("Experience is slightly below the target 5-9 years range.")

    rec = "Hold"
    if score >= 80:
        rec = "Strong Hire"
    elif score >= 65:
        rec = "Hire"
    elif score < 50:
        rec = "Reject"

    return {
        "overallMatch": f"Candidate matches {score:.1f}% of requirements.",
        "strengths": strengths,
        "weaknesses": weaknesses if weaknesses else ["None noted"],
        "missingSkills": missing,
        "skillGap": [m.capitalize() for m in missing] if missing else ["None"],
        "reasoning": f"Overall match is {score:.1f}% based on semantic overlap ({breakdown.get('semantic', 0):.0f}%), skills match ({breakdown.get('skills', 0):.0f}%), and behavioral signals.",
        "hiringRecommendation": rec,
        "confidence": "High" if score >= 75 or score <= 45 else "Medium"
    }
