# File Structure Migration Guide

## 🎯 Target Structure
```
Group9-CarbonIQ/
├── ACTIVITIES_PAGE_SUMMARY.md
├── AI_ECOCOACH_SUMMARY.md
├── BACKEND_FIXES_SUMMARY.md
├── GOALS_PAGE_SUMMARY.md
├── README.md
├── VERIFICATION_CHECKLIST.md
├── DEPLOYMENT.md
├── MIGRATION_GUIDE.md
├── backend/
├── client/
├── eslint.config.js
├── index.html
├── .gitignore
├── node_modules/
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── vercel.json
```

## 📋 Migration Steps

### ✅ Already Completed
- [x] Root configuration files created
- [x] `package.json` - Frontend dependencies
- [x] `vite.config.js` - Vite configuration
- [x] `index.html` - Entry point
- [x] `vercel.json` - Vercel deployment config
- [x] `eslint.config.js` - ESLint configuration
- [x] `postcss.config.js` - PostCSS configuration
- [x] `tailwind.config.js` - Tailwind CSS configuration
- [x] `.gitignore` - Git ignore rules
- [x] `README.md` - Updated project documentation
- [x] `DEPLOYMENT.md` - Deployment guide

### 🔄 Manual Steps Required

#### 1. Move Documentation Files
From `CarbonIQ/` to root:
```bash
mv CarbonIQ/ACTIVITIES_PAGE_SUMMARY.md ./
mv CarbonIQ/AI_ECOCOACH_SUMMARY.md ./
mv CarbonIQ/BACKEND_FIXES_SUMMARY.md ./
mv CarbonIQ/GOALS_PAGE_SUMMARY.md ./
mv CarbonIQ/VERIFICATION_CHECKLIST.md ./
```

#### 2. Move Backend Directory
```bash
mv CarbonIQ/backend ./
```

#### 3. Move Client Directory
```bash
mv CarbonIQ/client ./
```

#### 4. Move Node Modules and Package Lock
```bash
mv CarbonIQ/node_modules ./
mv CarbonIQ/package-lock.json ./
```

#### 5. Clean Up
```bash
rm -rf CarbonIQ/
```

## 🚀 Post-Migration Verification

### 1. Frontend Setup
```bash
npm install
npm run dev
```
- Should start development server on `http://localhost:5173`
- Frontend should load from `client/` directory

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```
- Should start Flask server on `http://localhost:5000`
- API endpoints should be accessible

### 3. Build Test
```bash
npm run build
```
- Should create `dist/` directory
- Build should complete without errors

## 🔧 Configuration Verification

### Frontend Configuration
- [x] `vite.config.js` points to `client/` directory
- [x] `index.html` references `client/main.jsx`
- [x] `vercel.json` configured for SPA routing

### Backend Configuration
- [x] `backend/render.yaml` configured for Render
- [x] `backend/wsgi.py` entry point ready
- [x] `backend/requirements.txt` production-ready
- [x] CORS configured for `https://group9-carboniq.onrender.com`

### API Configuration
- [x] `client/services/api.js` uses Render URL
- [x] `client/services/authService.js` uses Render URL
- [x] All localhost references updated

## 🌐 Deployment Ready

After migration, the project will be ready for deployment:

### Vercel (Frontend)
- Root directory contains `vercel.json`
- Build command: `npm run build`
- Output directory: `dist`
- All API calls point to Render backend

### Render (Backend)
- `backend/render.yaml` configured
- Entry point: `wsgi.py`
- Start command: `gunicorn wsgi:app`
- CORS configured for Vercel frontend

## 📝 Final Notes

1. **Backup**: Create a backup before migration
2. **Git**: Commit changes before and after migration
3. **Testing**: Test both frontend and backend locally
4. **Environment**: Update any environment-specific configurations
5. **CI/CD**: Update any CI/CD pipelines if needed

The migration will create a clean, deployment-ready structure that follows modern full-stack application conventions.
