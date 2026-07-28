from typing import Dict, Any

def compute_redrob_signals_score(candidate: Dict[str, Any]) -> float:
    """
    Computes a composite score (0-100) representing behavioral, availability, and engagement signals.
    """
    signals = candidate.get("redrob_signals")
    if not isinstance(signals, dict):
        return 50.0
        
    scores = []
    
    # 1. Recruiter Response Rate (0.0 to 1.0)
    rr = signals.get("recruiter_response_rate", 0.0)
    scores.append(rr * 100.0)
    
    # 2. Interview Completion Rate (0.0 to 1.0)
    icr = signals.get("interview_completion_rate", 0.0)
    scores.append(icr * 100.0)
    
    # 3. Offer Acceptance Rate (0.0 to 1.0, -1 if no history)
    oar = signals.get("offer_acceptance_rate", -1)
    if oar == -1:
        scores.append(70.0)  # neutral default
    else:
        scores.append(oar * 100.0)
        
    # 4. Profile Completeness (0-100)
    scores.append(signals.get("profile_completeness_score", 50.0))
    
    # 5. GitHub Activity Score (-1 to 100)
    gh = signals.get("github_activity_score", -1)
    if gh == -1:
        scores.append(50.0)  # neutral default
    else:
        scores.append(gh)
        
    # 6. Assessment Scores (dict of skill -> score)
    sas = signals.get("skill_assessment_scores", {})
    if sas:
        avg_sas = sum(sas.values()) / len(sas)
        scores.append(avg_sas)
    else:
        scores.append(60.0)  # default baseline
        
    # 7. Saved by recruiters 30d
    saves = signals.get("saved_by_recruiters_30d", 0)
    scores.append(min(100.0, saves * 10.0))
    
    # 8. Search Appearance 30d
    app = signals.get("search_appearance_30d", 0)
    scores.append(min(100.0, (app / 50.0) * 100.0))
    
    # 9. Notice Period Days (shorter is better)
    npd = signals.get("notice_period_days", 90)
    if npd <= 15:
        scores.append(100.0)
    elif npd <= 30:
        scores.append(90.0)
    elif npd <= 60:
        scores.append(70.0)
    elif npd <= 90:
        scores.append(50.0)
    else:
        scores.append(30.0)
        
    # 10. Open to work flag (bool)
    otw = signals.get("open_to_work_flag", False)
    scores.append(100.0 if otw else 60.0)
    
    # Return average of these signals
    return sum(scores) / len(scores)
