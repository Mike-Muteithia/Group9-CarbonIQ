from flask import Blueprint, jsonify, request
from models import db, User, Emission, Activity
from utils.ai_helper import AIEcoCoach, get_daily_tip, analyze_emission_trend
from datetime import datetime, timedelta
import traceback

ai_bp = Blueprint('ai_bp', __name__, url_prefix='/api/ai')


# GET PERSONALIZED INSIGHT
@ai_bp.route('/insight/<int:user_id>', methods=['GET'])
def get_personalized_insight(user_id):
    """
    Get personalized AI insight based on user's emission data
    """
    try:
        print(f"🤖 Generating AI insight for user {user_id}")
        
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            print(f"❌ User {user_id} not found")
            return jsonify({'error': 'User not found'}), 404
        
        # Get recent emissions (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        emissions = Emission.query.filter(
            Emission.user_id == user_id,
            Emission.date >= thirty_days_ago
        ).order_by(Emission.date.desc()).all()
        
        emissions_data = [
            {
                'amount': e.amount,
                'emission_type': e.emission_type,
                'source': e.source,
                'date': e.date.isoformat()
            }
            for e in emissions
        ]
        
        # Get recent activities
        activities = Activity.query.filter(
            Activity.user_id == user_id,
            Activity.date >= thirty_days_ago
        ).order_by(Activity.date.desc()).all()
        
        activities_data = [
            {
                'title': a.title,
                'amount': a.amount,
                'badge': a.badge,
                'date': a.date.isoformat()
            }
            for a in activities
        ]
        
        # Get user data
        user_data = {
            'username': user.name,  # User model has 'name' not 'username'
            'email': user.email
        }
        
        # Generate insight
        insight = AIEcoCoach.get_personalized_insight(
            user_data,
            emissions_data,
            activities_data
        )
        
        print(f"✅ AI insight generated: {insight['source']}")
        return jsonify(insight), 200
        
    except Exception as e:
        print(f"❌ Error generating insight: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# CHAT WITH AI COACH
@ai_bp.route('/chat', methods=['POST'])
def chat_with_coach():
    """
    Chat with AI coach
    Body: {
        user_id, message, conversation_history (optional)
    }
    """
    try:
        data = request.get_json()
        print(f"💬 AI chat request: {data.get('message', '')[:50]}...")
        
        # Validate required fields
        if 'user_id' not in data or 'message' not in data:
            return jsonify({'error': 'Missing required fields: user_id, message'}), 400
        
        user_id = data['user_id']
        message = data['message']
        conversation_history = data.get('conversation_history', [])
        
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get user context (recent emissions and activities)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        
        emissions = Emission.query.filter(
            Emission.user_id == user_id,
            Emission.date >= thirty_days_ago
        ).all()
        
        activities = Activity.query.filter(
            Activity.user_id == user_id,
            Activity.date >= thirty_days_ago
        ).all()
        
        # Prepare context
        total_emissions = sum(e.amount for e in emissions)
        activity_count = len(activities)
        
        user_context = f"""User: {user.name}
Total emissions (last 30 days): {total_emissions:.2f} kg CO₂
Activities logged: {activity_count}"""
        
        # Get AI response
        response = AIEcoCoach.chat_with_coach(
            message,
            conversation_history,
            user_context
        )
        
        print(f"✅ AI response generated: {response['source']}")
        return jsonify(response), 200
        
    except Exception as e:
        print(f"❌ Error in AI chat: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# GET REDUCTION TIPS
@ai_bp.route('/tips', methods=['GET'])
def get_reduction_tips():
    """
    Get reduction tips for a specific category
    Query params: category, user_id (optional)
    """
    try:
        category = request.args.get('category', 'general')
        user_id = request.args.get('user_id', type=int)
        
        print(f"💡 Getting reduction tips for category: {category}")
        
        current_emissions = 0
        
        # If user_id provided, get their current emissions in that category
        if user_id:
            thirty_days_ago = datetime.utcnow() - timedelta(days=30)
            emissions = Emission.query.filter(
                Emission.user_id == user_id,
                Emission.emission_type == category,
                Emission.date >= thirty_days_ago
            ).all()
            current_emissions = sum(e.amount for e in emissions)
        
        # Get tips
        tips = AIEcoCoach.get_reduction_tips(category, current_emissions)
        
        print(f"✅ Generated {len(tips)} tips")
        return jsonify({
            'category': category,
            'tips': tips,
            'current_emissions': current_emissions
        }), 200
        
    except Exception as e:
        print(f"❌ Error getting tips: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# GET DAILY TIP
@ai_bp.route('/daily-tip', methods=['GET'])
def get_daily_sustainability_tip():
    """
    Get a random daily sustainability tip
    """
    try:
        print("📅 Getting daily tip")
        tip = get_daily_tip()
        
        return jsonify({
            'tip': tip,
            'date': datetime.utcnow().date().isoformat()
        }), 200
        
    except Exception as e:
        print(f"❌ Error getting daily tip: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ANALYZE EMISSION TREND
@ai_bp.route('/analyze-trend/<int:user_id>', methods=['GET'])
def analyze_trend(user_id):
    """
    Analyze user's emission trend and provide insight
    """
    try:
        print(f"📈 Analyzing emission trend for user {user_id}")
        
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get emissions history (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        emissions = Emission.query.filter(
            Emission.user_id == user_id,
            Emission.date >= thirty_days_ago
        ).order_by(Emission.date.desc()).all()
        
        emissions_history = [
            {
                'amount': e.amount,
                'date': e.date.isoformat()
            }
            for e in emissions
        ]
        
        # Analyze trend
        insight = analyze_emission_trend(emissions_history)
        
        # Calculate weekly averages
        recent_week = [e for e in emissions if e.date >= datetime.utcnow() - timedelta(days=7)]
        previous_week = [e for e in emissions if datetime.utcnow() - timedelta(days=14) <= e.date < datetime.utcnow() - timedelta(days=7)]
        
        recent_avg = sum(e.amount for e in recent_week) / 7 if recent_week else 0
        previous_avg = sum(e.amount for e in previous_week) / 7 if previous_week else 0
        
        change_percent = 0
        if previous_avg > 0:
            change_percent = ((recent_avg - previous_avg) / previous_avg) * 100
        
        print(f"✅ Trend analysis complete")
        return jsonify({
            'insight': insight,
            'recent_week_avg': round(recent_avg, 2),
            'previous_week_avg': round(previous_avg, 2),
            'change_percent': round(change_percent, 2),
            'trend': 'decreasing' if change_percent < -5 else 'increasing' if change_percent > 5 else 'stable'
        }), 200
        
    except Exception as e:
        print(f"❌ Error analyzing trend: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
