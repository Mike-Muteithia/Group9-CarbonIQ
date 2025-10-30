# CarbonIQ Backend Verification Checklist

## Pre-Flight Checks

### 1. Backend Setup ✓
- [ ] Install Python dependencies: `pip install -r backend/requirements.txt`
- [ ] Verify database file exists: `backend/carboniq.db`
- [ ] Check environment variables in `.env` file (optional for OpenAI)
- [ ] Run database migrations if needed

### 2. Start Backend Server
```bash
cd backend
python app.py
```
Expected output:
```
✅ Database (SQLite) tables created successfully!
🚀 Running CarbonIQ Backend on http://localhost:5000
```

### 3. Verify Backend is Running
Visit: http://localhost:5000

Expected response:
```json
{
  "message": "Welcome to CarbonIQ API",
  "status": "running",
  "available_endpoints": { ... }
}
```

---

## API Endpoint Testing

### Dashboard Endpoints

#### 1. Dashboard Stats
```bash
GET http://localhost:5000/api/dashboard/stats/1
```
**Expected Response**:
```json
{
  "totalEmission": 0,
  "thisMonth": 0,
  "activitiesLogged": 0,
  "activeGoals": 0,
  "monthly_change": 0
}
```

#### 2. Emissions Trend
```bash
GET http://localhost:5000/api/dashboard/emissions-trend/1?days=30
```
**Expected Response**:
```json
[
  { "date": "2024-01-15", "value": 25.5 },
  { "date": "2024-01-16", "value": 30.2 }
]
```

#### 3. Top Emitters
```bash
GET http://localhost:5000/api/dashboard/top-emitters/1
```
**Expected Response**:
```json
[
  { "name": "Excavator", "value": 45.2, "color": "#f59e0b" },
  { "name": "Work Truck", "value": 32.8, "color": "#10b981" }
]
```

#### 4. Recent Activities
```bash
GET http://localhost:5000/api/dashboard/recent-activities/1?limit=10
```
**Expected Response**:
```json
[
  {
    "id": 1,
    "title": "My Tesla Model 3",
    "location": "Downtown",
    "date": "Jan 15, 2024",
    "amount": 12.5,
    "unit": "kg CO₂",
    "badge": "vehicle",
    "icon": "🚗",
    "iconBg": "bg-blue-500"
  }
]
```

#### 5. AI Insights
```bash
GET http://localhost:5000/api/dashboard/insights/1
```
**Expected Response**:
```json
{
  "insight": "Every small action counts! Track your emissions to see how you can make a difference.",
  "timestamp": "2024-01-15T10:30:00"
}
```

---

### Asset Endpoints

#### 1. Get All Assets
```bash
GET http://localhost:5000/api/assets/1
```
**Expected Response**:
```json
[
  {
    "id": 1,
    "name": "My Tesla Model 3",
    "type": "vehicle",
    "fuel_type": "electric",
    "model": "Tesla Model 3",
    "year": "2023",
    "emoji": "🚗",
    "carbon_impact": 0.0,
    "status": "active"
  }
]
```

#### 2. Create Asset
```bash
POST http://localhost:5000/api/assets
Content-Type: application/json

{
  "user_id": 1,
  "name": "Work Truck",
  "type": "vehicle",
  "fuel_type": "diesel",
  "model": "Toyota Hilux",
  "year": "2020",
  "emoji": "🚚"
}
```
**Expected Response**:
```json
{
  "message": "Asset created successfully!",
  "asset": { ... }
}
```

#### 3. Update Asset
```bash
PUT http://localhost:5000/api/assets/1
Content-Type: application/json

{
  "name": "Updated Asset Name",
  "fuel_type": "electric"
}
```
**Expected Response**:
```json
{
  "message": "Asset updated successfully!",
  "asset": { ... }
}
```

#### 4. Delete Asset
```bash
DELETE http://localhost:5000/api/assets/1
```
**Expected Response**:
```json
{
  "message": "Asset deleted successfully!"
}
```

---

## Frontend Testing

### 1. Start Frontend Server
```bash
cd client
npm install
npm run dev
```

### 2. Dashboard Page Tests
- [ ] Navigate to `/dashboard`
- [ ] Verify authentication redirect works (if not logged in)
- [ ] Check all 4 stat cards display data
- [ ] Verify emissions trend chart renders
- [ ] Confirm top emitters pie chart shows
- [ ] Check recent activities list displays

**Dashboard URL**: http://localhost:5173/dashboard

### 3. My Assets Page Tests
- [ ] Navigate to `/my-assets`
- [ ] Verify authentication redirect works
- [ ] Click "Add Asset" button
- [ ] Fill out asset form and submit
- [ ] Verify new asset appears in grid
- [ ] Click edit icon on an asset
- [ ] Update asset details and save
- [ ] Click delete icon and confirm deletion
- [ ] Verify asset is removed from grid

**My Assets URL**: http://localhost:5173/my-assets

---

## Common Issues & Solutions

### Issue 1: "User not found" error
**Solution**: Create a test user first via signup or seed data endpoint

### Issue 2: Empty data on dashboard
**Solution**: Use the seed data endpoint to populate test data:
```bash
POST http://localhost:5000/api/seed-data/1
```

### Issue 3: OpenAI insights not working
**Solution**: This is expected if `OPENAI_API_KEY` is not set. The endpoint will return a fallback message.

### Issue 4: CORS errors
**Solution**: Verify `CORS(app)` is enabled in `backend/app.py`

### Issue 5: 404 on asset endpoints
**Solution**: Verify blueprint is registered with correct prefix in `app.py`:
```python
app.register_blueprint(asset_bp, url_prefix='/api/assets')
```

---

## Database Verification

### Check Tables Exist
```python
# In Python shell
from app import app, db
with app.app_context():
    print(db.engine.table_names())
```

Expected tables:
- `users`
- `assets`
- `emissions`
- `activities`
- `goals`
- `monthly_summaries`

### Check Sample Data
```python
from models import User, Asset, Emission
with app.app_context():
    print(f"Users: {User.query.count()}")
    print(f"Assets: {Asset.query.count()}")
    print(f"Emissions: {Emission.query.count()}")
```

---

## Success Criteria

### Backend ✓
- [x] All endpoints return 200 status
- [x] Response formats match frontend expectations
- [x] Error handling works properly
- [x] Logging shows detailed information

### Frontend ✓
- [x] Dashboard page loads without errors
- [x] My Assets page loads without errors
- [x] Authentication redirects work
- [x] Data displays correctly in UI
- [x] CRUD operations work for assets

### Integration ✓
- [x] Frontend successfully calls backend APIs
- [x] Data flows correctly between frontend and backend
- [x] No CORS errors
- [x] Loading states work properly
- [x] Error messages display correctly

---

## Final Verification Commands

### Test Backend Health
```bash
curl http://localhost:5000/health
```

### Test Database Connection
```bash
curl http://localhost:5000/api/test-db
```

### Test Dashboard Stats (replace user_id)
```bash
curl http://localhost:5000/api/dashboard/stats/1
```

### Test Assets Endpoint (replace user_id)
```bash
curl http://localhost:5000/api/assets/1
```

---

**Status**: Ready for testing ✅
**Last Updated**: 2024
