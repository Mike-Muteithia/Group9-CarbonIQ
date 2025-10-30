from flask import Blueprint, jsonify, request
from models import db, Activity, Emission, User, Asset
from utils.carbon_calculator import CarbonCalculator
from datetime import datetime
import traceback

activity_bp = Blueprint('activity_bp', __name__, url_prefix='/api/activities')


# GET ALL ACTIVITIES
@activity_bp.route('/<int:user_id>', methods=['GET'])
def get_activities(user_id):
    """
    Get all activities for a user
    Returns: [{ id, title, location, date, amount, unit, badge, icon }, ...]
    """
    try:
        print(f"🔍 Querying activities for user {user_id}")
        
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            print(f"❌ User {user_id} not found")
            return jsonify({'error': 'User not found'}), 404
        
        # Get pagination parameters
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 20, type=int)
        
        # Get filter parameters
        category = request.args.get('category', None)
        
        # Build query
        query = Activity.query.filter_by(user_id=user_id)
        
        if category:
            query = query.filter_by(badge=category)
        
        # Order by date descending
        query = query.order_by(Activity.date.desc())
        
        # Paginate
        offset = (page - 1) * limit
        activities = query.limit(limit).offset(offset).all()
        total = query.count()
        
        print(f"📝 Found {len(activities)} activities (total: {total})")
        
        activities_data = [activity.to_dict() for activity in activities]
        
        return jsonify({
            'activities': activities_data,
            'total': total,
            'page': page,
            'limit': limit,
            'pages': (total + limit - 1) // limit
        }), 200
        
    except Exception as e:
        print(f"❌ Error getting activities: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# CREATE NEW ACTIVITY WITH EMISSION CALCULATION
@activity_bp.route('', methods=['POST'])
def create_activity():
    """
    Create a new activity and calculate its carbon emission
    Body: {
        user_id, title, category, activity_type, value, unit, location, date
    }
    """
    try:
        data = request.get_json()
        print(f"🆕 Creating new activity: {data}")
        
        # Validate required fields
        required_fields = ['user_id', 'title', 'category', 'activity_type', 'value']
        for field in required_fields:
            if field not in data:
                error_msg = f"Missing required field: {field}"
                print(f"❌ {error_msg}")
                return jsonify({'error': error_msg}), 400
        
        # Check if user exists
        user = User.query.get(data['user_id'])
        if not user:
            error_msg = f"User {data['user_id']} not found"
            print(f"❌ {error_msg}")
            return jsonify({'error': error_msg}), 404
        
        # Calculate carbon emission based on category
        category = data['category']
        activity_type = data['activity_type']
        value = float(data['value'])
        
        emission_result = None
        
        if category == 'transport':
            emission_result = CarbonCalculator.calculate_transport_emission(value, activity_type)
        elif category == 'energy':
            emission_result = CarbonCalculator.calculate_energy_emission(value, activity_type)
        elif category == 'food':
            emission_result = CarbonCalculator.calculate_food_emission(value, activity_type)
        elif category == 'waste':
            emission_result = CarbonCalculator.calculate_waste_emission(value, activity_type)
        else:
            # Custom calculation
            factor = data.get('emission_factor', 1.0)
            emission_result = CarbonCalculator.calculate_custom_emission(value, factor)
        
        # Get icon based on category
        icon_map = {
            'transport': '🚗',
            'energy': '⚡',
            'food': '🍽️',
            'waste': '🗑️',
            'other': '📝'
        }
        
        # Create Activity record
        new_activity = Activity(
            user_id=data['user_id'],
            title=data['title'],
            location=data.get('location', ''),
            date=datetime.fromisoformat(data['date']) if 'date' in data else datetime.utcnow(),
            amount=emission_result['amount'],
            unit=emission_result['unit'],
            badge=category,
            icon=data.get('icon', icon_map.get(category, '📝'))
        )
        
        db.session.add(new_activity)
        
        # Also create an Emission record for tracking
        asset_id = data.get('asset_id', None)
        
        new_emission = Emission(
            user_id=data['user_id'],
            asset_id=asset_id,
            emission_type=category,
            activity=data['title'],
            source=data.get('source', data['title']),
            original_value=value,
            unit=data.get('input_unit', 'units'),
            amount=emission_result['amount'],
            calculation_method=emission_result.get('calculation', ''),
            emission_factor=emission_result.get('factor', 0.0),
            date=datetime.fromisoformat(data['date']) if 'date' in data else datetime.utcnow()
        )
        
        db.session.add(new_emission)
        db.session.commit()
        
        print(f"✅ Activity created successfully: {new_activity.to_dict()}")
        print(f"✅ Emission recorded: {emission_result['amount']} kg CO₂")
        
        return jsonify({
            'message': 'Activity created successfully!',
            'activity': new_activity.to_dict(),
            'emission': {
                'amount': emission_result['amount'],
                'calculation': emission_result.get('calculation', ''),
                'factor': emission_result.get('factor', 0.0)
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error creating activity: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# UPDATE ACTIVITY
@activity_bp.route('/<int:activity_id>', methods=['PUT'])
def update_activity(activity_id):
    """
    Update an existing activity
    Body: { title, location, amount, badge, icon }
    """
    try:
        activity = Activity.query.get(activity_id)
        
        if not activity:
            print(f"❌ Activity {activity_id} not found")
            return jsonify({'error': 'Activity not found'}), 404
        
        data = request.get_json()
        print(f"📝 Updating activity {activity_id}: {data}")
        
        # Update fields if provided
        if 'title' in data:
            activity.title = data['title']
        if 'location' in data:
            activity.location = data['location']
        if 'amount' in data:
            activity.amount = float(data['amount'])
        if 'badge' in data:
            activity.badge = data['badge']
        if 'icon' in data:
            activity.icon = data['icon']
        if 'date' in data:
            activity.date = datetime.fromisoformat(data['date'])
        
        db.session.commit()
        
        print(f"✅ Activity updated successfully: {activity.to_dict()}")
        return jsonify({
            'message': 'Activity updated successfully!',
            'activity': activity.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error updating activity: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# DELETE ACTIVITY
@activity_bp.route('/<int:activity_id>', methods=['DELETE'])
def delete_activity(activity_id):
    """
    Delete an activity
    """
    try:
        activity = Activity.query.get(activity_id)
        
        if not activity:
            print(f"❌ Activity {activity_id} not found")
            return jsonify({'error': 'Activity not found'}), 404
        
        print(f"🗑️ Deleting activity {activity_id}: {activity.title}")
        
        db.session.delete(activity)
        db.session.commit()
        
        print("✅ Activity deleted successfully!")
        return jsonify({'message': 'Activity deleted successfully!'}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error deleting activity: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# GET ACTIVITY CATEGORIES AND TYPES
@activity_bp.route('/categories', methods=['GET'])
def get_categories():
    """
    Get available activity categories and their types
    """
    try:
        categories = CarbonCalculator.get_available_categories()
        
        # Format for frontend
        formatted_categories = {
            'transport': {
                'name': 'Transportation',
                'icon': '🚗',
                'types': [
                    {'value': 'car_petrol', 'label': 'Car (Petrol)', 'unit': 'km'},
                    {'value': 'car_diesel', 'label': 'Car (Diesel)', 'unit': 'km'},
                    {'value': 'car_electric', 'label': 'Car (Electric)', 'unit': 'km'},
                    {'value': 'car_hybrid', 'label': 'Car (Hybrid)', 'unit': 'km'},
                    {'value': 'motorcycle', 'label': 'Motorcycle', 'unit': 'km'},
                    {'value': 'bus', 'label': 'Bus', 'unit': 'km'},
                    {'value': 'train', 'label': 'Train', 'unit': 'km'},
                    {'value': 'plane_short', 'label': 'Flight (Short-haul)', 'unit': 'km'},
                    {'value': 'plane_long', 'label': 'Flight (Long-haul)', 'unit': 'km'},
                    {'value': 'bicycle', 'label': 'Bicycle', 'unit': 'km'},
                    {'value': 'walking', 'label': 'Walking', 'unit': 'km'},
                ]
            },
            'energy': {
                'name': 'Energy',
                'icon': '⚡',
                'types': [
                    {'value': 'electricity_grid', 'label': 'Electricity (Grid)', 'unit': 'kWh'},
                    {'value': 'electricity_coal', 'label': 'Electricity (Coal)', 'unit': 'kWh'},
                    {'value': 'electricity_gas', 'label': 'Electricity (Gas)', 'unit': 'kWh'},
                    {'value': 'electricity_renewable', 'label': 'Electricity (Renewable)', 'unit': 'kWh'},
                    {'value': 'natural_gas', 'label': 'Natural Gas', 'unit': 'kWh'},
                    {'value': 'heating_oil', 'label': 'Heating Oil', 'unit': 'L'},
                ]
            },
            'food': {
                'name': 'Food',
                'icon': '🍽️',
                'types': [
                    {'value': 'beef', 'label': 'Beef', 'unit': 'kg'},
                    {'value': 'lamb', 'label': 'Lamb', 'unit': 'kg'},
                    {'value': 'pork', 'label': 'Pork', 'unit': 'kg'},
                    {'value': 'chicken', 'label': 'Chicken', 'unit': 'kg'},
                    {'value': 'fish', 'label': 'Fish', 'unit': 'kg'},
                    {'value': 'eggs', 'label': 'Eggs', 'unit': 'kg'},
                    {'value': 'cheese', 'label': 'Cheese', 'unit': 'kg'},
                    {'value': 'milk', 'label': 'Milk', 'unit': 'L'},
                    {'value': 'rice', 'label': 'Rice', 'unit': 'kg'},
                    {'value': 'vegetables', 'label': 'Vegetables', 'unit': 'kg'},
                    {'value': 'fruits', 'label': 'Fruits', 'unit': 'kg'},
                ]
            },
            'waste': {
                'name': 'Waste',
                'icon': '🗑️',
                'types': [
                    {'value': 'general_waste', 'label': 'General Waste', 'unit': 'kg'},
                    {'value': 'recycling', 'label': 'Recycling', 'unit': 'kg'},
                    {'value': 'compost', 'label': 'Compost', 'unit': 'kg'},
                ]
            }
        }
        
        return jsonify(formatted_categories), 200
        
    except Exception as e:
        print(f"❌ Error getting categories: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# GET ACTIVITY STATISTICS
@activity_bp.route('/stats/<int:user_id>', methods=['GET'])
def get_activity_stats(user_id):
    """
    Get statistics about user's activities
    """
    try:
        print(f"📊 Fetching activity stats for user {user_id}")
        
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Total activities
        total_activities = Activity.query.filter_by(user_id=user_id).count()
        
        # Activities by category
        from sqlalchemy import func
        category_stats = db.session.query(
            Activity.badge,
            func.count(Activity.id).label('count'),
            func.sum(Activity.amount).label('total_emissions')
        ).filter_by(user_id=user_id).group_by(Activity.badge).all()
        
        categories = [
            {
                'category': stat.badge or 'other',
                'count': stat.count,
                'total_emissions': round(float(stat.total_emissions or 0), 2)
            }
            for stat in category_stats
        ]
        
        # This month's activities
        first_day_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        this_month_count = Activity.query.filter(
            Activity.user_id == user_id,
            Activity.date >= first_day_of_month
        ).count()
        
        return jsonify({
            'total_activities': total_activities,
            'this_month': this_month_count,
            'by_category': categories
        }), 200
        
    except Exception as e:
        print(f"❌ Error getting activity stats: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
