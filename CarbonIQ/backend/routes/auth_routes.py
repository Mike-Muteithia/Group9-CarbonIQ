from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from models import db, User
from extensions import bcrypt


auth_bp = Blueprint("auth_bp", __name__)

# Signup route
@auth_bp.route("/auth/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
    
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "User already exists"}), 400
    
    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(email=email, password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()

    token = create_access_token(identity=email, expires_delta=timedelta(hours=12))

    return jsonify({
        "message": "Account created successfully",
        "token": token,
        "user": {"email": email}
    }), 201

# Login route
@auth_bp.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email and password"}), 401
    
    token = create_access_token(identity=email, expires_delta=timedelta(hours=12))

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {"email": email}
    }), 200


# Example protected route
@auth_bp.route("/auth/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify({"message": f"Welcome, {current_user}! This route is protected. "}), 200
