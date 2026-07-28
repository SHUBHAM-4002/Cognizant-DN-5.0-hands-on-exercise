import logging
from typing import Dict, Any
from backend.dataset.schema import CandidateProfile

logger = logging.getLogger(__name__)

def validate_candidate(cand_dict: Dict[str, Any]) -> bool:
    """
    Validates a candidate dictionary against the CandidateProfile Pydantic schema.
    Returns True if valid, False otherwise.
    """
    try:
        # Validate using Pydantic
        CandidateProfile(**cand_dict)
        return True
    except Exception as e:
        logger.warning(f"Validation failed for candidate {cand_dict.get('candidate_id', 'unknown')}: {e}")
        return False
