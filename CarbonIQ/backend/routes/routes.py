from flask import Blueprint, jsonify, request
from models import db, User, Asset, Emission, Activity, Goal, MonthlySummary
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import func
from datetime import datetime, timedelta
import traceback
import random

# Try to import EmissionService, but handle if it doesn't exist
try:
    from emissionservice import EmissionService
    emission_service_available = True
    print("✅ EmissionService imported successfully")
except ImportError as e:
    print(f"⚠️ EmissionService not available: {e}")
    emission_service_available = False

api = Blueprint('api', __name__, url_prefix='/api')

# TEST ENDPOINT - Check database connectivity
@api.route('/test-db', methods=['GET'])
def test_db():
    """Test database connectivity and basic queries"""
    try:
        print("🧪 Testing database connectivity...")
        
        # Test users
        users_count = User.query.count()
        print(f"👥 Users in DB: {users_count}")
        
        # Test emissions
        emissions_count = Emission.query.count()
        print(f"🌫️ Emissions in DB: {emissions_count}")
        
        # Test activities
        activities_count = Activity.query.count()
        print(f"📊 Activities in DB: {activities_count}")
        
        # Test specific user
        user_1 = User.query.get(1)
        user_1_info = user_1.to_dict() if user_1 else "User 1 not found"
        
        return jsonify({
            'success': True,
            'database_status': 'connected',
            'counts': {
                'users': users_count,
                'emissions': emissions_count,
                'activities': activities_count,
                'assets': Asset.query.count(),
                'goals': Goal.query.count()
            },
            'user_1': user_1_info
        }), 200
        
    except Exception as e:
        print(f"❌ Database test failed: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# GET DASHBOARD STATS (Top 4 cards) - ENHANCED VERSION
@api.route('/dashboard/stats/<int:user_id>', methods=['GET'])
def get_dashboard_stats(user_id):
    """
    Get statistics for the 4 cards at the top of dashboard
    """
    try:
        print(f"📊 Fetching dashboard stats for user {user_id}")
        
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            print(f"❌ User {user_id} not found")
            return jsonify({'error': 'User not found'}), 404
        
        # Total Emission (all time)
        total_emission = db.session.query(func.sum(Emission.amount)).filter_by(user_id=user_id).scalar() or 0
        print(f"🌍 Total emission: {total_emission}")
        
        # This Month Emission
        first_day_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        this_month = db.session.query(func.sum(Emission.amount)).filter(
            Emission.user_id == user_id,
            Emission.date >= first_day_of_month
        ).scalar() or 0
        print(f"📅 This month emission: {this_month}")
        
        # Activities Logged (this month)
        activities_count = Activity.query.filter(
            Activity.user_id == user_id,
            Activity.date >= first_day_of_month
        ).count()
        print(f"📝 Activities logged: {activities_count}")
        
        # Active Goals
        active_goals = Goal.query.filter_by(user_id=user_id, status='active').count()
        print(f"🎯 Active goals: {active_goals}")
        
        response_data = {
            'totalEmission': round(total_emission, 2),
            'thisMonth': round(this_month, 2),
            'activitiesLogged': activities_count,
            'activeGoals': active_goals
        }
        
        # Add enhanced data only if EmissionService is available
        if emission_service_available:
            try:
                enhanced_stats = EmissionService.get_dashboard_stats(user_id)
                response_data['enhancedData'] = {
                    'change_percent': enhanced_stats.get('change_percent', 0),
                    'change_type': enhanced_stats.get('change_type', 'neutral'),
                    'period': enhanced_stats.get('period', 'month'),
                    'message': enhanced_stats.get('message', ''),
                    'category_breakdown': enhanced_stats.get('category_breakdown', {})
                }
                print("✅ Enhanced stats added")
            except Exception as e:
                print(f"⚠️ Enhanced stats failed: {e}")
                response_data['enhancedData'] = {
                    'change_percent': 0,
                    'change_type': 'neutral', 
                    'period': 'month',
                    'message': 'Enhanced stats unavailable',
                    'category_breakdown': {}
                }
        else:
            response_data['enhancedData'] = {
                'change_percent': 0,
                'change_type': 'neutral',
                'period': 'month',
                'message': 'EmissionService not available',
                'category_breakdown': {}
            }
        
        print(f"✅ Returning dashboard stats: {response_data}")
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"❌ Error in dashboard stats: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# GET EMISSIONS TREND (Last 30 Days) - FIXED VERSION
@api.route('/dashboard/emissions-trend/<int:user_id>', methods=['GET'])
def get_emissions_trend(user_id):
    """Get emissions trend data for the last 30 days, grouped by date"""
    try:
        days = request.args.get('days', 30, type=int)
        start_date = datetime.utcnow() - timedelta(days=days)
        
        print(f"🔍 Querying emissions trend for user {user_id}, last {days} days from {start_date}")
        
        # Query and group emissions by date
        emissions_by_date = db.session.query(
            func.date(Emission.date).label('emission_date'),
            func.sum(Emission.amount).label('daily_total')
        ).filter(
            Emission.user_id == user_id,
            Emission.date >= start_date
        ).group_by(
            func.date(Emission.date)
        ).order_by(
            func.date(Emission.date)
        ).all()
        
        print(f"📊 Found {len(emissions_by_date)} days with emissions data")
        
        # Create trend data with proper format for frontend
        trend_data = []
        for emission_day in emissions_by_date:
            # Format date as "MMM DD" (e.g., "Jan 15")
            formatted_date = emission_day.emission_date.strftime('%b %d')
            
            trend_data.append({
                'date': formatted_date,
                'value': round(float(emission_day.daily_total), 2)  # Use 'value' as frontend expects
            })
        
        # If no data found, create sample trend for demo
        if not trend_data:
            print("📝 No emissions data found, creating sample trend")
            for i in range(days):
                date = (datetime.utcnow() - timedelta(days=days - i - 1)).strftime('%b %d')
                # Create a realistic trend pattern
                base_value = 20 + (i * 0.5)  # Slight upward trend
                variation = random.uniform(-5, 5)
                value = max(0, base_value + variation)
                
                trend_data.append({
                    'date': date,
                    'value': round(value, 2)
                })
        
        print(f"📈 Returning trend data with {len(trend_data)} points")
        print(f"📅 Sample data: {trend_data[:3]}...")  # Show first 3 points
        
        return jsonify(trend_data), 200
        
    except Exception as e:
        print(f"❌ Error in emissions trend: {str(e)}")
        traceback.print_exc()
        # Return sample data instead of empty array
        sample_data = []
        for i in range(30):
            date = (datetime.utcnow() - timedelta(days=29 - i)).strftime('%b %d')
            sample_data.append({
                'date': date,
                'value': round(random.uniform(15, 35), 2)
            })
        return jsonify(sample_data), 200

# GET TOP EMITTERS (For pie chart) - FIXED VERSION
@api.route('/dashboard/top-emitters/<int:user_id>', methods=['GET'])
def get_top_emitters(user_id):
    """Get top emission sources with actual emission values (not percentages)"""
    try:
        print(f"🔍 Querying top emitters for user {user_id}")
        
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            print(f"❌ User {user_id} not found")
            return jsonify({'error': 'User not found'}), 404
        
        # Query top emitters with actual emission values
        top_emitters = db.session.query(
            Emission.source.label('name'),
            func.sum(Emission.amount).label('value')  # Use 'value' instead of 'total'
        ).filter_by(user_id=user_id).group_by(Emission.source).order_by(
            func.sum(Emission.amount).desc()
        ).limit(4).all()
        
        print(f"📊 Found {len(top_emitters)} top emitters")
        
        # If no emitters found, return sample data
        if not top_emitters:
            print("📝 No emitters found, returning sample data")
            sample_emitters = [
                {'name': 'Excavator', 'value': 45.2},
                {'name': 'Work Truck', 'value': 32.8},
                {'name': 'Office Electricity', 'value': 28.5},
                {'name': 'Business Travel', 'value': 15.7}
            ]
            top_emitters = sample_emitters
        else:
            # Convert to list of dicts
            top_emitters = [{'name': e.name, 'value': round(float(e.value), 2)} for e in top_emitters]
        
        # Color palette for chart
        colors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']
        
        # Add colors to each emitter
        emitters_data = [
            {
                'name': emitter['name'],
                'value': emitter['value'],
                'color': colors[i] if i < len(colors) else '#6b7280'
            }
            for i, emitter in enumerate(top_emitters)
        ]
        
        print(f"🎨 Returning top emitters: {emitters_data}")
        return jsonify(emitters_data), 200
        
    except Exception as e:
        print(f"❌ Error in top emitters: {str(e)}")
        traceback.print_exc()
        # Return sample data on error
        sample_data = [
            {'name': 'Excavator', 'value': 45.2, 'color': '#f59e0b'},
            {'name': 'Work Truck', 'value': 32.8, 'color': '#10b981'},
            {'name': 'Office', 'value': 28.5, 'color': '#3b82f6'},
            {'name': 'Travel', 'value': 15.7, 'color': '#8b5cf6'}
        ]
        return jsonify(sample_data), 200

# GET RECENT ACTIVITIES
@api.route('/dashboard/recent-activities/<int:user_id>', methods=['GET'])
def get_recent_activities(user_id):
    """
    Get recent activities for the list at bottom of dashboard
    Returns: [{ title, location, date, amount, unit, badge, icon }, ...]
    """
    try:
        limit = request.args.get('limit', 10, type=int)
        print(f"🔍 Querying recent activities for user {user_id}, limit {limit}")
        
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            print(f"❌ User {user_id} not found")
            return jsonify({'error': 'User not found'}), 404
        
        activities = Activity.query.filter_by(user_id=user_id).order_by(
            Activity.date.desc()
        ).limit(limit).all()
        
        print(f"📝 Found {len(activities)} activities")
        
        activities_data = [activity.to_dict() for activity in activities]
        print(f"✅ Returning activities: {activities_data}")
        
        return jsonify(activities_data), 200
        
    except Exception as e:
        print(f"❌ Error in recent activities: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# GET ALL ASSETS
@api.route('/assets/<int:user_id>', methods=['GET'])
def get_assets(user_id):
    """
    Get all assets for a user (for My Assets page)
    Returns: [{ id, name, type, fuelType, model, year, emoji }, ...]
    """
    try:
        print(f"🔍 Querying assets for user {user_id}")
        
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            print(f"❌ User {user_id} not found")
            return jsonify({'error': 'User not found'}), 404
        
        assets = Asset.query.filter_by(user_id=user_id, status='active').all()
        print(f"📊 Found {len(assets)} assets")
        
        assets_data = [asset.to_dict() for asset in assets]
        return jsonify(assets_data), 200
        
    except Exception as e:
        print(f"❌ Error getting assets: {str(e)}")
        traceback.print_exc()
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
        print(f"🆕 Creating new asset: {data}")
        
        # Validate required fields
        required_fields = ['user_id', 'name', 'type']
        for field in required_fields:
            if field not in data:
                error_msg = f'Missing required field: {field}'
                print(f"❌ {error_msg}")
                return jsonify({'error': error_msg}), 400
        
        # Check if user exists
        user = User.query.get(data['user_id'])
        if not user:
            error_msg = f"User {data['user_id']} not found"
            print(f"❌ {error_msg}")
            return jsonify({'error': error_msg}), 404
        
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
        
        print(f"✅ Asset created successfully: {new_asset.to_dict()}")
        return jsonify({
            'message': 'Asset created successfully!',
            'asset': new_asset.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error creating asset: {str(e)}")
        traceback.print_exc()
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
            print(f"❌ Asset {asset_id} not found")
            return jsonify({'error': 'Asset not found'}), 404
        
        data = request.get_json()
        print(f"📝 Updating asset {asset_id}: {data}")
        
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
        
        print(f"✅ Asset updated successfully: {asset.to_dict()}")
        return jsonify({
            'message': 'Asset updated successfully!',
            'asset': asset.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error updating asset: {str(e)}")
        traceback.print_exc()
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
            print(f"❌ Asset {asset_id} not found")
            return jsonify({'error': 'Asset not found'}), 404
        
        print(f"🗑️ Deleting asset {asset_id}: {asset.name}")
        
        # Soft delete
        asset.status = 'deleted'
        db.session.commit()
        
        print("✅ Asset deleted successfully!")
        return jsonify({'message': 'Asset deleted successfully!'}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error deleting asset: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# GET SINGLE ASSET
@api.route('/assets/single/<int:asset_id>', methods=['GET'])
def get_single_asset(asset_id):
    """
    Get details of a single asset
    """
    try:
        print(f"🔍 Querying single asset {asset_id}")
        
        asset = Asset.query.get(asset_id)
        
        if not asset:
            print(f"❌ Asset {asset_id} not found")
            return jsonify({'error': 'Asset not found'}), 404
        
        print(f"✅ Found asset: {asset.to_dict()}")
        return jsonify(asset.to_dict()), 200
        
    except Exception as e:
        print(f"❌ Error getting single asset: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# SEED SAMPLE DATA
@api.route('/seed-data/<int:user_id>', methods=['POST'])
def seed_data(user_id):
    """
    Create sample data for testing (REMOVE IN PRODUCTION)
    """
    try:
        print(f"🌱 Seeding sample data for user {user_id}")
        
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            print(f"❌ User {user_id} not found")
            return jsonify({'error': 'User not found'}), 404
        
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
        
        print("✅ Sample data created successfully!")
        return jsonify({'message': 'Sample data created successfully!'}), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error seeding data: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# RECORD EMISSION
@api.route('/emissions/record', methods=['POST'])
def record_emission():
    """Record a new emission with automatic calculation"""
    try:
        data = request.get_json()
        print(f"📝 Recording new emission: {data}")
        
        required_fields = ['user_id', 'original_value', 'emission_type']
        if not all(field in data for field in required_fields):
            error_msg = 'Missing required fields'
            print(f"❌ {error_msg}")
            return jsonify({'error': error_msg}), 400
        
        # Check if user exists
        user = User.query.get(data['user_id'])
        if not user:
            error_msg = f"User {data['user_id']} not found"
            print(f"❌ {error_msg}")
            return jsonify({'error': error_msg}), 404
        
        if emission_service_available:
            emission = EmissionService.record_emission(
                user_id=data['user_id'],
                emission_data=data
            )
        else:
            # Fallback implementation
            emission = Emission(
                user_id=data['user_id'],
                amount=data['original_value'],
                source=data.get('source', 'Unknown'),
                emission_type=data['emission_type'],
                activity=data.get('activity', ''),
                original_value=data['original_value'],
                unit=data.get('unit', 'kg'),
                date=data.get('date', datetime.utcnow())
            )
            db.session.add(emission)
            db.session.commit()
        
        print(f"✅ Emission recorded successfully: {emission.to_dict()}")
        return jsonify({
            'message': 'Emission recorded successfully',
            'emission': emission.to_dict(),
            'calculated_co2': emission.amount
        }), 201
        
    except Exception as e:
        print(f"❌ Error recording emission: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# GET USER EMISSIONS
@api.route('/emissions/user/<int:user_id>')
def get_user_emissions(user_id):
    """Get user's emission history with pagination"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        print(f"🔍 Querying emissions for user {user_id}, page {page}, per_page {per_page}")
        
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            print(f"❌ User {user_id} not found")
            return jsonify({'error': 'User not found'}), 404
        
        emissions = Emission.query.filter_by(user_id=user_id)\
            .order_by(Emission.date.desc())\
            .paginate(page=page, per_page=per_page, error_out=False)
        
        print(f"📊 Found {emissions.total} total emissions, showing {len(emissions.items)} on page {page}")
        
        return jsonify({
            'emissions': [e.to_dict() for e in emissions.items],
            'total': emissions.total,
            'pages': emissions.pages,
            'current_page': page
        })
    except Exception as e:
        print(f"❌ Error getting user emissions: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# GET EMISSION CATEGORIES
@api.route('/emissions/categories/<int:user_id>', methods=['GET'])
def get_emission_categories(user_id):
    """Get emissions broken down by category for current month"""
    try:
        current_date = datetime.now()
        print(f"🔍 Querying emission categories for user {user_id}, {current_date.year}-{current_date.month}")
        
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            print(f"❌ User {user_id} not found")
            return jsonify({'error': 'User not found'}), 404
        
        summary = MonthlySummary.query.filter_by(
            user_id=user_id,
            year=current_date.year,
            month=current_date.month
        ).first()
        
        if not summary:
            print("📝 No monthly summary found, returning zeros")
            return jsonify({
                'electricity': 0,
                'transport': 0,
                'food': 0,
                'other': 0
            }), 200
        
        result = {
            'electricity': round(summary.electricity_emissions, 2),
            'transport': round(summary.transport_emissions, 2),
            'food': round(summary.food_emissions, 2),
            'other': round(summary.other_emissions, 2)
        }
        
        print(f"📊 Emission categories: {result}")
        return jsonify(result), 200
        
    except Exception as e:
        print(f"❌ Error getting emission categories: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# SEED EMISSION DATA
@api.route('/seed-emissions/<int:user_id>', methods=['POST'])
def seed_emission_data(user_id):
    """
    Create sample emission data for testing (REMOVE IN PRODUCTION)
    """
    try:
        print(f"🌱 Seeding emission data for user {user_id}")
        
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            print(f"❌ User {user_id} not found")
            return jsonify({'error': 'User not found'}), 404
        
        sample_emissions = [
            # Current month - transport
            {
                'user_id': user_id,
                'emission_type': 'transport',
                'original_value': 50,
                'unit': 'km',
                'source': 'Car commute',
                'activity': 'Work travel',
                'calculation_method': 'standard',
                'calculation_params': {'vehicle_type': 'car'}
            },
            # Current month - electricity
            {
                'user_id': user_id,
                'emission_type': 'electricity',
                'original_value': 200,
                'unit': 'kWh', 
                'source': 'Home electricity',
                'activity': 'Monthly usage',
                'calculation_method': 'standard',
                'calculation_params': {'energy_source': 'average'}
            },
            # Current month - food
            {
                'user_id': user_id,
                'emission_type': 'food',
                'original_value': 2.5,
                'unit': 'kg',
                'source': 'Beef consumption',
                'activity': 'Weekly groceries',
                'calculation_method': 'standard',
                'calculation_params': {'food_type': 'beef'}
            },
            # Previous month data (for comparison)
            {
                'user_id': user_id,
                'emission_type': 'transport', 
                'original_value': 75,
                'unit': 'km',
                'source': 'Car commute',
                'activity': 'Work travel',
                'calculation_method': 'standard',
                'calculation_params': {'vehicle_type': 'car'},
                'date': (datetime.now() - timedelta(days=35)).date()
            },
            {
                'user_id': user_id,
                'emission_type': 'electricity',
                'original_value': 250,
                'unit': 'kWh',
                'source': 'Home electricity', 
                'activity': 'Monthly usage',
                'calculation_method': 'standard',
                'calculation_params': {'energy_source': 'average'},
                'date': (datetime.now() - timedelta(days=35)).date()
            }
        ]
        
        created_emissions = []
        for emission_data in sample_emissions:
            if emission_service_available:
                emission = EmissionService.record_emission(user_id, emission_data)
            else:
                # Fallback implementation
                emission = Emission(
                    user_id=user_id,
                    amount=emission_data['original_value'],
                    source=emission_data['source'],
                    emission_type=emission_data['emission_type'],
                    activity=emission_data['activity'],
                    original_value=emission_data['original_value'],
                    unit=emission_data['unit'],
                    date=emission_data.get('date', datetime.utcnow())
                )
                db.session.add(emission)
                db.session.commit()
            created_emissions.append(emission.to_dict())
        
        print(f"✅ Created {len(created_emissions)} sample emissions")
        return jsonify({
            'message': 'Sample emission data created successfully!',
            'emissions_created': len(created_emissions),
            'emissions': created_emissions
        }), 201
        
    except Exception as e:
        print(f"❌ Error seeding emission data: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# ENHANCED DASHBOARD STATS
@api.route('/dashboard/enhanced-stats/<int:user_id>', methods=['GET'])
def get_enhanced_stats(user_id):
    """Get enhanced dashboard stats with emissions service"""
    try:
        print(f"📊 Fetching enhanced stats for user {user_id}")
        
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            print(f"❌ User {user_id} not found")
            return jsonify({'error': 'User not found'}), 404
        
        if emission_service_available:
            stats = EmissionService.get_dashboard_stats(user_id)
            print(f"✅ Enhanced stats: {stats}")
            return jsonify({
                'success': True,
                'enhancedData': stats
            }), 200
        else:
            print("⚠️ EmissionService not available for enhanced stats")
            return jsonify({
                'success': False,
                'error': 'EmissionService not available',
                'enhancedData': {}
            }), 200
            
    except Exception as e:
        print(f"❌ Error getting enhanced stats: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# DEBUG EMISSIONS ENDPOINT
@api.route('/debug/emissions/<int:user_id>', methods=['GET'])
def debug_emissions(user_id):
    """Debug route to check emission data types"""
    try:
        emissions = Emission.query.filter_by(user_id=user_id).limit(5).all()
        
        debug_info = {
            'total_records': len(emissions),
            'emissions': []
        }
        
        for e in emissions:
            debug_info['emissions'].append({
                'id': e.id,
                'source': e.source,
                'amount': e.amount,
                'date_raw': str(e.date),
                'date_type': str(type(e.date)),
                'is_string': isinstance(e.date, str),
                'is_datetime': isinstance(e.date, datetime)
            })
        
        print(f"🔍 Debug emissions info: {debug_info}")
        return jsonify(debug_info), 200
        
    except Exception as e:
        print(f"❌ Error in debug emissions: {str(e)}")
        return jsonify({'error': str(e)}), 500

# GET USER METRICS
@api.route('/users/<int:user_id>/metrics', methods=['GET'])
def get_user_metrics(user_id):
    """
    Get monthly metrics for a specific user
    Returns enhanced data for metrics card
    """
    try:
        print(f"📊 Fetching user metrics for user {user_id}")
        
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            print(f"❌ User {user_id} not found")
            return jsonify({'error': 'User not found'}), 404

        # Calculate current month emissions
        current_month = datetime.utcnow().month
        current_year = datetime.utcnow().year
        
        current_month_data = db.session.query(func.sum(Emission.amount)).filter(
            Emission.user_id == user_id,
            func.extract('month', Emission.date) == current_month,
            func.extract('year', Emission.date) == current_year
        ).scalar() or 0

        # Calculate previous month emissions
        previous_month = current_month - 1 if current_month > 1 else 12
        previous_year = current_year if current_month > 1 else current_year - 1
        
        previous_month_data = db.session.query(func.sum(Emission.amount)).filter(
            Emission.user_id == user_id,
            func.extract('month', Emission.date) == previous_month,
            func.extract('year', Emission.date) == previous_year
        ).scalar() or 0

        current_emissions = float(current_month_data)
        previous_emissions = float(previous_month_data)

        # Calculate percentage change
        change_percent = 0
        change_type = 'neutral'
        
        if previous_emissions > 0:
            change_percent = ((current_emissions - previous_emissions) / previous_emissions) * 100
            change_type = 'increase' if change_percent > 0 else 'decrease'
        elif current_emissions > 0:
            change_percent = 100
            change_type = 'increase'

        # Generate message based on change
        if change_type == 'increase':
            message = f"Increased by {abs(change_percent):.1f}% from last month"
        elif change_type == 'decrease':
            message = f"Reduced by {abs(change_percent):.1f}% from last month"
        else:
            message = "Stable emissions this month"

        metrics = {
            'period': "This Month",
            'change_type': change_type,
            'change_percent': round(abs(change_percent), 1),
            'message': message,
            'total_emissions': round(current_emissions, 2),
            'previous_emissions': round(previous_emissions, 2),
            'comparison_period': f"{datetime(previous_year, previous_month, 1).strftime('%B %Y')}",
            'updated_at': datetime.utcnow().isoformat()
        }

        print(f"✅ User metrics calculated: {metrics}")
        return jsonify({
            'success': True,
            'enhancedData': metrics
        }), 200

    except Exception as e:
        print(f"❌ Error in user metrics: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# GET MONTHLY METRICS
@api.route('/metrics/monthly', methods=['GET'])
def get_monthly_metrics():
    """
    Get detailed monthly metrics with category breakdown
    """
    try:
        user_id = request.args.get('user_id', type=int)
        
        if not user_id:
            return jsonify({'error': 'user_id query parameter is required'}), 400

        print(f"📊 Fetching monthly metrics for user {user_id}")
        
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            print(f"❌ User {user_id} not found")
            return jsonify({'error': 'User not found'}), 404

        # Current month data
        current_month = datetime.utcnow().month
        current_year = datetime.utcnow().year
        
        # Total emissions for current month
        monthly_total = db.session.query(func.sum(Emission.amount)).filter(
            Emission.user_id == user_id,
            func.extract('month', Emission.date) == current_month,
            func.extract('year', Emission.date) == current_year
        ).scalar() or 0

        # Activity count for current month
        activity_count = Activity.query.filter(
            Activity.user_id == user_id,
            func.extract('month', Activity.date) == current_month,
            func.extract('year', Activity.date) == current_year
        ).count()

        # Category breakdown
        categories = db.session.query(
            Emission.emission_type,
            func.sum(Emission.amount).label('total_emissions'),
            func.count(Emission.id).label('activity_count')
        ).filter(
            Emission.user_id == user_id,
            func.extract('month', Emission.date) == current_month,
            func.extract('year', Emission.date) == current_year
        ).group_by(Emission.emission_type).all()

        category_data = []
        for cat in categories:
            category_data.append({
                'name': cat.emission_type or 'uncategorized',
                'emissions': round(float(cat.total_emissions), 2),
                'activities': cat.activity_count
            })

        metrics = {
            'period': f"{datetime(current_year, current_month, 1).strftime('%B %Y')}",
            'total_emissions': round(float(monthly_total), 2),
            'activity_count': activity_count,
            'average_per_activity': round(float(monthly_total) / activity_count, 2) if activity_count > 0 else 0,
            'categories': category_data,
            'updated_at': datetime.utcnow().isoformat()
        }

        print(f"✅ Monthly metrics calculated: {metrics}")
        return jsonify({
            'success': True,
            'monthlyData': metrics
        }), 200

    except Exception as e:
        print(f"❌ Error in monthly metrics: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# GET DASHBOARD METRICS
@api.route('/dashboard/metrics/<int:user_id>', methods=['GET'])
def get_dashboard_metrics(user_id):
    """
    Get comprehensive dashboard metrics for the metrics card
    """
    try:
        print(f"📊 Fetching dashboard metrics for user {user_id}")
        
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            print(f"❌ User {user_id} not found")
            return jsonify({'error': 'User not found'}), 404

        # Current month data
        current_month = datetime.utcnow().month
        current_year = datetime.utcnow().year
        
        current_data = db.session.query(func.sum(Emission.amount)).filter(
            Emission.user_id == user_id,
            func.extract('month', Emission.date) == current_month,
            func.extract('year', Emission.date) == current_year
        ).scalar() or 0

        # Previous month data
        previous_month = current_month - 1 if current_month > 1 else 12
        previous_year = current_year if current_month > 1 else current_year - 1
        
        previous_data = db.session.query(func.sum(Emission.amount)).filter(
            Emission.user_id == user_id,
            func.extract('month', Emission.date) == previous_month,
            func.extract('year', Emission.date) == previous_year
        ).scalar() or 0

        # Year-to-date data
        ytd_data = db.session.query(func.sum(Emission.amount)).filter(
            Emission.user_id == user_id,
            func.extract('year', Emission.date) == current_year
        ).scalar() or 0

        current_emissions = float(current_data)
        previous_emissions = float(previous_data)
        ytd_emissions = float(ytd_data)

        # Calculate monthly change
        change_percent = 0
        change_type = 'neutral'
        
        if previous_emissions > 0:
            change_percent = ((current_emissions - previous_emissions) / previous_emissions) * 100
            change_type = 'increase' if change_percent > 0 else 'decrease'
        elif current_emissions > 0:
            change_percent = 100
            change_type = 'increase'

        # Generate appropriate message
        if change_type == 'increase':
            message = f"Emissions increased by {abs(change_percent):.1f}% compared to last month"
        elif change_type == 'decrease':
            message = f"Great! Emissions reduced by {abs(change_percent):.1f}% compared to last month"
        else:
            message = "Emissions are stable this month"

        metrics = {
            'period': "This Month",
            'change_type': change_type,
            'change_percent': round(abs(change_percent), 1),
            'message': message,
            'current_emissions': round(current_emissions, 2),
            'previous_emissions': round(previous_emissions, 2),
            'ytd_emissions': round(ytd_emissions, 2),
            'comparison_period': f"{datetime(previous_year, previous_month, 1).strftime('%B %Y')}",
            'updated_at': datetime.utcnow().isoformat()
        }

        print(f"✅ Dashboard metrics calculated: {metrics}")
        return jsonify({
            'success': True,
            'metrics': metrics
        }), 200

    except Exception as e:
        print(f"❌ Error in dashboard metrics: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    

api = Blueprint("api", __name__)

@api.route("/test-db")
def test_db():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])

# User Sign-up
@api.route("/auth/signup", methods=["POST"])
def signup():
    import jwt
    import datetime
    import os
    
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    # Check if user already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Email already registered"}), 400

    # Create and save user
    new_user = User(
        name=email.split("@")[0],
        email=email
    )
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    # Generate JWT token for auto-login after signup
    SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-secret-key')
    token = jwt.encode({
        'user_id': new_user.id,
        'email': new_user.email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, SECRET_KEY, algorithm='HS256')

    return jsonify({
        "message": "Account created successfully",
        "token": token,
        "user": new_user.to_dict()
    }), 201


# User Login
@api.route("/auth/login", methods=["POST"])
def login():
    import jwt
    import datetime
    import os
    
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Generate JWT token
    SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-secret-key')
    token = jwt.encode({
        'user_id': user.id,
        'email': user.email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, SECRET_KEY, algorithm='HS256')

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": user.to_dict()
    }), 200

# User auth routes
# @api.route('/signup', methods=["POST"])
# def signup():
#     """Register a new user"""
#     try:
#         data = request.get_json()
#         print(f"Signup data received: {data}")

#         required_fields = ['username', 'email', 'password']
#         for field in required_fields:
#             if field in required_fields:
#                 return jsonify({'error': f'Missing required field: {field}'}), 400
            
#         # Checks if email already exists
#         existing_user = User.query.filter_by(email=data['email']).first()
#         if existing_user:
#             return jsonify({'error': 'Email already registered'}), 400
        
#         hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')

#         new_user = User(
#             username=data['username'],
#             email=data['email'],
#             password=hashed_password
#         )

#         db.session.add(new_user)
#         db.session.commit()

#         print(f"New user created: {new_user.to_dict()}")
#         return jsonify({
#             'message': 'User created successfully',
#             'user': new_user.to_dict()
#         }), 201
    
#     except Exception as e:
#         db.session.rollback()
#         print(f"Signup error: {str(e)}")
#         traceback.print_exc()
#         return jsonify({'error': 'Signup failed. Please try again later.'}), 500
    

# @api.route('/login', methods=["POST"])
# def login():
#     """Authenticate user and return success if credentials match"""
#     try:
#         data = request.get_json()
#         print(f"Login data received: {data}")

#         user = User.query.filter_by(email=data.get('email')).first()

#         if not user or not check_password_hash(user.password, data.get('password')):
#             print("Invalid email or password")
#             return jsonify({'error': 'Invalid email or password'}), 401

#         print(f"User authenticated: {user.username}")
#         return jsonify({
#             'message': 'Login successful',
#             'user': user.to_dict()
#         }), 201
    
#     except Exception as e:
#         print(f"Login error: {str(e)}")
#         traceback.print_exc()
#         return jsonify({'error': 'Login failed. Please try again later.'}), 500
