from flask import Blueprint, request, jsonify
from models import db, Goal

goal_bp = Blueprint("goal_bp", __name__)
@goal_bp.route("/", methods=["OPTIONS"])
def options_goals():
    return '', 204

# Create a new goal
@goal_bp.route("/", methods=["POST", "OPTIONS"])
def create_goal():
    data = request.get_json()
    required_fields = ["user_id", "title", "target_reduction", "deadline"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    try:
        new_goal = Goal(
            user_id=int(data["user_id"]),
            title=str(data["title"]),
            target_reduction=float(data["target_reduction"]),
            deadline=str(data["deadline"]),
            description=data.get("description", ""),
            start=data.get("start", ""),
            end=data.get("end", ""),
            progress_co2=data.get("progressCo2", ""),
            percent=data.get("percent", "0")
        )
        db.session.add(new_goal)
        db.session.commit()
        return jsonify(new_goal.to_dict()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get all goals
@goal_bp.route("/", methods=["GET"])
def get_goals():
    goals = Goal.query.all()
    return jsonify([goal.to_dict() for goal in goals])

# Update a goal
@goal_bp.route("/<int:goal_id>", methods=["PUT"])
def update_goal(goal_id):
    goal = Goal.query.get(goal_id)
    if not goal:
        return jsonify({"error": "Goal not found"}), 404

    data = request.get_json()
    goal.title = data.get("title", goal.title)
    goal.target_reduction = data.get("target_reduction", goal.target_reduction)
    goal.deadline = data.get("deadline", goal.deadline)
    goal.description = data.get("description", goal.description)
    goal.start = data.get("start", goal.start)
    goal.end = data.get("end", goal.end)
    goal.progress_co2 = data.get("progressCo2", goal.progress_co2)
    goal.percent = data.get("percent", goal.percent)

    db.session.commit()
    return jsonify(goal.to_dict())

# Delete a goal
@goal_bp.route("/<int:goal_id>", methods=["DELETE"])
def delete_goal(goal_id):
    goal = Goal.query.get(goal_id)
    if not goal:
        return jsonify({"error": "Goal not found"}), 404

    db.session.delete(goal)
    db.session.commit()
    return jsonify({"message": "Goal deleted successfully"})
