from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    assets = db.relationship("Asset", backref="user", lazy=True, cascade="all, delete-orphan")
    emissions = db.relationship("Emission", backref="user", lazy=True, cascade="all, delete-orphan")
    activities = db.relationship("Activity", backref="user", lazy=True, cascade="all, delete-orphan")
    goals = db.relationship("Goal", backref="user", lazy=True, cascade="all, delete-orphan")
    monthly_summaries = db.relationship("MonthlySummary", backref="user", lazy=True, cascade="all, delete-orphan")

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


# Update your Emission model to include these fields:

class Emission(db.Model):
    __tablename__ = "emissions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    asset_id = db.Column(db.Integer, db.ForeignKey("assets.id"), nullable=True)
    
    emission_type = db.Column(db.String(50))  # transport, electricity, food, other
    activity = db.Column(db.String(255))      # Description of activity
    source = db.Column(db.String(100), nullable=False)
    
    original_value = db.Column(db.Float, nullable=False)  # Original input value
    unit = db.Column(db.String(20), default="kg CO₂")
    amount = db.Column(db.Float, nullable=False)  # Calculated CO2 amount
    
    calculation_method = db.Column(db.String(50))  # How it was calculated
    emission_factor = db.Column(db.Float)          # Factor used in calculation
    
    date = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'source': self.source,
            'emission_type': self.emission_type,
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




class MonthlySummary(db.Model):
    __tablename__ = "monthly_summaries"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    month = db.Column(db.Integer, nullable=False)
    
    total_emissions = db.Column(db.Float, default=0.0)
    previous_month_emissions = db.Column(db.Float, default=0.0)
    percent_change = db.Column(db.Float, default=0.0)
    
    # Category breakdown
    electricity_emissions = db.Column(db.Float, default=0.0)
    transport_emissions = db.Column(db.Float, default=0.0)
    food_emissions = db.Column(db.Float, default=0.0)
    other_emissions = db.Column(db.Float, default=0.0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Unique constraint
    __table_args__ = (
        db.UniqueConstraint('user_id', 'year', 'month', name='unique_user_month'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'year': self.year,
            'month': self.month,
            'total_emissions': float(self.total_emissions),
            'previous_month_emissions': float(self.previous_month_emissions),
            'percent_change': float(self.percent_change),
            'electricity': float(self.electricity_emissions),
            'transport': float(self.transport_emissions),
            'food': float(self.food_emissions),
            'other': float(self.other_emissions)
        }
    
    def __repr__(self):
        return f"<MonthlySummary {self.year}-{self.month} User:{self.user_id}>"