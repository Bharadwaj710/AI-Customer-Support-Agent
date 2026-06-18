from fastapi import FastAPI

from services.gemini_service import ask_gemini
from models.chat_model import ChatRequest
from models.chat_response import ChatResponse

app=FastAPI()

@app.get("/")
def home():
    return {
        "message":"AI Support Agent is Running"
    }

@app.post(
        "/chat",
        response_model=ChatResponse
        )

def chat(request:ChatRequest):
    answer=ask_gemini(
        request.message
    )

    return ChatResponse(
        response=answer
    )
