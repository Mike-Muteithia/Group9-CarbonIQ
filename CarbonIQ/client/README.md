# CarbonIQ Frontend

A modern React-based web application for tracking and reducing carbon emissions with AI-powered insights.

## 🚀 Live Deployment

**Production URL**: https://carbon-iq-kappa.vercel.app/

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [Available Pages](#available-pages)
- [Deployment](#deployment)

## ✨ Features

- **User Authentication**: Secure signup and login
- **Interactive Dashboard**: Real-time emissions tracking and analytics
- **Asset Management**: Add and manage carbon-emitting assets
- **Activity Logging**: Track daily activities and their impact
- **Goal Setting**: Set and monitor sustainability goals
- **AI EcoCoach**: Get personalized recommendations and insights
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Modern UI**: Beautiful interface with Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.1.12
- **Routing**: React Router DOM 7.9.4
- **Styling**: Tailwind CSS 4.1.15
- **HTTP Client**: Axios 1.13.1
- **Charts**: Recharts 3.3.0
- **Icons**: Lucide React 0.548.0
- **Linting**: ESLint 9.36.0

## 📦 Prerequisites

- Node.js 18+ and npm
- Backend API running (local or production)

## 🔧 Installation

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## 🔐 Environment Variables

Create a `.env` file in the client directory (optional):

```env
# API Configuration
VITE_API_URL=https://group9-carboniq-backend.onrender.com

# App Configuration
VITE_APP_NAME=CarbonIQ
```

> **Note**: If no `.env` file is provided, the app will use the production API URL by default.

## 🚀 Running Locally

1. **Development mode**
   ```bash
   npm run dev
   ```
   
   The app will be available at: `http://localhost:5173`

2. **Build for production**
   ```bash
   npm run build
   ```

3. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
client/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   └── Navbar.jsx
│   ├── pages/           # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── MyAssets.jsx
│   │   ├── Activities.jsx
│   │   ├── EcoCoach.jsx
│   │   ├── Goals.jsx
│   │   └── LandingPage.jsx
│   ├── services/        # API service modules
│   │   ├── api.js       # Main API functions
│   │   ├── authService.js
│   │   └── aiService.js
│   ├── App.jsx          # Main app component
│   ├── index.css        # Global styles
│   └── main.jsx         # App entry point
├── .eslintrc.js         # ESLint configuration
├── tailwind.config.js   # Tailwind configuration
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies
```

## 📄 Available Pages

### Public Pages
- **Landing Page** (`/`) - Marketing homepage with features
- **Login** (`/login`) - User authentication
- **Signup** (`/signup`) - New user registration

### Protected Pages (Require Authentication)
- **Dashboard** (`/dashboard`) - Overview of emissions and statistics
- **My Assets** (`/assets`) - Manage carbon-emitting assets
- **Activities** (`/activities`) - Log and track daily activities
- **EcoCoach** (`/ecocoach`) - AI-powered sustainability tips
- **Goals** (`/goals`) - Set and monitor reduction goals

## 🎨 Styling

The application uses Tailwind CSS for styling with a custom color scheme:

- **Primary Color**: Green (#22c55e)
- **Background**: Light blue-gray (#faffff)
- **Text**: Dark gray (#1a1a1a)
- **Borders**: Light gray (#d3d5d9)

## 🔌 API Integration

API calls are centralized in service files:

```javascript
// services/api.js
import { getDashboardStats } from './services/api';

const stats = await getDashboardStats(userId);
```

### API Base URL Configuration

The app automatically connects to:
- **Production**: `https://group9-carboniq-backend.onrender.com`
- **Local Development**: Set `VITE_API_URL` in `.env`

## 🔐 Authentication Flow

1. User signs up/logs in
2. JWT token stored in `localStorage`
3. Token included in API requests via `Authorization` header
4. Protected routes check for valid token
5. Auto-redirect to login if unauthenticated

## 🌐 Deployment

### Vercel Deployment

1. **Connect GitHub repository** to Vercel

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables** (optional):
   ```
   VITE_API_URL=https://group9-carboniq-backend.onrender.com
   ```

4. **Deploy**
   - Automatic deployment on push to main/Test branch
   - Preview deployments for pull requests

### Production Checklist

- ✅ API URL configured correctly
- ✅ All environment variables set
- ✅ Build completes without errors
- ✅ CORS enabled on backend for frontend domain
- ✅ HTTPS enabled (Vercel provides this)

## 🧪 Linting

Run ESLint:
```bash
npm run lint
```

## 🐛 Troubleshooting

### Common Issues

**Issue**: API calls fail with CORS errors
- **Solution**: Ensure backend CORS is configured for your frontend domain

**Issue**: "Failed to fetch" errors
- **Solution**: Check if backend is running and accessible

**Issue**: Blank page after login
- **Solution**: Clear browser cache and localStorage

**Issue**: Build fails
- **Solution**: Delete `node_modules` and `package-lock.json`, then run `npm install`

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## ⚡ Performance

- **Lazy Loading**: Components loaded on demand
- **Code Splitting**: Vite handles automatic code splitting
- **Asset Optimization**: Images and assets optimized during build
- **CDN**: Deployed on Vercel's global CDN

## 🔒 Security

- JWT token stored securely in localStorage
- HTTPS enforced in production
- Input validation on all forms
- XSS protection via React
- CSRF protection via token-based auth

## 📊 Key Features by Page

### Dashboard
- Total emissions display
- Monthly trends chart
- Recent activities list
- Top emitters breakdown

### My Assets
- Asset CRUD operations
- Emission calculations
- Asset categorization

### Activities
- Activity logging
- Category filtering
- Statistics overview

### EcoCoach
- AI-generated insights
- Personalized tips
- Trend analysis
- Daily sustainability tips

### Goals
- Goal creation and tracking
- Progress visualization
- Achievement notifications

## 🚀 Future Enhancements

- [ ] Dark mode support
- [ ] Offline functionality with PWA
- [ ] Push notifications
- [ ] Social sharing features
- [ ] Multi-language support

## 📝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is part of an academic assignment.

## 👥 Authors

Group 9 - CarbonIQ Team

## 📞 Support

For issues or questions, please open an issue on the GitHub repository.

---

**Last Updated**: October 2025
