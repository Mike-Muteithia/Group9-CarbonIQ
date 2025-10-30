from dotenv import load_dotenv
load_dotenv()

from flask import Flask, jsonify
from flask_cors import CORS

from extensions import bcrypt, jwt
from models import db
from routes.routes import api  # Existing app routes
from routes.dashboard_routes import dashboard_bp
from routes.asset_routes import asset_bp
from routes.activity_routes import activity_bp
from routes.ai_routes import ai_bp
from routes.goal_routes import goal_bp
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)            # Enable frontend (React/Vite) communication

# Secret key for security
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'e4b74003ea8a79e8762bc5a01ae88b37e52b19685acf6207ff177d0777f44181')

# Adds JWT secret key
app.config['JWT_SECRET_KEY'] = os.getenv('SECRET_KEY', 'e4b74003ea8a79e8762bc5a01ae88b37e52b19685acf6207ff177d0777f44181') # Change this before deployment!

# Database configuration (SQLite file stored in the project directory)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(BASE_DIR, "carboniq.db")

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'psycopg+postgresql://carboniq_user:your_password@your-render-host:5432/carboniq_db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)

# Register API routes
app.register_blueprint(api)
app.register_blueprint(dashboard_bp)
app.register_blueprint(asset_bp, url_prefix='/api/assets')
app.register_blueprint(activity_bp)  # Activities routes
app.register_blueprint(ai_bp)  # AI EcoCoach routes
app.register_blueprint(goal_bp)  # Goals routes

# Registers new auth routes
from routes.auth_routes import auth_bp
app.register_blueprint(auth_bp)


@app.route('/')
def home():
    return jsonify({
        "message": "Welcome to CarbonIQ API ",
        "status": "running",
        "available_endpoints": {
            "Auth": {
                "Signup": "/auth/signup",
                "Login": "/auth/login",
                "Protected Example": "/auth/protected"
            },
            "Dashboard": {
                "Stats": "/api/dashboard/stats/<user_id>",
                "Emissions Trend": "/api/dashboard/emissions-trend/<user_id>",
                "Top Emitters": "/api/dashboard/top-emitters/<user_id>",
                "Recent Activities": "/api/dashboard/recent-activities/<user_id>"
            },
            "Assets": {
                "All Assets": "/api/assets/<user_id>",
                "Single Asset": "/api/assets/<asset_id>",
                "Create Asset": "POST /api/assets",
                "Update Asset": "PUT /api/assets/<asset_id>",
                "Delete Asset": "DELETE /api/assets/<asset_id>"
            },
            "Activities": {
                "All Activities": "/api/activities/<user_id>",
                "Activity Stats": "/api/activities/stats/<user_id>",
                "Categories": "/api/activities/categories",
                "Create Activity": "POST /api/activities",
                "Update Activity": "PUT /api/activities/<activity_id>",
                "Delete Activity": "DELETE /api/activities/<activity_id>"
            },
            "AI EcoCoach": {
                "Personalized Insight": "/api/ai/insight/<user_id>",
                "Chat": "POST /api/ai/chat",
                "Reduction Tips": "/api/ai/tips?category=<category>&user_id=<user_id>",
                "Daily Tip": "/api/ai/daily-tip",
                "Analyze Trend": "/api/ai/analyze-trend/<user_id>"
            },
            "Goals": {
                "All Goals": "/api/goals/<user_id>",
                "Goal Detail": "/api/goals/detail/<goal_id>",
                "Goal Stats": "/api/goals/stats/<user_id>",
                "Create Goal": "POST /api/goals",
                "Update Goal": "PUT /api/goals/<goal_id>",
                "Delete Goal": "DELETE /api/goals/<goal_id>"
            },
            "Utilities": {
                "Health Check": "/health"
            }
        }
    })

@app.route('/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "message": "CarbonIQ API is up and running "
    })


@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not Found", "message": "That route does not exist."}), 404


@app.errorhandler(500)
def internal_error(e):
    db.session.rollback()
    return jsonify({"error": "Server Error", "message": "Something went wrong!"}), 500



if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Creates all tables (users, assets, etc.)
        print(" Database (SQLite) tables created successfully!")

    print("\n Running CarbonIQ Backend on http://localhost:5000\n")
    app.run(host='0.0.0.0', debug=True)
