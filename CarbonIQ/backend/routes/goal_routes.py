from fastapi import APIRouter, HTTPException
from models import Goal
from typing import List

router = APIRouter()
goals_db: List[Goal] = []

@router.get("/goals", response_model=List[Goal])
def get_goals():
    return goals_db

@router.post("/goals", response_model=Goal)
def create_goal(goal: Goal):
    goal.id = len(goals_db) + 1
    goals_db.append(goal)
    return goal

@router.put("/goals/{goal_id}", response_model=Goal)
def update_goal(goal_id: int, updated_goal: Goal):
    for i, goal in enumerate(goals_db):
        if goal.id == goal_id:
            updated_goal.id = goal_id
            goals_db[i] = updated_goal
            return updated_goal
    raise HTTPException(status_code=404, detail="Goal not found")
