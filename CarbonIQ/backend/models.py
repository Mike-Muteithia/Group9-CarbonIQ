

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()



class User(db.Model):
    __tablename__ = 'users'
    
     
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    activities = db.relationship('Activity', backref='user', lazy=True, cascade='all, delete-orphan')
    goals = db.relationship('Goal', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<User {self.email}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Activity(db.Model):
    __tablename__ = 'activities'
    
    # Columns
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)  
    type = db.Column(db.String(50), nullable=False)  
    emission_amount = db.Column(db.Numeric(10, 2), nullable=False) 
    location = db.Column(db.String(255))
    date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Activity {self.title}>'
    
    
    def to_dict(self):
        icon_map = {
            'vehicle': '🚗',
            'machine': '🏗️',
            'flight': '✈️',
            'appliance': '🔌'
        }
        
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'type': self.type,
            'badge': self.type,
            'icon': icon_map.get(self.type, '📊'),
            'amount': str(self.emission_amount),
            'unit': 'kg CO₂',
            'location': self.location,
            'date': self.date.strftime('%b %d, %Y') if self.date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }



class Goal(db.Model):
    __tablename__ = 'goals'
    
    # Columns
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    target_reduction_percentage = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Goal {self.target_reduction_percentage}%>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'target_reduction_percentage': self.target_reduction_percentage,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }