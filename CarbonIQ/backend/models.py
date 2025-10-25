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
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    assets = db.relationship("Asset", backref="user", lazy=True, cascade="all, delete-orphan")
    emissions = db.relationship("Emission", backref="user", lazy=True, cascade="all, delete-orphan")
    activities = db.relationship("Activity", backref="user", lazy=True, cascade="all, delete-orphan")
    goals = db.relationship("Goal", backref="user", lazy=True, cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<User {self.email}>"




class Asset(db.Model):
    __tablename__ = "assets"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(120), nullable=False)          # e.g. "Excavator X300"
    type = db.Column(db.String(50), nullable=False)           # e.g. "vehicle", "machine"
    fuel_type = db.Column(db.String(50))                      # e.g. "diesel", "electric"
    model = db.Column(db.String(100))                         # e.g. "CAT 320"
    year = db.Column(db.String(4))                            # e.g. "2019"
    emoji = db.Column(db.String(10))                          # e.g. "🏗️"
    carbon_impact = db.Column(db.Float, default=0.0)          # Total CO2
    status = db.Column(db.String(50), default="active")       # active / retired
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    emissions = db.relationship("Emission", backref="asset", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'fuel_type': self.fuel_type,
            'model': self.model,
            'year': self.year,
            'emoji': self.emoji,
            'carbon_impact': float(self.carbon_impact) if self.carbon_impact else 0.0,
            'status': self.status
        }

    def __repr__(self):
        return f"<Asset {self.name} ({self.type})>"


class Emission(db.Model):
    __tablename__ = "emissions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    asset_id = db.Column(db.Integer, db.ForeignKey("assets.id"), nullable=True)
    source = db.Column(db.String(100), nullable=False)        # e.g. "My Tesla Model 3"
    amount = db.Column(db.Float, nullable=False)              # CO2 amount
    unit = db.Column(db.String(20), default="kg CO₂")
    date = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'source': self.source,
            'amount': float(self.amount),
            'unit': self.unit,
            'date': self.date.strftime('%b %d, %Y') if self.date else None
        }

    def __repr__(self):
        return f"<Emission {self.amount} {self.unit} from {self.source}>"



class Activity(db.Model):
    __tablename__ = "activities"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(120), nullable=False)         # e.g. "My Tesla Model 3"
    location = db.Column(db.String(100))                      # e.g. "3 times to Downtown"
    date = db.Column(db.DateTime, default=datetime.utcnow)
    amount = db.Column(db.Float, nullable=False)              # Emission amount
    unit = db.Column(db.String(20), default="kg CO₂")
    badge = db.Column(db.String(50))                          # e.g. "vehicle"
    icon = db.Column(db.String(10))                           # emoji e.g. "🚗"

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'location': self.location,
            'date': self.date.strftime('%b %d, %Y') if self.date else None,
            'amount': str(self.amount),
            'unit': self.unit,
            'badge': self.badge,
            'icon': self.icon,
            'iconBg': 'bg-blue-500'
        }

    def __repr__(self):
        return f"<Activity {self.title} - {self.amount}{self.unit}>"


class Goal(db.Model):
    __tablename__ = "goals"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(120), nullable=False)         # e.g. "Reduce by 15%"
    target_reduction_percentage = db.Column(db.Integer, nullable=False)
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime)
    status = db.Column(db.String(50), default="active")       # active / completed / cancelled

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'target_reduction_percentage': self.target_reduction_percentage,
            'status': self.status
        }

    def __repr__(self):
        return f"<Goal {self.title} ({self.status})>"
