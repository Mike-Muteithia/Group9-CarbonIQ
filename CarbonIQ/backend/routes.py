
from flask import Blueprint, jsonify, request
from models import db, User, Asset, Emission, Activity, Goal
from sqlalchemy import func
from datetime import datetime, timedelta

api = Blueprint('api', __name__, url_prefix='/api')



# GET DASHBOARD STATS (Top 4 cards)
@api.route('/dashboard/stats/<int:user_id>', methods=['GET'])
def get_dashboard_stats(user_id):
    """
    Get statistics for the 4 cards at the top of dashboard:
    - Total Emission
    - This Month
    - Activities Logged
    - Active Goals
    """
    try:
        # Total Emission (all time)
        total_emission = db.session.query(func.sum(Emission.amount)).filter_by(user_id=user_id).scalar() or 0
        
        # This Month Emission
        first_day_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        this_month = db.session.query(func.sum(Emission.amount)).filter(
            Emission.user_id == user_id,
            Emission.date >= first_day_of_month
        ).scalar() or 0
        
        # Activities Logged (this month)
        activities_count = Activity.query.filter(
            Activity.user_id == user_id,
            Activity.date >= first_day_of_month
        ).count()
        
        # Active Goals
        active_goals = Goal.query.filter_by(user_id=user_id, status='active').count()
        
        return jsonify({
            'totalEmission': round(total_emission, 2),
            'thisMonth': round(this_month, 2),
            'activitiesLogged': activities_count,
            'activeGoals': active_goals
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# GET EMISSIONS TREND (Last 30 Days)
@api.route('/dashboard/emissions-trend/<int:user_id>', methods=['GET'])
def get_emissions_trend(user_id):
    """
    Get emissions data for the line chart (last 30 days)
    Returns: [{ date: 'Dec 19', value: 2.5 }, ...]
    """
    try:
        days = request.args.get('days', 30, type=int)
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Query emissions grouped by date
        emissions = db.session.query(
            func.date(Emission.date).label('date'),
            func.sum(Emission.amount).label('value')
        ).filter(
            Emission.user_id == user_id,
            Emission.date >= start_date
        ).group_by(func.date(Emission.date)).order_by('date').all()
        
        # Format data for chart
        trend_data = [
            {
                'date': emission.date.strftime('%b %d'),
                'value': round(emission.value, 2)
            }
            for emission in emissions
        ]
        
        return jsonify(trend_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# GET TOP EMITTERS (For pie chart)
@api.route('/dashboard/top-emitters/<int:user_id>', methods=['GET'])
def get_top_emitters(user_id):
    """
    Get top 4 emission sources for pie chart
    Returns: [{ name: 'Air Travel', value: 35, color: '#f59e0b' }, ...]
    """
    try:
        # Query top emitters
        top_emitters = db.session.query(
            Emission.source.label('name'),
            func.sum(Emission.amount).label('total')
        ).filter_by(user_id=user_id).group_by(Emission.source).order_by(
            func.sum(Emission.amount).desc()
        ).limit(4).all()
        
        # Color palette for chart
        colors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']
        
        # Calculate total for percentage
        total_emissions = sum([e.total for e in top_emitters])
        
        # Format data
        emitters_data = [
            {
                'name': emitter.name,
                'value': round((emitter.total / total_emissions * 100), 1) if total_emissions > 0 else 0,
                'color': colors[i] if i < len(colors) else '#6b7280'
            }
            for i, emitter in enumerate(top_emitters)
        ]
        
        return jsonify(emitters_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# GET RECENT ACTIVITIES
@api.route('/dashboard/recent-activities/<int:user_id>', methods=['GET'])
def get_recent_activities(user_id):
    """
    Get recent activities for the list at bottom of dashboard
    Returns: [{ title, location, date, amount, unit, badge, icon }, ...]
    """
    try:
        limit = request.args.get('limit', 10, type=int)
        
        activities = Activity.query.filter_by(user_id=user_id).order_by(
            Activity.date.desc()
        ).limit(limit).all()
        
        return jsonify([activity.to_dict() for activity in activities]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@api.route('/assets/<int:user_id>', methods=['GET'])
def get_assets(user_id):
    """
    Get all assets for a user (for My Assets page)
    Returns: [{ id, name, type, fuelType, model, year, emoji }, ...]
    """
    try:
        assets = Asset.query.filter_by(user_id=user_id, status='active').all()
        return jsonify([asset.to_dict() for asset in assets]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# CREATE NEW ASSET
@api.route('/assets', methods=['POST'])
def create_asset():
    """
    Create a new asset
    Body: { user_id, name, type, fuel_type, model, year, emoji }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['user_id', 'name', 'type']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        new_asset = Asset(
            user_id=data['user_id'],
            name=data['name'],
            type=data['type'],
            fuel_type=data.get('fuel_type'),
            model=data.get('model'),
            year=data.get('year'),
            emoji=data.get('emoji', '🚗'),
            carbon_impact=data.get('carbon_impact', 0.0)
        )
        
        db.session.add(new_asset)
        db.session.commit()
        
        return jsonify({
            'message': 'Asset created successfully!',
            'asset': new_asset.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# UPDATE ASSET
@api.route('/assets/<int:asset_id>', methods=['PUT'])
def update_asset(asset_id):
    """
    Update an existing asset
    Body: { name, type, fuel_type, model, year }
    """
    try:
        asset = Asset.query.get(asset_id)
        
        if not asset:
            return jsonify({'error': 'Asset not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'name' in data:
            asset.name = data['name']
        if 'type' in data:
            asset.type = data['type']
        if 'fuel_type' in data:
            asset.fuel_type = data['fuel_type']
        if 'model' in data:
            asset.model = data['model']
        if 'year' in data:
            asset.year = data['year']
        if 'emoji' in data:
            asset.emoji = data['emoji']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Asset updated successfully!',
            'asset': asset.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# DELETE ASSET
@api.route('/assets/<int:asset_id>', methods=['DELETE'])
def delete_asset(asset_id):
    """
    Delete an asset (soft delete by setting status to 'deleted')
    """
    try:
        asset = Asset.query.get(asset_id)
        
        if not asset:
            return jsonify({'error': 'Asset not found'}), 404
        
        # Soft delete
        asset.status = 'deleted'
        db.session.commit()
        
        return jsonify({'message': 'Asset deleted successfully!'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# GET SINGLE ASSET
@api.route('/assets/<int:asset_id>', methods=['GET'])
def get_asset(asset_id):
    """
    Get details of a single asset
    """
    try:
        asset = Asset.query.get(asset_id)
        
        if not asset:
            return jsonify({'error': 'Asset not found'}), 404
        
        return jsonify(asset.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@api.route('/seed-data/<int:user_id>', methods=['POST'])
def seed_data(user_id):
    """
    Create sample data for testing (REMOVE IN PRODUCTION)
    """
    try:
        # Create sample assets
        assets_data = [
            {'name': 'Excavator X300', 'type': 'machine', 'fuel_type': 'diesel', 'model': 'CAT 320', 'year': '2019', 'emoji': '🏗️'},
            {'name': 'Work Truck', 'type': 'vehicle', 'fuel_type': 'diesel', 'model': 'Toyota Hilux', 'year': '2020', 'emoji': '🚚'},
            {'name': 'My Tesla Model 3', 'type': 'vehicle', 'fuel_type': 'electric', 'model': 'Tesla Model 3', 'year': '2023', 'emoji': '🚗'},
        ]
        
        for asset_data in assets_data:
            asset = Asset(user_id=user_id, **asset_data)
            db.session.add(asset)
        
        # Create sample activities
        activities_data = [
            {'title': 'My Tesla Model 3', 'location': '3 times to Downtown', 'amount': 14.20, 'badge': 'vehicle', 'icon': '🚗'},
            {'title': 'Work Truck', 'location': 'Office to Industrial Park', 'amount': 22.78, 'badge': 'vehicle', 'icon': '🚚'},
            {'title': 'Excavator X300', 'location': 'Construction Site A', 'amount': 32.16, 'badge': 'machine', 'icon': '🏗️'},
        ]
        
        for activity_data in activities_data:
            activity = Activity(user_id=user_id, **activity_data)
            db.session.add(activity)
        
        # Create sample goals
        goal = Goal(user_id=user_id, title='Reduce emissions by 15%', target_reduction_percentage=15)
        db.session.add(goal)
        
        db.session.commit()
        
        return jsonify({'message': 'Sample data created successfully!'}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500