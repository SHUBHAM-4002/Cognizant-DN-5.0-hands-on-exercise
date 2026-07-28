import os
import json
import logging
import faiss
import numpy as np
from backend.config import config
from backend.ai import embeddings, candidate_analyzer
from backend.vector import embedding_cache

logger = logging.getLogger(__name__)

# Global FAISS database state
_index = None
_metadata = {}  # maps candidate_id -> candidate details (including raw_text, parsed details, etc.)
_id_map = []    # list of candidate_ids where index in list corresponds to FAISS index ID

def get_vector(text: str) -> list:
    """Helper to get embedding from cache or generate it."""
    vec = embedding_cache.get_cached_embedding(text)
    if vec is None:
        vec = embeddings.generate_embedding(text)
        embedding_cache.set_cached_embedding(text, vec)
    return vec

def initialize_db():
    global _index, _metadata, _id_map
    
    # Try to load existing index and metadata
    if os.path.exists(config.FAISS_INDEX_PATH) and os.path.exists(config.FAISS_METADATA_PATH):
        try:
            logger.info("Loading existing FAISS index and metadata...")
            _index = faiss.read_index(config.FAISS_INDEX_PATH)
            with open(config.FAISS_METADATA_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                _metadata = data.get("metadata", {})
                _id_map = data.get("id_map", [])
            logger.info(f"Loaded FAISS index with {len(_id_map)} candidates.")
            return
        except Exception as e:
            logger.error(f"Failed to load FAISS database: {e}. Reinitializing a new one.")

    # Initialize a new Index
    logger.info("Initializing new FAISS database...")
    # Get dimension from model
    model = embeddings.get_model()
    if model == "heuristic":
        dimension = 384
    else:
        try:
            dimension = model.get_sentence_embedding_dimension()
        except AttributeError:
            dimension = 384
    
    _index = faiss.IndexFlatIP(dimension)
    _metadata = {}
    _id_map = []
    save_db()

def save_db():
    global _index, _metadata, _id_map
    if _index is None:
        return
    try:
        faiss.write_index(_index, config.FAISS_INDEX_PATH)
        with open(config.FAISS_METADATA_PATH, "w", encoding="utf-8") as f:
            json.dump({
                "metadata": _metadata,
                "id_map": _id_map
            }, f, indent=2, ensure_ascii=False)
        logger.info("FAISS database successfully saved to disk.")
    except Exception as e:
        logger.error(f"Error saving FAISS database: {e}")

def add_candidate(candidate: dict):
    """
    Generate embedding, add candidate to FAISS index and metadata, and save.
    """
    global _index, _metadata, _id_map
    if _index is None:
        initialize_db()
        
    candidate_id = candidate.get("candidate_id") or candidate.get("id")
    if not candidate_id:
        raise ValueError("Candidate must have a 'candidate_id' or 'id'")
        
    # Get rich representation using new candidate_analyzer summary
    repr_text = candidate_analyzer.generate_candidate_summary_text(candidate)
    
    # Generate embedding
    vector = get_vector(repr_text)
    vector_np = np.array([vector], dtype=np.float32)
    
    # L2 normalize vector for cosine similarity
    faiss.normalize_L2(vector_np)
    
    # If candidate already exists, update metadata and rebuild index to avoid duplication
    if candidate_id in _metadata:
        logger.info(f"Candidate {candidate_id} already exists. Updating and rebuilding index.")
        _metadata[candidate_id] = candidate
        rebuild_index()
        return
        
    # Add to index
    _index.add(vector_np)
    _id_map.append(candidate_id)
    _metadata[candidate_id] = candidate
    
    save_db()
    logger.info(f"Added candidate {candidate_id} to FAISS database.")

def delete_candidate(candidate_id: str):
    """
    Delete candidate from metadata and rebuild the FAISS index.
    """
    global _metadata
    if candidate_id in _metadata:
        del _metadata[candidate_id]
        rebuild_index()
        logger.info(f"Deleted candidate {candidate_id} and rebuilt index.")

def rebuild_index():
    """
    Rebuilds the FAISS index from current metadata.
    """
    global _index, _metadata, _id_map
    logger.info("Rebuilding FAISS index from metadata...")
    model = embeddings.get_model()
    if model == "heuristic":
        dimension = 384
    else:
        try:
            dimension = model.get_sentence_embedding_dimension()
        except AttributeError:
            dimension = 384
    
    _index = faiss.IndexFlatIP(dimension)
    _id_map = list(_metadata.keys())
    
    if not _id_map:
        save_db()
        return
        
    vectors = []
    for cid in _id_map:
        cand = _metadata[cid]
        repr_text = candidate_analyzer.generate_candidate_summary_text(cand)
        vector = get_vector(repr_text)
        vectors.append(vector)
        
    vectors_np = np.array(vectors, dtype=np.float32)
    faiss.normalize_L2(vectors_np)
    _index.add(vectors_np)
    save_db()

def get_all_candidates() -> list[dict]:
    """Retrieve all candidates from metadata."""
    global _metadata
    if not _metadata:
        initialize_db()
    return list(_metadata.values())

def search_candidates(query_text: str, top_k: int = 5) -> list[dict]:
    """
    Search database for top_k closest candidates using semantic query.
    Returns list of dictionaries containing 'candidate' details and 'semantic_score' (0-100 scale).
    """
    global _index, _id_map, _metadata
    if _index is None:
        initialize_db()
        
    if _index.ntotal == 0:
        return []
        
    # Generate query embedding
    query_vector = get_vector(query_text)
    query_vector_np = np.array([query_vector], dtype=np.float32)
    faiss.normalize_L2(query_vector_np)
    
    # Search
    actual_k = min(top_k, _index.ntotal)
    distances, indices = _index.search(query_vector_np, actual_k)
    
    results = []
    for score_val, idx in zip(distances[0], indices[0]):
        if idx < 0 or idx >= len(_id_map):
            continue
        candidate_id = _id_map[idx]
        candidate = _metadata.get(candidate_id)
        if candidate:
            normalized_score = max(0, min(100, int((score_val + 1.0) / 2.0 * 100)))
            results.append({
                "candidate": candidate,
                "semantic_score": normalized_score
            })
            
    return results
