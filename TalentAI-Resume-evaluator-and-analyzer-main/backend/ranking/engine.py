import logging
import json
from typing import Dict, Any, List
from backend.ranking import weights, semantic, scorer, confidence, redrob_score
from backend.ai import explainer

logger = logging.getLogger(__name__)

def score_candidate(candidate: Dict[str, Any], job: Dict[str, Any], generate_explanation: bool = True) -> Dict[str, Any]:
    """
    Computes candidate overall score using the official challenge formula.
    """
    # 1. Compute individual component scores (0-100 range)
    sem_score = semantic.compute_semantic_score(candidate, job)
    skill_score = scorer.compute_skills_score(candidate, job)
    exp_score = scorer.compute_experience_score(candidate, job)
    career_score = scorer.compute_career_history_score(candidate, job)
    edu_score = scorer.compute_education_score(candidate, job)
    cert_score = scorer.compute_certifications_score(candidate, job)
    signals_score = redrob_score.compute_redrob_signals_score(candidate)
    
    # 2. Apply weights
    overall_score = float(
        sem_score * weights.SEMANTIC_WEIGHT +
        skill_score * weights.SKILL_WEIGHT +
        exp_score * weights.EXPERIENCE_WEIGHT +
        career_score * weights.CAREER_WEIGHT +
        edu_score * weights.EDUCATION_WEIGHT +
        cert_score * weights.CERTIFICATION_WEIGHT +
        signals_score * weights.REDROB_SIGNALS_WEIGHT
    )
    
    overall_score = max(0.0, min(100.0, round(overall_score, 4)))
    
    # 3. Compute confidence score
    conf_score = confidence.compute_confidence_score(candidate, overall_score)
    
    breakdown = {
        "semantic": round(sem_score, 2),
        "skills": round(skill_score, 2),
        "experience": round(exp_score, 2),
        "career": round(career_score, 2),
        "education": round(edu_score, 2),
        "certifications": round(cert_score, 2),
        "signals": round(signals_score, 2)
    }
    
    # 4. Generate Explainable AI recommendation report conditionally
    if generate_explanation:
        explanation = explainer.generate_explanation(candidate, job, overall_score, breakdown)
    else:
        explanation = {
            "overallMatch": f"Candidate matches {overall_score:.1f}% of requirements.",
            "strengths": [],
            "weaknesses": [],
            "missingSkills": [],
            "skillGap": [],
            "reasoning": f"Overall match is {overall_score:.1f}% based on semantic overlap.",
            "hiringRecommendation": "Hold",
            "confidence": "Medium"
        }
        
    # Return formatted result compatible with frontend
    return {
        "candidateId": candidate.get("candidate_id") or candidate.get("id"),
        "score": overall_score,
        "confidence": int(conf_score),
        "breakdown": breakdown,
        "explanation": explanation
    }

def rank_candidates(candidates: List[Dict[str, Any]], job: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Ranks a list of candidates for a job description.
    """
    scored = []
    for cand in candidates:
        try:
            res = score_candidate(cand, job)
            scored.append((cand, res))
        except Exception as e:
            logger.error(f"Error scoring candidate {cand.get('candidate_id', 'unknown')}: {e}")
            
    # Sort by score descending. If tied, sort by candidate_id ascending.
    # To implement tie-breaker:
    scored.sort(key=lambda x: (-x[1]["score"], x[0].get("candidate_id", "")))
    
    ranked_list = []
    for rank_idx, (cand, res) in enumerate(scored, 1):
        res["rank"] = rank_idx
        # Attach full candidate details for frontend mapping
        res["candidate"] = cand
        ranked_list.append(res)
        
    return ranked_list
