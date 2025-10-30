"""WSGI entry point for production deployment"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app

# Create app instance for WSGI server
app = create_app()

# Create database tables if they don't exist
with app.app_context():
    from models import db
    db.create_all()

if __name__ == "__main__":
    app.run()