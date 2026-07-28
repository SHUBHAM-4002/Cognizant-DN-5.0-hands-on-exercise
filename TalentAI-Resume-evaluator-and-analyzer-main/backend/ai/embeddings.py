import logging
import re
import numpy as np
from sentence_transformers import SentenceTransformer
from backend.config import config

logger = logging.getLogger(__name__)

_model = None

def get_heuristic_embedding(text: str) -> list[float]:
    """Generate a deterministic 384-dimensional bag-of-words vector as a fallback."""
    vector = np.zeros(384, dtype=np.float32)
    if not text:
        return vector.tolist()
    # Extract words
    words = re.findall(r'[a-zA-Z0-9+#]+', text.lower())
    for w in words:
        # Simple hash function to map word to index
        h = 5381
        for char in w:
            h = ((h << 5) + h) + ord(char)
        idx = abs(h) % 384
        vector[idx] += 1.0
        
    norm = np.linalg.norm(vector)
    if norm > 0:
        vector = vector / norm
    return vector.tolist()

def get_model():
    global _model
    if _model is None:
        if config.FORCE_HEURISTIC:
            logger.info("FORCE_HEURISTIC config is set to True. Using local bag-of-words embedding generator.")
            _model = "heuristic"
            return _model
            
        try:
            logger.info(f"Loading SentenceTransformer model: {config.EMBEDDING_MODEL_NAME}...")
            _model = SentenceTransformer(config.EMBEDDING_MODEL_NAME)
            logger.info("Model loaded successfully.")
        except Exception as e:
            logger.warning(f"Failed to load SentenceTransformer: {e}. Using local heuristic embedding generator.")
            _model = "heuristic"
    return _model

def generate_embedding(text: str):
    """Generate a single embedding vector for a given text."""
    if not text or not text.strip():
        text = "empty"
    
    model = get_model()
    if model == "heuristic":
        return get_heuristic_embedding(text)
        
    try:
        return model.encode(text, convert_to_numpy=True).tolist()
    except Exception as e:
        logger.error(f"Embedding encoding failed, using heuristic: {e}")
        return get_heuristic_embedding(text)

def generate_embeddings(texts: list[str]):
    """Generate list of embedding vectors for multiple texts in batch."""
    if not texts:
        return []
        
    model = get_model()
    if model == "heuristic":
        return [get_heuristic_embedding(t) for t in texts]
        
    try:
        cleaned_texts = [t if (t and t.strip()) else "empty" for t in texts]
        vectors = model.encode(cleaned_texts, convert_to_numpy=True)
        return vectors.tolist()
    except Exception as e:
        logger.error(f"Batch embedding encoding failed: {e}")
        return [get_heuristic_embedding(t) for t in texts]

def get_job_text_representation(jd: dict) -> str:
    """Build a rich, structured text string from a job description for semantic matching."""
    parts = [
        f"Role Title: {jd.get('title', '')}",
        f"Experience Required: {jd.get('experience', '')}",
        f"Industry: {jd.get('industry', '')}",
        f"Required Skills: {', '.join(jd.get('skills', []))}",
        f"Preferred Skills: {', '.join(jd.get('preferredSkills', []))}",
        f"Responsibilities: {'; '.join(jd.get('responsibilities', []))}",
        f"Soft Skills: {', '.join(jd.get('softSkills', []))}",
        f"Education: {jd.get('education', '')}"
    ]
    return " | ".join([p for p in parts if p])

def get_candidate_text_representation(candidate: dict) -> str:
    """Build a rich, structured text string from a candidate profile for semantic matching."""
    skills = ", ".join(candidate.get("skills", []))
    summary = candidate.get("summary", "")
    
    experience_parts = []
    for exp in candidate.get("experience", []):
        role = exp.get("role", "")
        company = exp.get("company", "")
        details = exp.get("details", "")
        experience_parts.append(f"{role} at {company}: {details}")
    exp_text = " // ".join(experience_parts)
    
    project_parts = []
    for proj in candidate.get("projects", []):
        title = proj.get("title", "")
        desc = proj.get("description", "")
        tech = ", ".join(proj.get("technologies", []))
        project_parts.append(f"Project {title} ({tech}): {desc}")
    proj_text = " // ".join(project_parts)
    
    education_parts = []
    for edu in candidate.get("education", []):
        degree = edu.get("degree", "")
        school = edu.get("school", "")
        education_parts.append(f"{degree} from {school}")
    edu_text = " // ".join(education_parts)
    
    certs = ", ".join(candidate.get("certifications", []))
    achievements = "; ".join(candidate.get("achievements", []))
    
    parts = [
        f"Candidate Summary: {summary}",
        f"Skills: {skills}",
        f"Work History: {exp_text}",
        f"Projects: {proj_text}",
        f"Education: {edu_text}",
        f"Certifications: {certs}",
        f"Achievements: {achievements}"
    ]
    return " | ".join([p for p in parts if p])

def get_embeddings(texts: list[str]) -> list[list[float]]:
    return generate_embeddings(texts)

def get_embedding_dimension() -> int:
    model = get_model()
    if model == "heuristic":
        return 384
    try:
        return model.get_sentence_embedding_dimension()
    except AttributeError:
        return 384
