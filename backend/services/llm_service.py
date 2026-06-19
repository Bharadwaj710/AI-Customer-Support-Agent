import os
import requests
from tenacity import retry, stop_after_attempt, wait_exponential
import json
from config import LLM_PROVIDER, LLM_MODEL, OPENROUTER_API_KEY, OPENAI_API_KEY

@retry(reraise=True, stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def _call_openrouter(prompt: str, model: str) -> str:
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8000",
        "X-Title": "AI Support Agent"
    }
    data = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}]
    }
    
    response = requests.post(url, headers=headers, json=data, timeout=30)
    if not response.ok:
        raise Exception(f"OpenRouter API Error {response.status_code}: {response.text}")
    result = response.json()
    
    if "choices" in result and len(result["choices"]) > 0:
        return result["choices"][0]["message"]["content"]
    raise Exception(f"Unexpected OpenRouter response: {result}")

@retry(reraise=True, stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def _call_openai(prompt: str, model: str) -> str:
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}]
    }
    
    response = requests.post(url, headers=headers, json=data, timeout=30)
    response.raise_for_status()
    result = response.json()
    
    if "choices" in result and len(result["choices"]) > 0:
        return result["choices"][0]["message"]["content"]
    raise Exception(f"Unexpected OpenAI response: {result}")

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def _call_ollama(prompt: str, model: str) -> str:
    url = "http://localhost:11434/api/generate"
    data = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    
    response = requests.post(url, json=data, timeout=30)
    response.raise_for_status()
    result = response.json()
    
    if "response" in result:
        return result["response"]
    raise Exception(f"Unexpected Ollama response: {result}")

def generate_response(prompt: str) -> str:
    if LLM_PROVIDER == "openrouter":
        return _call_openrouter(prompt, LLM_MODEL)
    elif LLM_PROVIDER == "openai":
        return _call_openai(prompt, LLM_MODEL)
    elif LLM_PROVIDER == "ollama":
        return _call_ollama(prompt, LLM_MODEL)
    else:
        raise ValueError(f"Unsupported LLM_PROVIDER: {LLM_PROVIDER}")
