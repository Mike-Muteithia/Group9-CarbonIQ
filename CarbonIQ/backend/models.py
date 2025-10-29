from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Many-to-many relationship: User ↔ Activity
user_activities = db.Table('user_activities',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('activity_id', db.Integer, db.ForeignKey('activities.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)

    # Relationships
    goals = db.relationship("Goal", backref="user", lazy=True)
    activities = db.relationship("Activity", secondary=user_activities, backref="users")

class Goal(db.Model):
    __tablename__ = "goals"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(120), nullable=False)
    target_reduction = db.Column(db.Float, nullable=False)
    deadline = db.Column(db.String(20), nullable=False)

    # Frontend fields
    description = db.Column(db.Text)
    start = db.Column(db.String(20))
    end = db.Column(db.String(20))
    progress_co2 = db.Column(db.String(50))
    percent = db.Column(db.String(10))

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "target_reduction": self.target_reduction,
            "deadline": self.deadline,
            "description": self.description,
            "start": self.start,
            "end": self.end,
            "progressCo2": self.progress_co2,
            "percent": self.percent
        }

class Activity(db.Model):
    __tablename__ = "activities"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    emission_value = db.Column(db.Float, nullable=False)

class Tip(db.Model):
    __tablename__ = "tips"
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(300), nullable=False)
    source = db.Column(db.String(200))
