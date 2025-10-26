from pydantic import BaseModel
from typing import Optional
from datetime import date

class Goal(BaseModel):
    id: Optional[int] = None
    title: str
    description: Optional[str] = None
    target_percentage: float
    current_progress: float = 0.0
    deadline: date
