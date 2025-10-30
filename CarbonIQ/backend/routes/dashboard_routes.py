from flask import Blueprint, jsonify, request
from sqlalchemy import func, extract
from models import db, Emission, Asset, Activity, MonthlySummary, User, Goal
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Try to import OpenAI client
try:
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    openai_available = True
except ImportError:
    openai_available = False
    print("⚠️ OpenAI library not available")

dashboard_bp = Blueprint("dashboard_bp", __name__, url_prefix="/api/dashboard")


# --- 1. Dashboard Stats ---
@dashboard_bp.route("/stats/<int:user_id>", methods=["GET"])
def get_dashboard_stats(user_id):
    total_emissions = (
        db.session.query(func.sum(Emission.amount))
        .filter_by(user_id=user_id)
        .scalar()
        or 0
    )

    asset_count = db.session.query(Asset).filter_by(user_id=user_id).count()

    recent_activities = (
        db.session.query(Emission)
        .filter_by(user_id=user_id)
        .order_by(Emission.date.desc())
        .limit(5)
        .all()
    )

    # Get user's active goals
    active_goals = Goal.query.filter_by(user_id=user_id, status='active').count()
    
    # Calculate monthly change
    current_month = datetime.utcnow().month
    current_year = datetime.utcnow().year
    
    # Get current month's emissions
    current_month_emissions = db.session.query(func.sum(Emission.amount))\
        .filter(
            Emission.user_id == user_id,
            extract('month', Emission.date) == current_month,
            extract('year', Emission.date) == current_year
        )\
        .scalar() or 0
    
    # Get previous month's emissions
    last_month = current_month - 1 if current_month > 1 else 12
    last_month_year = current_year if current_month > 1 else current_year - 1
    
    last_month_emissions = db.session.query(func.sum(Emission.amount))\
        .filter(
            Emission.user_id == user_id,
            extract('month', Emission.date) == last_month,
            extract('year', Emission.date) == last_month_year
        )\
        .scalar() or 0
    
    # Calculate percentage change
    monthly_change = 0
    if last_month_emissions > 0:
        monthly_change = ((current_month_emissions - last_month_emissions) / last_month_emissions) * 100
    
    return jsonify({
        "totalEmission": round(total_emissions, 2),
        "thisMonth": round(current_month_emissions, 2),
        "activitiesLogged": asset_count,  # Number of assets as activities logged
        "activeGoals": active_goals,
        "monthly_change": round(monthly_change, 2),
        "recent_activities": [
            {
                "id": e.id,
                "amount": round(e.amount, 2),
                "timestamp": e.date.isoformat(),
                "source": e.source,
                "emission_type": e.emission_type,
                "unit": e.unit
            }
            for e in recent_activities
        ],
    }), 200


# --- 2. Emissions Trend ---
@dashboard_bp.route("/emissions-trend/<int:user_id>", methods=["GET"])
def get_emissions_trend(user_id):
    days = int(request.args.get("days", 30))
    start_date = datetime.utcnow() - timedelta(days=days)

    trend_data = (
        db.session.query(
            func.date(Emission.date).label("date"),
            func.sum(Emission.amount).label("total")
        )
        .filter(Emission.user_id == user_id, Emission.date >= start_date)
        .group_by(func.date(Emission.date))
        .order_by(func.date(Emission.date))  # ✅ ensure sorted ascending by date
        .all()
    )

    return jsonify([
        {"date": str(row.date), "value": round(row.total, 2)} for row in trend_data
    ]), 200


# --- 3. Top Emitters ---
@dashboard_bp.route("/top-emitters/<int:user_id>", methods=["GET"])
def get_top_emitters(user_id):
    results = (
        db.session.query(
            Asset.name,
            func.sum(Emission.amount).label("total")
        )
        .join(Emission, Asset.id == Emission.asset_id)
        .filter(Emission.user_id == user_id)
        .group_by(Asset.name)
        .order_by(func.sum(Emission.amount).desc())
        .limit(5)
        .all()
    )

    # Add colors for pie chart
    colors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']
    
    emitters_data = [
        {
            "name": name,
            "value": round(total, 2),
            "color": colors[i] if i < len(colors) else '#6b7280'
        }
        for i, (name, total) in enumerate(results)
    ]
    
    return jsonify(emitters_data), 200


# --- 4. Recent Activities ---
@dashboard_bp.route("/recent-activities/<int:user_id>", methods=["GET"])
def get_recent_activities(user_id):
    limit = int(request.args.get("limit", 10))
    
    # Get emissions and activities
    emissions = (
        db.session.query(Emission)
        .filter_by(user_id=user_id)
        .order_by(Emission.date.desc())
        .limit(limit)
        .all()
    )
    
    # Get manual activities
    activities = (
        db.session.query(Activity)
        .filter_by(user_id=user_id)
        .order_by(Activity.date.desc())
        .limit(limit)
        .all()
    )
    
    # Combine and sort by date
    all_activities = []
    
    for e in emissions:
        # Skip if no date
        if not e.date:
            continue
            
        all_activities.append({
            "type": "emission",
            "id": e.id,
            "title": f"{e.source} - {e.emission_type}",
            "amount": round(e.amount, 2),
            "date": e.date.strftime('%b %d, %Y'),
            "timestamp": e.date.isoformat(),
            "asset_id": e.asset_id,
            "source": e.source,
            "emission_type": e.emission_type,
            "unit": e.unit,
            "badge": e.emission_type or "emission",
            "location": "N/A",
            "icon": "🌍",
            "iconBg": "bg-green-500"
        })
    
    for a in activities:
        # Skip if no date
        if not a.date:
            continue
            
        all_activities.append({
            "type": "activity",
            "id": a.id,
            "title": a.title,
            "location": a.location or "N/A",
            "amount": round(a.amount, 2),
            "date": a.date.strftime('%b %d, %Y'),
            "timestamp": a.date.isoformat(),
            "unit": a.unit,
            "badge": a.badge or "activity",
            "icon": a.icon or "✅",
            "iconBg": "bg-blue-500"
        })
    
    # Sort all activities by timestamp
    all_activities.sort(key=lambda x: x["timestamp"], reverse=True)
    
    # Return only the requested number of items
    return jsonify(all_activities[:limit]), 200


# --- 5. AI Insights ---
@dashboard_bp.route("/insights/<int:user_id>", methods=["GET"])
def get_ai_insights(user_id):
    try:
        # Get user data for context
        user = User.query.get_or_404(user_id)
        
        # Get recent emissions data
        recent_emissions = (
            db.session.query(Emission)
            .filter_by(user_id=user_id)
            .order_by(Emission.date.desc())
            .limit(20)
            .all()
        )
        
        # Get top assets by emissions
        top_assets = (
            db.session.query(
                Asset.name,
                func.sum(Emission.amount).label("total_emissions")
            )
            .join(Emission, Asset.id == Emission.asset_id)
            .filter(Emission.user_id == user_id)
            .group_by(Asset.name)
            .order_by(func.sum(Emission.amount).desc())
            .limit(3)
            .all()
        )
        
        # Format data for AI
        emissions_data = [
            f"{e.source}: {e.amount} {e.unit} on {e.date.strftime('%Y-%m-%d')}"
            for e in recent_emissions[:5]  # Only send last 5 for context
        ]
        
        top_assets_data = [
            f"{name}: {round(emissions, 2)} kg CO₂"
            for name, emissions in top_assets
        ]
        
        # Create prompt for AI
        prompt = f"""
        You are an AI sustainability coach. Provide a brief, friendly, and actionable 
        insight based on the user's carbon emissions data. Focus on one key observation 
        and one specific, practical suggestion for reducing their carbon footprint.
        
        User: {user.name}
        
        Recent emissions:
        {emissions}
        
        Top emission sources:
        {sources}
        
        Keep the response under 2 sentences. Be encouraging and specific.
        Example: "I see your daily commute is your biggest source of emissions. 
        Could you try working from home one day this week to reduce your impact?"
        """.format(
            emissions="\n".join(emissions_data) or "No recent emissions data",
            sources="\n".join(top_assets_data) or "No emission sources identified"
        )
        
        # Get AI response
        if openai_available and client:
            try:
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a helpful AI sustainability coach."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=100,
                    temperature=0.7
                )
                
                insight = response.choices[0].message.content.strip()
            except Exception as ai_error:
                print(f"⚠️ OpenAI API error: {ai_error}")
                insight = "Every small action counts! Track your emissions to see how you can make a difference."
        else:
            insight = "Every small action counts! Track your emissions to see how you can make a difference."
        
        return jsonify({
            "insight": insight,
            "timestamp": datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        # Fallback in case of API failure
        return jsonify({
            "insight": "Every small action counts! Track your emissions to see how you can make a difference.",
            "error": str(e)
        }), 200
