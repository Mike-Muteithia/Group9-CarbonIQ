from flask import Blueprint, jsonify, request
from sqlalchemy import func
from models import db, Emission, Asset
from datetime import datetime, timedelta

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

    return jsonify({
        "total_emissions": round(total_emissions, 2),  # ✅ round for cleaner display
        "asset_count": asset_count,
        "recent_activities": [
            {
                "amount": round(e.amount, 2),
                "timestamp": e.date.isoformat(),
                "source": e.source,  # ✅ adds context (e.g. “Flight”, “Vehicle”)
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
        {"date": str(row.date), "total": round(row.total, 2)} for row in trend_data
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

    return jsonify([
        {"asset": name, "total_emissions": round(total, 2)} for name, total in results
    ]), 200


# --- 4. Recent Activities ---
@dashboard_bp.route("/recent-activities/<int:user_id>", methods=["GET"])
def get_recent_activities(user_id):
    limit = int(request.args.get("limit", 10))
    activities = (
        db.session.query(Emission)
        .filter_by(user_id=user_id)
        .order_by(Emission.date.desc())
        .limit(limit)
        .all()
    )

    return jsonify([
        {
            "amount": round(e.amount, 2),
            "timestamp": e.date.isoformat(),
            "asset_id": e.asset_id,
            "source": e.source,
            "emission_type": e.emission_type,
        }
        for e in activities
    ]), 200
