from flask import Blueprint, request, jsonify

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    return jsonify({"message": "Login route is working"})
