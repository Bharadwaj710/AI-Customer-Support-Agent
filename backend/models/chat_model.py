from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    message: str
    name: Optional[str] = None
    email: Optional[str] = None