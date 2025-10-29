from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from models import db
from routes.goal_routes import goal_bp
from routes.eco_coach_routes import eco_coach_bp

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# ✅ Configure database
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://beatrice:mwenje@localhost/carboniq_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# ✅ Initialize SQLAlchemy
db.init_app(app)

# ✅ Register blueprints
app.register_blueprint(goal_bp, url_prefix="/api/goals")
app.register_blueprint(eco_coach_bp, url_prefix="/api/eco-coach")

@app.route("/")
def home():
    return {"message": "CarbonIQ Flask backend is running."}

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
