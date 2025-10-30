from flask import Blueprint, jsonify, request
from backend.models import db, User, Goal, Emission
from datetime import datetime, timedelta
import traceback

goal_bp = Blueprint('goal_bp', __name__, url_prefix='/api/goals')


# GET ALL GOALS FOR A USER
@goal_bp.route('/<int:user_id>', methods=['GET'])
def get_user_goals(user_id):
    """
    Get all goals for a specific user with progress tracking
    """
    try:
        print(f"🎯 Fetching goals for user {user_id}")
        
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get all goals
        goals = Goal.query.filter_by(user_id=user_id).order_by(Goal.start_date.desc()).all()
        
        # Calculate progress for each goal
        goals_with_progress = []
        for goal in goals:
            progress_data = calculate_goal_progress(goal, user_id)
            goals_with_progress.append(progress_data)
        
        print(f"✅ Found {len(goals_with_progress)} goals")
        return jsonify(goals_with_progress), 200
        
    except Exception as e:
        print(f"❌ Error fetching goals: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# GET SINGLE GOAL
@goal_bp.route('/detail/<int:goal_id>', methods=['GET'])
def get_goal_detail(goal_id):
    """
    Get detailed information about a specific goal
    """
    try:
        print(f"🎯 Fetching goal {goal_id}")
        
        goal = Goal.query.get(goal_id)
        if not goal:
            return jsonify({'error': 'Goal not found'}), 404
        
        # Get progress data
        progress_data = calculate_goal_progress(goal, goal.user_id)
        
        print(f"✅ Goal details loaded")
        return jsonify(progress_data), 200
        
    except Exception as e:
        print(f"❌ Error fetching goal: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# CREATE NEW GOAL
@goal_bp.route('', methods=['POST'])
def create_goal():
    """
    Create a new goal
    Body: {
        user_id, title, target_reduction_percentage, end_date (optional)
    }
    """
    try:
        data = request.get_json()
        print(f"🎯 Creating new goal: {data.get('title', '')}")
        
        # Validate required fields
        required_fields = ['user_id', 'title', 'target_reduction_percentage']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        user_id = data['user_id']
        
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Parse end_date if provided
        end_date = None
        if 'end_date' in data and data['end_date']:
            try:
                end_date = datetime.fromisoformat(data['end_date'].replace('Z', '+00:00'))
            except:
                end_date = datetime.strptime(data['end_date'], '%Y-%m-%d')
        
        # Create new goal
        new_goal = Goal(
            user_id=user_id,
            title=data['title'],
            target_reduction_percentage=int(data['target_reduction_percentage']),
            end_date=end_date,
            status='active'
        )
        
        db.session.add(new_goal)
        db.session.commit()
        
        # Return goal with progress
        progress_data = calculate_goal_progress(new_goal, user_id)
        
        print(f"✅ Goal created: {new_goal.id}")
        return jsonify(progress_data), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error creating goal: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# UPDATE GOAL
@goal_bp.route('/<int:goal_id>', methods=['PUT'])
def update_goal(goal_id):
    """
    Update an existing goal
    Body: {
        title (optional), target_reduction_percentage (optional), 
        status (optional), end_date (optional)
    }
    """
    try:
        data = request.get_json()
        print(f"🎯 Updating goal {goal_id}")
        
        goal = Goal.query.get(goal_id)
        if not goal:
            return jsonify({'error': 'Goal not found'}), 404
        
        # Update fields if provided
        if 'title' in data:
            goal.title = data['title']
        
        if 'target_reduction_percentage' in data:
            goal.target_reduction_percentage = int(data['target_reduction_percentage'])
        
        if 'status' in data:
            goal.status = data['status']
        
        if 'end_date' in data:
            if data['end_date']:
                try:
                    goal.end_date = datetime.fromisoformat(data['end_date'].replace('Z', '+00:00'))
                except:
                    goal.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d')
            else:
                goal.end_date = None
        
        db.session.commit()
        
        # Return updated goal with progress
        progress_data = calculate_goal_progress(goal, goal.user_id)
        
        print(f"✅ Goal updated")
        return jsonify(progress_data), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error updating goal: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# DELETE GOAL
@goal_bp.route('/<int:goal_id>', methods=['DELETE'])
def delete_goal(goal_id):
    """
    Delete a goal
    """
    try:
        print(f"🎯 Deleting goal {goal_id}")
        
        goal = Goal.query.get(goal_id)
        if not goal:
            return jsonify({'error': 'Goal not found'}), 404
        
        db.session.delete(goal)
        db.session.commit()
        
        print(f"✅ Goal deleted")
        return jsonify({'message': 'Goal deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error deleting goal: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# GET GOAL STATISTICS
@goal_bp.route('/stats/<int:user_id>', methods=['GET'])
def get_goal_stats(user_id):
    """
    Get overall goal statistics for a user
    """
    try:
        print(f"📊 Fetching goal stats for user {user_id}")
        
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get all goals
        all_goals = Goal.query.filter_by(user_id=user_id).all()
        active_goals = [g for g in all_goals if g.status == 'active']
        completed_goals = [g for g in all_goals if g.status == 'completed']
        
        # Calculate average progress for active goals
        total_progress = 0
        goals_with_progress = 0
        
        for goal in active_goals:
            progress_data = calculate_goal_progress(goal, user_id)
            if progress_data['current_progress'] is not None:
                total_progress += progress_data['current_progress']
                goals_with_progress += 1
        
        avg_progress = total_progress / goals_with_progress if goals_with_progress > 0 else 0
        
        stats = {
            'total_goals': len(all_goals),
            'active_goals': len(active_goals),
            'completed_goals': len(completed_goals),
            'average_progress': round(avg_progress, 1),
            'on_track': sum(1 for g in active_goals if calculate_goal_progress(g, user_id)['on_track'])
        }
        
        print(f"✅ Goal stats calculated")
        return jsonify(stats), 200
        
    except Exception as e:
        print(f"❌ Error fetching goal stats: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# HELPER FUNCTION: Calculate goal progress
def calculate_goal_progress(goal, user_id):
    """
    Calculate progress for a goal based on emission data
    """
    try:
        # Get baseline emissions (before goal start date)
        baseline_emissions = db.session.query(db.func.sum(Emission.amount)).filter(
            Emission.user_id == user_id,
            Emission.date < goal.start_date
        ).scalar() or 0
        
        # Get time period for baseline (30 days before goal start)
        baseline_start = goal.start_date - timedelta(days=30)
        baseline_period_emissions = db.session.query(db.func.sum(Emission.amount)).filter(
            Emission.user_id == user_id,
            Emission.date >= baseline_start,
            Emission.date < goal.start_date
        ).scalar() or 0
        
        # Get current emissions (since goal start)
        current_emissions = db.session.query(db.func.sum(Emission.amount)).filter(
            Emission.user_id == user_id,
            Emission.date >= goal.start_date
        ).scalar() or 0
        
        # Calculate days since goal started
        days_since_start = (datetime.utcnow() - goal.start_date).days
        if days_since_start < 1:
            days_since_start = 1
        
        # Calculate daily averages
        baseline_daily_avg = baseline_period_emissions / 30 if baseline_period_emissions > 0 else 0
        current_daily_avg = current_emissions / days_since_start if current_emissions > 0 else 0
        
        # Calculate actual reduction percentage
        actual_reduction = 0
        if baseline_daily_avg > 0:
            actual_reduction = ((baseline_daily_avg - current_daily_avg) / baseline_daily_avg) * 100
        
        # Calculate progress towards goal
        target = goal.target_reduction_percentage
        current_progress = (actual_reduction / target * 100) if target > 0 else 0
        current_progress = min(current_progress, 100)  # Cap at 100%
        
        # Determine if on track
        if goal.end_date:
            total_days = (goal.end_date - goal.start_date).days
            elapsed_days = days_since_start
            expected_progress = (elapsed_days / total_days * 100) if total_days > 0 else 0
            on_track = current_progress >= expected_progress * 0.8  # 80% of expected
        else:
            on_track = actual_reduction >= target * 0.5  # At least 50% of target
        
        # Calculate days remaining
        days_remaining = None
        if goal.end_date:
            days_remaining = (goal.end_date - datetime.utcnow()).days
            if days_remaining < 0:
                days_remaining = 0
        
        return {
            'id': goal.id,
            'title': goal.title,
            'target_reduction_percentage': goal.target_reduction_percentage,
            'actual_reduction': round(actual_reduction, 1),
            'current_progress': round(current_progress, 1),
            'status': goal.status,
            'start_date': goal.start_date.isoformat(),
            'end_date': goal.end_date.isoformat() if goal.end_date else None,
            'days_remaining': days_remaining,
            'on_track': on_track,
            'baseline_daily_avg': round(baseline_daily_avg, 2),
            'current_daily_avg': round(current_daily_avg, 2),
            'days_active': days_since_start
        }
        
    except Exception as e:
        print(f"⚠️ Error calculating progress for goal {goal.id}: {str(e)}")
        return {
            'id': goal.id,
            'title': goal.title,
            'target_reduction_percentage': goal.target_reduction_percentage,
            'actual_reduction': 0,
            'current_progress': 0,
            'status': goal.status,
            'start_date': goal.start_date.isoformat(),
            'end_date': goal.end_date.isoformat() if goal.end_date else None,
            'days_remaining': None,
            'on_track': False,
            'baseline_daily_avg': 0,
            'current_daily_avg': 0,
            'days_active': 0
        }
