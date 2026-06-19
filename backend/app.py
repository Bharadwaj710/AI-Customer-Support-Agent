from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from models.chat_model import ChatRequest
from models.chat_response import ChatResponse
from services.support_agent import handle_query
from services.ticket_service import get_all_tickets, create_ticket
from services.vector_store import collection
from services.document_loader import load_documents

from fastapi.middleware.cors import CORSMiddleware

app=FastAPI(
    title="AI Support Agent API",
    description="Production-ready API for the AI Support Agent",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
@app.get("/")
def home():
    try:
        vector_count = collection.count()
        doc_count = len(load_documents())
        return {
            "status": "healthy",
            "message": "AI Support Agent is Running",
            "document_count": doc_count,
            "vector_count": vector_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/tickets")
def get_tickets():
    try:
        tickets = get_all_tickets()
        return {"tickets": tickets}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class TicketCreateRequest(BaseModel):
    name: str
    email: str
    issue: str

@app.post("/tickets")
def submit_ticket(request: TicketCreateRequest):
    try:
        result = create_ticket(request.name, request.email, request.issue)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty.")

        result = handle_query(
            query=request.message,
            name=request.name,
            email=request.email
        )

        return ChatResponse(result=result)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port)
