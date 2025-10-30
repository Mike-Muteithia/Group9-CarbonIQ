from dotenv import load_dotenv
load_dotenv()

from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from extensions import bcrypt, jwt
from models import db
from config import config
import os

def create_app(config_name=None):
    """Application factory pattern"""
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'default')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    Migrate(app, db)
    
    # Configure CORS based on environment
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Register blueprints
    from routes.routes import api
    from routes.dashboard_routes import dashboard_bp
    from routes.asset_routes import asset_bp
    from routes.activity_routes import activity_bp
    from routes.ai_routes import ai_bp
    from routes.goal_routes import goal_bp
    from routes.auth_routes import auth_bp
    
    app.register_blueprint(api)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(asset_bp, url_prefix='/api/assets')
    app.register_blueprint(activity_bp)
    app.register_blueprint(ai_bp)
    app.register_blueprint(goal_bp)
    app.register_blueprint(auth_bp)
    
    # Security headers for production
    if not app.config.get('DEBUG'):
        @app.after_request
        def add_security_headers(response):
            headers = app.config.get('SECURITY_HEADERS', {})
            for header, value in headers.items():
                response.headers[header] = value
            return response
    
    # Routes
    @app.route('/')
    def home():
        return jsonify({
            "message": "Welcome to CarbonIQ API",
            "status": "running",
            "environment": config_name,
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
            "message": "CarbonIQ API is up and running",
            "environment": config_name
        })

    # Error handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Not Found", "message": "That route does not exist."}), 404

    @app.errorhandler(500)
    def internal_error(e):
        db.session.rollback()
        return jsonify({"error": "Server Error", "message": "Something went wrong!"}), 500

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"error": "Bad Request", "message": str(e)}), 400

    return app

# Create app instance for deployment
app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("Database (SQLite) tables created successfully!")

    print(f"\nRunning CarbonIQ Backend on http://localhost:5000 (Environment: {os.environ.get('FLASK_ENV', 'development')})\n")
    app.run(debug=app.config.get('DEBUG', False))
