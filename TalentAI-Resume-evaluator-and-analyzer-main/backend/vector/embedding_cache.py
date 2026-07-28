import hashlib
from typing import Dict, List, Optional

_cache: Dict[str, List[float]] = {}

def get_cached_embedding(text: str) -> Optional[List[float]]:
    h = hashlib.sha256(text.encode("utf-8")).hexdigest()
    return _cache.get(h)

def set_cached_embedding(text: str, vector: List[float]):
    h = hashlib.sha256(text.encode("utf-8")).hexdigest()
    _cache[h] = vector

def clear_cache():
    _cache.clear()
