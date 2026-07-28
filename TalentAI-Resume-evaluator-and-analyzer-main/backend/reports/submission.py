import os
import sys
import csv
import logging
from typing import List, Dict, Any
from backend.dataset.loader import load_candidates_lazy
from backend.ai.job_analyzer import analyze_job_docx
from backend.ranking.engine import score_candidate

logger = logging.getLogger(__name__)

# Add path to import validate_submission
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../datasets")))
try:
    from validate_submission import validate_submission
except ImportError:
    validate_submission = None

def generate_submission_csv(
    candidates_file: str = "datasets/candidates.jsonl",
    job_file: str = "datasets/job_description.docx",
    output_csv: str = "submission.csv"
) -> bool:
    """
    Generates submission.csv by scoring and ranking all candidates from candidates_file.
    Maintains a list of top 100 candidates during streaming.
    """
    logger.info("Starting submission generation...")
    
    # 1. Analyze Job Description
    job_details = analyze_job_docx(job_file)
    logger.info(f"Loaded job description: {job_details.get('title')}")
    
    # 2. Stream and score candidates, keeping top 100
    top_candidates = []
    
    count = 0
    for cand in load_candidates_lazy(candidates_file):
        count += 1
        if count % 10000 == 0:
            logger.info(f"Processed {count} candidates...")
            
        # Score candidate without generating expensive explanations
        res = score_candidate(cand, job_details, generate_explanation=False)
        score = res["score"]
        score_normalized = round(score / 100.0, 4)
        cand_id = cand.get("candidate_id") or cand.get("id")
        
        # Format reasoning matching sample_submission.csv format
        profile = cand.get("profile", {})
        title = profile.get("current_title", "Software Engineer")
        years_exp = profile.get("years_of_experience", 0.0)
        skills_matched = len([s for s in cand.get("skills", []) if any(js in s.get("name", "").lower() for js in job_details.get("required_skills", []))])
        rr = cand.get("redrob_signals", {}).get("recruiter_response_rate", 0.0)
        
        reasoning = f"{title} with {years_exp:.1f} yrs; {skills_matched} AI core skills; response rate {rr:.2f}."
        
        candidate_entry = {
            "candidate_id": cand_id,
            "score": score_normalized,
            "reasoning": reasoning
        }
        
        # Insert in sorted order to keep top 100 (descending score, ascending candidate_id)
        if len(top_candidates) < 100:
            top_candidates.append(candidate_entry)
            top_candidates.sort(key=lambda x: (-x["score"], x["candidate_id"]))
        elif score_normalized > top_candidates[-1]["score"] or (score_normalized == top_candidates[-1]["score"] and cand_id < top_candidates[-1]["candidate_id"]):
            top_candidates[-1] = candidate_entry
            top_candidates.sort(key=lambda x: (-x["score"], x["candidate_id"]))
            
    # 3. Write CSV
    logger.info(f"Writing top 100 candidates to {output_csv}...")
    
    # Ensure parent dir exists
    parent_dir = os.path.dirname(os.path.abspath(output_csv))
    if parent_dir:
        os.makedirs(parent_dir, exist_ok=True)
        
    with open(output_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["candidate_id", "rank", "score", "reasoning"])
        for rank_idx, item in enumerate(top_candidates, 1):
            writer.writerow([
                item["candidate_id"],
                rank_idx,
                f"{item['score']:.4f}",
                item["reasoning"]
            ])
            
    logger.info("Finished writing submission file.")
    
    # 4. Validate submission
    if validate_submission:
        logger.info("Validating submission file...")
        errors = validate_submission(output_csv)
        if errors:
            logger.error("Submission validation failed:")
            for err in errors:
                logger.error(f"- {err}")
            return False
        else:
            logger.info("Submission validation succeeded! Valid submission.csv produced.")
            return True
    else:
        logger.warning("validate_submission.py not found or could not be imported.")
        return True
