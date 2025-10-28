from flask import Flask, jsonify
from flask_cors import CORS
from extensions import bcrypt, jwt
from models import db
from routes.routes import api  # Existing app routes
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)            # Enable frontend (React/Vite) communication

# Secret key for security
app.config['SECRET_KEY'] = 'my_secret_key'

# Adds JWT secret key
app.config['JWT_SECRET_KEY'] = 'supersecretkey' # Change this before deployment!

# Database configuration (SQLite file stored in the project directory)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(BASE_DIR, "carboniq.db")

app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)

# Register API routes
app.register_blueprint(api)

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
    app.run(debug=True)
