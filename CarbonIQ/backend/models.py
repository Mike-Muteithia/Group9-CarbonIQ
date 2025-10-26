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
    monthly_summaries = db.relationship("MonthlySummary", backref="user", lazy=True, cascade="all, delete-orphan")

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
    
    # Enhanced emission source details
    emission_type = db.Column(db.String(50), nullable=False, default="other")  # 'electricity', 'transport', 'food', 'other'
    activity = db.Column(db.String(100))                      # e.g. 'car_trip', 'electricity_usage'
    source = db.Column(db.String(100), nullable=False)        # e.g. "My Tesla Model 3"
    
    # Calculation details
    original_value = db.Column(db.Float)                      # Original value (km, kWh, kg, etc.)
    unit = db.Column(db.String(20), default="kg")             # 'km', 'kWh', 'kg'
    amount = db.Column(db.Float, nullable=False)              # CO2 amount in kg
    calculation_method = db.Column(db.String(50))             # 'standard', 'custom', 'asset_based'
    emission_factor = db.Column(db.Float)                     # CO2 per unit (kg CO2 per km/kWh/etc.)
    
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)  # Changed to Date for better grouping
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'emission_type': self.emission_type,
            'activity': self.activity,
            'source': self.source,
            'original_value': float(self.original_value) if self.original_value else None,
            'unit': self.unit,
            'amount': float(self.amount),
            'calculation_method': self.calculation_method,
            'emission_factor': float(self.emission_factor) if self.emission_factor else None,
            'date': self.date.isoformat() if self.date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<Emission {self.amount} kg CO₂ from {self.source}>"


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
    """Store pre-calculated monthly data for faster dashboard queries"""
    __tablename__ = "monthly_summaries"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    month = db.Column(db.Integer, nullable=False)  # 1-12
    
    # Calculated totals
    total_emissions = db.Column(db.Float, default=0.0)
    electricity_emissions = db.Column(db.Float, default=0.0)
    transport_emissions = db.Column(db.Float, default=0.0)
    food_emissions = db.Column(db.Float, default=0.0)
    other_emissions = db.Column(db.Float, default=0.0)
    
    # Comparison data
    previous_month_emissions = db.Column(db.Float, default=0.0)
    percent_change = db.Column(db.Float, default=0.0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Unique constraint - one summary per user per month
    __table_args__ = (db.UniqueConstraint('user_id', 'year', 'month', name='unique_user_monthly_summary'),)

    def to_dict(self):
        return {
            'id': self.id,
            'year': self.year,
            'month': self.month,
            'total_emissions': float(self.total_emissions),
            'electricity_emissions': float(self.electricity_emissions),
            'transport_emissions': float(self.transport_emissions),
            'food_emissions': float(self.food_emissions),
            'other_emissions': float(self.other_emissions),
            'previous_month_emissions': float(self.previous_month_emissions),
            'percent_change': float(self.percent_change),
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f"<MonthlySummary {self.year}-{self.month}: {self.total_emissions} kg CO₂>"