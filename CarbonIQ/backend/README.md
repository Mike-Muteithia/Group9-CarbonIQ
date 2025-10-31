# CarbonIQ Backend API

A Flask-based REST API for tracking carbon emissions, managing assets, and providing AI-powered sustainability insights.

## Live Deployment

**Production API**: https://group9-carboniq-backend.onrender.com/

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)

## Features

- **User Authentication**: JWT-based secure authentication
- **Asset Management**: Track vehicles and other carbon-emitting assets
- **Activity Logging**: Record and monitor daily activities
- **Emissions Tracking**: Real-time carbon footprint calculation
- **Goal Setting**: Set and track sustainability goals
- **AI Integration**: OpenAI-powered insights and recommendations
- **Dashboard Analytics**: Comprehensive emissions statistics and trends

## Tech Stack

- **Framework**: Flask 3.0.3
- **Database**: PostgreSQL (Production) / SQLite (Development)
- **ORM**: SQLAlchemy 2.0.43
- **Authentication**: Flask-JWT-Extended 4.6.0
- **Password Hashing**: Bcrypt 5.0.0
- **CORS**: Flask-CORS 5.0.0
- **Database Migrations**: Alembic 1.14.1
- **AI Integration**: OpenAI API (optional)
- **Python Version**: 3.13.4

## Prerequisites

- Python 3.13+
- PostgreSQL (for production)
- pip package manager
- Virtual environment (recommended)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=postgresql+psycopg://username:password@localhost:5432/carboniq_db

# Security
SECRET_KEY=your-super-secret-key-here

# OpenAI (Optional)
OPENAI_API_KEY=your-openai-api-key

# Flask Configuration
FLASK_DEBUG=True
PORT=5000
```

### Generating a Secure SECRET_KEY

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

## 🚀 Running Locally

1. **Set up the database**
   
   For PostgreSQL:
   ```bash
   psql -U postgres
   CREATE DATABASE carboniq_db;
   CREATE USER carboniq_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE carboniq_db TO carboniq_user;
   ```

2. **Run the application**
   ```bash
   python app.py
   ```

   The API will be available at: `http://localhost:5000`

3. **Verify the server is running**
   ```bash
   curl http://localhost:5000/
   ```

## 📚 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed endpoint documentation.

### Quick Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/signup` | POST | Register new user |
| `/login` | POST | User login |
| `/api/dashboard/stats/<user_id>` | GET | Dashboard statistics |
| `/api/assets/<user_id>` | GET | Get user assets |
| `/api/activities/<user_id>` | GET | Get user activities |
| `/api/goals/<user_id>` | GET | Get user goals |
| `/api/ai/insight/<user_id>` | GET | AI-powered insights |

## 🗄️ Database Schema

### Core Tables

- **users**: User accounts and authentication
- **assets**: Carbon-emitting assets (vehicles, appliances)
- **emissions**: Emission records linked to assets
- **activities**: Daily activity logs
- **goals**: User sustainability goals
- **monthly_summaries**: Aggregated monthly data

### Relationships

- User → Assets (One-to-Many)
- User → Activities (One-to-Many)
- User → Goals (One-to-Many)
- Asset → Emissions (One-to-Many)
- Activity → Emissions (One-to-Many)

## 🌐 Deployment

### Render Deployment

1. **Connect GitHub repository** to Render

2. **Configure Build Settings**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python app.py`

3. **Set Environment Variables** in Render dashboard:
   ```
   DATABASE_URL=<provided-by-render-postgres>
   SECRET_KEY=<your-secret-key>
   OPENAI_API_KEY=<your-openai-key>
   FLASK_DEBUG=False
   PORT=5000
   ```

4. **Create PostgreSQL Database** on Render and link to web service

### Production Considerations

- Set `FLASK_DEBUG=False` in production
- Use strong `SECRET_KEY`
- Enable HTTPS (Render provides this automatically)
- Configure CORS for your frontend domain
- Monitor logs via Render dashboard

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS protection
- Environment variable configuration
- SQL injection protection via SQLAlchemy ORM

## 📊 API Rate Limits

Currently no rate limits are enforced. Consider implementing rate limiting for production using Flask-Limiter.

## 🧪 Testing

Run tests (if available):
```bash
pytest
```

## 📝 Contributing

1. Create a new branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is part of an academic assignment.

## 👥 Authors

Group 9 - CarbonIQ Team

## 🐛 Known Issues

- OpenAI API integration is optional (fallback responses provided)
- Render free tier may sleep after 15 minutes of inactivity

## 📞 Support

For issues or questions, please open an issue on the GitHub repository.

---

**Last Updated**: October 2025
