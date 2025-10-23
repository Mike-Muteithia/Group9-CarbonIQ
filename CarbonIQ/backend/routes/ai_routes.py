from fastapi import APIRouter, Request
from .ai_helper import generate_nudge

router = APIRouter()

@router.post("/nudges")
async def get_nudge(request: Request):
    data = await request.json()
    user_input = data.get("input", "")
    nudge = generate_nudge(user_input)
    return {"nudge": nudge}
