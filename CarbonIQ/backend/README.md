# CarbonIQ Backend API

A Flask-based REST API for carbon emissions tracking and management, optimized for deployment on Render.

## Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Asset Management**: Track carbon-emitting assets and their usage
- **Activity Tracking**: Log daily activities and calculate carbon footprint
- **AI EcoCoach**: Get personalized insights and reduction tips
- **Goal Setting**: Set and track carbon reduction goals
- **Dashboard Analytics**: Comprehensive emissions data visualization
- **Emission Calculations**: Built-in emission factors for transport, electricity, and food

## Deployment on Render

### Prerequisites
- Render account
- Git repository with this backend code

### Environment Variables
Set these in your Render service environment:
- `FLASK_ENV=production`
- `SECRET_KEY` (auto-generated)
- `JWT_SECRET_KEY` (auto-generated)
- `DATABASE_URL` (auto-generated from Render database)
- `CORS_ORIGINS=https://your-frontend-domain.com`

### Database Setup
The app supports both SQLite (development) and PostgreSQL (production). Render will automatically provision a PostgreSQL database.

### Deployment Files
- `Procfile`: Defines the web process using Gunicorn
- `requirements.txt`: Python dependencies
- `render.yaml`: Render service configuration
- `wsgi.py`: WSGI entry point for production

## Local Development

### Setup
1. Clone the repository
2. Create virtual environment: `python -m venv venv`
3. Activate: `source venv/bin/activate` (Linux/Mac) or `venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Copy `.env.example` to `.env` and configure
6. Run: `python app.py`

### Environment Variables (Development)
```
FLASK_ENV=development
SECRET_KEY=dev-secret-key
JWT_SECRET_KEY=dev-jwt-secret
DATABASE_URL=sqlite:///carboniq.db
CORS_ORIGINS=http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/protected` - Protected route example

### Dashboard
- `GET /api/dashboard/stats/<user_id>` - User statistics
- `GET /api/dashboard/emissions-trend/<user_id>` - Emissions trend data
- `GET /api/dashboard/top-emitters/<user_id>` - Top emission sources
- `GET /api/dashboard/recent-activities/<user_id>` - Recent activities

### Assets
- `GET /api/assets/<user_id>` - List user assets
- `POST /api/assets` - Create new asset
- `GET /api/assets/<asset_id>` - Get single asset
- `PUT /api/assets/<asset_id>` - Update asset
- `DELETE /api/assets/<asset_id>` - Delete asset

### Activities
- `GET /api/activities/<user_id>` - List user activities
- `POST /api/activities` - Create new activity
- `PUT /api/activities/<activity_id>` - Update activity
- `DELETE /api/activities/<activity_id>` - Delete activity
- `GET /api/activities/categories` - Get activity categories

### AI EcoCoach
- `GET /api/ai/insight/<user_id>` - Get personalized insight
- `POST /api/ai/chat` - Chat with AI assistant
- `GET /api/ai/tips` - Get reduction tips
- `GET /api/ai/daily-tip` - Get daily tip
- `GET /api/ai/analyze-trend/<user_id>` - Analyze emissions trend

### Goals
- `GET /api/goals/<user_id>` - List user goals
- `POST /api/goals` - Create new goal
- `GET /api/goals/detail/<goal_id>` - Get goal details
- `PUT /api/goals/<goal_id>` - Update goal
- `DELETE /api/goals/<goal_id>` - Delete goal

## Security Features

- JWT authentication with configurable expiration
- Password hashing with bcrypt
- CORS configuration for cross-origin requests
- Security headers for production
- SQL injection prevention through SQLAlchemy ORM
- Input validation and sanitization

## Database Models

- **User**: User accounts and authentication
- **Asset**: Carbon-emitting assets (vehicles, appliances, etc.)
- **Activity**: Daily activities and their emissions
- **Emission**: Emission records with calculations
- **Goal**: Carbon reduction goals
- **MonthlySummary**: Aggregated monthly data

## Testing

Run tests with:
```bash
pytest tests/
```

## Contributing

1. Follow PEP 8 coding standards
2. Add appropriate error handling and logging
3. Include docstrings for new functions
4. Test all new features
5. Update documentation as needed

## License

This project is part of the CarbonIQ MVP for carbon emissions tracking and management.
