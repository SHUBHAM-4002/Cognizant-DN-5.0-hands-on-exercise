import json
import logging
import gzip
from typing import Generator, List, Dict, Any
from backend.dataset.validator import validate_candidate
from backend.dataset.preprocessing import normalize_candidate

logger = logging.getLogger(__name__)

def load_candidates_lazy(file_path: str, limit: int = None) -> Generator[Dict[str, Any], None, None]:
    """
    Lazily loads candidates from a JSONL file, validates and normalizes each candidate.
    Supports both uncompressed .jsonl and gzipped .jsonl.gz files.
    """
    logger.info(f"Loading candidates lazily from {file_path}")
    count = 0
    
    is_gzip = file_path.endswith(".gz")
    open_func = gzip.open if is_gzip else open
    mode = "rt" if is_gzip else "r"
    
    try:
        with open_func(file_path, mode, encoding="utf-8") as f:
            for line in f:
                if not line.strip():
                    continue
                try:
                    cand_dict = json.loads(line)
                    # Validate
                    if not validate_candidate(cand_dict):
                        continue
                    # Normalize
                    normalized = normalize_candidate(cand_dict)
                    yield normalized
                    count += 1
                    if limit and count >= limit:
                        break
                except Exception as ex:
                    logger.debug(f"Failed to parse line: {ex}")
    except Exception as e:
        logger.error(f"Error reading candidate dataset: {e}")
        raise e

def load_candidates(file_path: str, limit: int = None) -> List[Dict[str, Any]]:
    """Loads a list of validated and normalized candidates up to the limit."""
    return list(load_candidates_lazy(file_path, limit))
