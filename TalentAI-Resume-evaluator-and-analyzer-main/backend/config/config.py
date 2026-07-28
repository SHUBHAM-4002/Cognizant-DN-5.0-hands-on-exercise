import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Load workspace .env
load_dotenv(dotenv_path=BASE_DIR / ".env")

# API Config
PORT = int(os.getenv("PYTHON_API_PORT", 5001))
HOST = os.getenv("PYTHON_API_HOST", "127.0.0.1")

# Embeddings Config
EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME", "all-MiniLM-L6-v2")

# Vector DB Config
FAISS_INDEX_PATH = str(BASE_DIR / "faiss_index.bin")
FAISS_METADATA_PATH = str(BASE_DIR / "faiss_metadata.json")

# Force local heuristic matching (disable slow huggingface downloads)
FORCE_HEURISTIC = os.getenv("FORCE_HEURISTIC", "true").lower() == "true"

# Gemini LLM Config
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
