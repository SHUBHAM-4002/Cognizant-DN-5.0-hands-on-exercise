import numpy as np
import logging
from backend.ai import embeddings, candidate_analyzer
from backend.vector import embedding_cache

logger = logging.getLogger(__name__)

def get_vector(text: str) -> list:
    """Helper to get embedding from cache or generate it."""
    vec = embedding_cache.get_cached_embedding(text)
    if vec is None:
        vec = embeddings.generate_embedding(text)
        embedding_cache.set_cached_embedding(text, vec)
    return vec

def compute_semantic_score(candidate: dict, job: dict) -> float:
    """Calculate semantic similarity score (0-100) using SentenceTransformer."""
    try:
        jd_repr = embeddings.get_job_text_representation(job)
        cand_repr = candidate_analyzer.generate_candidate_summary_text(candidate)
        
        jd_vec = np.array(get_vector(jd_repr))
        cand_vec = np.array(get_vector(cand_repr))
        
        dot_product = np.dot(jd_vec, cand_vec)
        norm_jd = np.linalg.norm(jd_vec)
        norm_cand = np.linalg.norm(cand_vec)
        
        if norm_jd == 0 or norm_cand == 0:
            return 50.0
            
        cosine_sim = dot_product / (norm_jd * norm_cand)
        score = (cosine_sim + 1.0) / 2.0 * 100.0
        return float(max(0, min(100, score)))
    except Exception as e:
        logger.error(f"Error computing semantic score: {e}")
        return 50.0
