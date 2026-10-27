from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel

class ChatRequest(BaseModel):
    project_id: str
    message: str

class ChatResponse(BaseModel):
    id: str
    role: str
    content: str
    simulation_triggered: bool = False
    simulation_data: Optional[Dict[str, Any]] = None
    timestamp: datetime
