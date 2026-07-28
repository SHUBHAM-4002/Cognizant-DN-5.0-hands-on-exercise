import json
import logging
import google.generativeai as genai
from backend.config import config

logger = logging.getLogger(__name__)

_initialized = False
_warned = False

def init_llm():
    global _initialized, _warned
    if _initialized:
        return True
    
    api_key = config.GEMINI_API_KEY
    if api_key and api_key != "MY_GEMINI_API_KEY" and api_key.strip():
        try:
            genai.configure(api_key=api_key)
            _initialized = True
            logger.info("Gemini LLM Client initialized successfully in Python.")
            return True
        except Exception as e:
            logger.error(f"Failed to initialize Gemini Client in Python: {e}")
    else:
        if not _warned:
            logger.warning("GEMINI_API_KEY is not configured or uses default in Python. Using Heuristic Fallbacks.")
            _warned = True
    return False

def generate_json_response(prompt: str, system_instruction: str = None) -> dict:
    """Generate content from Gemini model expecting a JSON response."""
    if not init_llm():
        raise RuntimeError("LLM is not initialized (no API key).")
        
    try:
        model = genai.GenerativeModel(
            model_name="gemini-flash-latest",  # Using robust and stable flash model
            generation_config={"response_mime_type": "application/json"}
        )
        
        # We can pass system instruction in the model instantiation or the prompt
        full_prompt = prompt
        if system_instruction:
            full_prompt = f"System Instruction: {system_instruction}\n\nUser Prompt: {prompt}"
            
        response = model.generate_content(full_prompt, request_options={"timeout": 15.0})
        text = response.text.strip()
        return json.loads(text)
    except Exception as e:
        logger.error(f"Gemini generation failed: {e}")
        raise e
 
def generate_text_response(prompt: str, system_instruction: str = None, chat_history: list = None) -> str:
    """Generate content from Gemini model returning raw text (useful for chat)."""
    if not init_llm():
        return "[Heuristic Mode] Gemini API key not configured."
        
    try:
        # For simple generation
        model = genai.GenerativeModel(
            model_name="gemini-flash-latest",
            system_instruction=system_instruction
        )
        
        if chat_history:
            # Reconstruct chat session if history is provided
            chat = model.start_chat(history=chat_history)
            response = chat.send_message(prompt, request_options={"timeout": 15.0})
        else:
            response = model.generate_content(prompt, request_options={"timeout": 15.0})
            
        return response.text
    except Exception as e:
        logger.error(f"Gemini text generation failed: {e}")
        return f"Error communicating with Gemini: {str(e)}"
