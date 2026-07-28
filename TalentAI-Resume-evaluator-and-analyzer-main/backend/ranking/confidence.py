from typing import Dict, Any

def compute_confidence_score(candidate: Dict[str, Any], overall_score: float) -> float:
    """
    Computes a confidence score (0-100) indicating the reliability of the calculated score
    based on profile completeness and validation factors.
    """
    profile = candidate.get("profile")
    if not isinstance(profile, dict):
        profile = {}
        
    penalties = 0.0
    
    # 1. Check for missing elements
    if not candidate.get("projects"):
        penalties += 10.0
    if not candidate.get("education"):
        penalties += 5.0
    if not candidate.get("skills"):
        penalties += 10.0
    if not (candidate.get("career_history") or candidate.get("experience")):
        penalties += 10.0
        
    # 2. Check contact info / social connections
    signals = candidate.get("redrob_signals")
    if not isinstance(signals, dict):
        signals = {}
    if not signals.get("linkedin_connected"):
        penalties += 5.0
    if signals.get("github_activity_score", -1) == -1:
        penalties += 5.0
        
    # 3. Base confidence on overall_score minus penalties
    conf = overall_score - penalties
    return max(30.0, min(100.0, conf))
