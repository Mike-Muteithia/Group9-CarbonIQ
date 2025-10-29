from flask import Blueprint, request, jsonify

activity_bp = Blueprint("activity", __name__)

@activity_bp.route("/example", methods=["GET"])
def example_activity():
    return jsonify({"message": "Activity route is working"})
