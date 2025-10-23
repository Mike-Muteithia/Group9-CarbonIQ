from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default="user")  # user or admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    assets = db.relationship("Asset", backref="user", lazy=True)
    emissions = db.relationship("Emission", backref="user", lazy=True)
    activities = db.relationship("Activity", backref="user", lazy=True)
    goals = db.relationship("Goal", backref="user", lazy=True)
    emitters = db.relationship("Emitter", backref="user", lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.email}>"



class Asset(db.Model):
    __tablename__ = "assets"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(120), nullable=False)          # e.g. "Toyota Hilux"
    category = db.Column(db.String(50), nullable=False)       # e.g. "vehicle", "machine"
    description = db.Column(db.String(255))
    location = db.Column(db.String(100))
    status = db.Column(db.String(50), default="active")       # active / retired
    purchase_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship
    emissions = db.relationship("Emission", backref="asset", lazy=True)

    def __repr__(self):
        return f"<Asset {self.name} ({self.category})>"


class Emission(db.Model):
    __tablename__ = "emissions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    asset_id = db.Column(db.Integer, db.ForeignKey("assets.id"), nullable=True)
    category = db.Column(db.String(50), nullable=False)
    value = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(20), default="kg CO₂")
    date = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Emission {self.value} {self.unit} (Asset {self.asset_id})>"



class Activity(db.Model):
    __tablename__ = "activities"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(120), nullable=False)     # e.g. "Work Truck"
    location = db.Column(db.String(100))
    date = db.Column(db.DateTime, default=datetime.utcnow)
    amount = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(20), default="kg CO₂")
    badge = db.Column(db.String(50))                      # e.g. "vehicle"
    icon = db.Column(db.String(50))                       

    def __repr__(self):
        return f"<Activity {self.title} - {self.amount}{self.unit}>"


class Goal(db.Model):
    __tablename__ = "goals"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(120), nullable=False)          # e.g. "Reduce emissions by 10%"
    target_reduction = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(20), default="%")
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime)
    status = db.Column(db.String(50), default="active")        # active / completed / failed

    def __repr__(self):
        return f"<Goal {self.title} ({self.status})>"



class Emitter(db.Model):
    __tablename__ = "emitters"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(120), nullable=False)           # e.g. "Refrigerator X200"
    total_emission = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50))
    color = db.Column(db.String(50))                           # for chart color coding

    def __repr__(self):
        return f"<Emitter {self.name} - {self.total_emission} kg CO₂>"
