import logging
from typing import List, Dict, Any
from backend.vector import faiss_db

logger = logging.getLogger(__name__)

def search_candidates_semantic(query: str, limit: int = 5) -> List[Dict[str, Any]]:
    """
    Retrieves the top N candidates semantically matching the query.
    """
    logger.info(f"Performing semantic search for query: '{query}'")
    return faiss_db.search_candidates(query, limit)
