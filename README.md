# CarbonIQ - Carbon Emission Tracking Platform

A full-stack web application for tracking, analyzing, and reducing personal carbon emissions with AI-powered insights.

**Live Application**: https://carbon-iq-kappa.vercel.app/

## Features

- User authentication with JWT
- Real-time emissions tracking
- Asset and activity management
- Sustainability goal setting
- AI-powered recommendations
- Interactive dashboard with analytics

## Tech Stack

**Frontend**: React 19, Vite, Tailwind CSS, React Router  
**Backend**: Flask 3.0, SQLAlchemy 2.0, PostgreSQL  
**Deployment**: Vercel (Frontend), Render (Backend)  
**AI**: OpenAI API (optional)

## Quick Start

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` file:
```env
DATABASE_URL=postgresql+psycopg://user:pass@localhost:5432/carboniq_db
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-key  # Optional
FLASK_DEBUG=True
```

Run server:
```bash
python app.py
```

### Frontend Setup

```bash
cd client
npm install
```

Create `.env` file (optional):
```env
VITE_API_URL=http://localhost:5000
```

Run development server:
```bash
npm run dev
```

Visit: `http://localhost:5173`

## Database Setup

```sql
CREATE DATABASE carboniq_db;
CREATE USER carboniq_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE carboniq_db TO carboniq_user;
```

## API Endpoints

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete reference.

**Base URL**: `https://group9-carboniq-backend.onrender.com`

Key endpoints:
- `POST /signup` - Register user
- `POST /login` - User login
- `GET /api/dashboard/stats/<user_id>` - Dashboard stats
- `GET /api/assets/<user_id>` - Get assets
- `GET /api/activities/<user_id>` - Get activities
- `GET /api/goals/<user_id>` - Get goals
- `GET /api/ai/insight/<user_id>` - AI insights

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Backend (Render)**:
- Build: `pip install -r requirements.txt`
- Start: `python app.py`
- Add PostgreSQL database
- Set environment variables

**Frontend (Vercel)**:
- Build: `npm run build`
- Output: `dist`
- Framework: Vite
- Auto-deploy from GitHub

## Project Structure

```
CarbonIQ/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── models.py           # Database models
│   ├── routes/             # API endpoints
│   └── requirements.txt    # Python dependencies
├── client/
│   ├── src/
│   │   ├── pages/          # React pages
│   │   ├── components/     # Reusable components
│   │   └── services/       # API services
│   └── package.json        # Node dependencies
└── README.md               # This file
```

## Environment Variables

**Backend**:
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - Flask secret key (required)
- `OPENAI_API_KEY` - OpenAI API key (optional)
- `FLASK_DEBUG` - Debug mode (True/False)
- `PORT` - Server port (default: 5000)

**Frontend**:
- `VITE_API_URL` - Backend API URL

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/name`)
5. Open a Pull Request

## License

Academic project - Group 9

## Authors

Group 9 - CarbonIQ Team

## Support

For issues or questions, open an issue on GitHub.

---

**Last Updated**: October 2025
