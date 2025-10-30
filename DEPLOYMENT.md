# CarbonIQ Deployment Guide

## 🌐 Live Application
- **Frontend:** https://group9-carboniq.onrender.com
- **Backend API:** https://group9-carboniq.onrender.com

## 📋 Deployment Checklist

### ✅ Frontend (Vercel)
- [x] `vercel.json` configured with SPA routing
- [x] `vite.config.js` properly configured
- [x] API base URL set to Render backend
- [x] Build output directory: `dist`
- [x] Environment variables configured

### ✅ Backend (Render)
- [x] `render.yaml` service configuration
- [x] `wsgi.py` entry point for production
- [x] `requirements.txt` with production dependencies
- [x] CORS configured for frontend domain
- [x] Environment variables set
- [x] Database configuration ready

### 🔧 Configuration Files

#### Frontend Configuration
```json
// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### Backend Configuration
```yaml
# backend/render.yaml
services:
  - type: web
    name: carboniq-api
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "gunicorn wsgi:app"
    envVars:
      - key: FLASK_ENV
        value: production
      - key: CORS_ORIGINS
        value: https://group9-carboniq.onrender.com
```

## 🚀 Deployment Commands

### Frontend Development
```bash
npm install
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

### Backend Development
```bash
cd backend
pip install -r requirements.txt
python app.py    # Development server
```

## 🔗 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login

### Dashboard
- `GET /api/dashboard/stats/<user_id>` - User statistics
- `GET /api/dashboard/emissions-trend/<user_id>` - Emissions trend
- `GET /api/dashboard/top-emitters/<user_id>` - Top emission sources

### Assets
- `GET /api/assets/<user_id>` - List user assets
- `POST /api/assets` - Create new asset
- `PUT /api/assets/<asset_id>` - Update asset
- `DELETE /api/assets/<asset_id>` - Delete asset

### Activities
- `GET /api/activities/<user_id>` - List user activities
- `POST /api/activities` - Create new activity
- `PUT /api/activities/<activity_id>` - Update activity
- `DELETE /api/activities/<activity_id>` - Delete activity

### AI EcoCoach
- `GET /api/ai/insight/<user_id>` - Personalized insight
- `POST /api/ai/chat` - Chat with AI assistant
- `GET /api/ai/tips` - Get reduction tips

### Goals
- `GET /api/goals/<user_id>` - List user goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/<goal_id>` - Update goal
- `DELETE /api/goals/<goal_id>` - Delete goal

## 🛠️ Environment Variables

### Backend (Render)
```
FLASK_ENV=production
SECRET_KEY=auto-generated
JWT_SECRET_KEY=auto-generated
DATABASE_URL=render-provided
CORS_ORIGINS=https://group9-carboniq.onrender.com
```

### Frontend (Vercel)
```
VITE_API_BASE_URL=https://group9-carboniq.onrender.com
```

## 🔍 Testing Deployment

### Health Checks
```bash
# Backend health
curl https://group9-carboniq.onrender.com/health

# Frontend accessibility
curl https://group9-carboniq.onrender.com
```

### API Testing
```bash
# Test dashboard endpoint
curl https://group9-carboniq.onrender.com/api/dashboard/stats/1

# Test authentication
curl -X POST https://group9-carboniq.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## 🐛 Troubleshooting

### Common Issues

1. **404 Errors on Frontend Routes**
   - Ensure `vercel.json` has correct rewrite rules
   - Check that `index.html` is in root directory

2. **CORS Errors**
   - Verify `CORS_ORIGINS` environment variable
   - Check backend configuration

3. **Backend Won't Start**
   - Check `wsgi.py` entry point
   - Verify `requirements.txt` dependencies
   - Review Render service logs

4. **Database Connection Issues**
   - Ensure `DATABASE_URL` is properly set
   - Check database service status on Render

## 📊 Monitoring

### Render Dashboard
- Monitor service logs
- Check database connections
- Track response times

### Vercel Dashboard
- Monitor build status
- Check deployment logs
- Track performance metrics

## 🔄 Continuous Deployment

Both platforms are configured for automatic deployment:
- **Vercel:** Auto-deploys on push to main branch
- **Render:** Auto-deploys on push to main branch

Ensure your Git repository is connected to both platforms for seamless updates.
