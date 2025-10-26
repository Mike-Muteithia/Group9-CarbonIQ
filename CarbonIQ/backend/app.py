from fastapi import FastAPI
from routes import goal_routes

app = FastAPI()
app.include_router(goal_routes.router)
