from pydantic import BaseModel
from typing import Any

class ChatResponse(BaseModel):
    result: Any