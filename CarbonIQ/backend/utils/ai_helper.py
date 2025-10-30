"""
AI Helper Utility
Provides AI-powered sustainability coaching and insights using OpenAI API
"""

import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

# Try to import OpenAI client
try:
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    openai_available = True
except ImportError:
    openai_available = False
    client = None
    print("⚠️ OpenAI library not available. AI features will use fallback responses.")


class AIEcoCoach:
    """AI-powered sustainability coach"""
    
    # Fallback responses when OpenAI is not available
    FALLBACK_RESPONSES = {
        'general': [
            "Every small action counts! Start by tracking your daily activities to identify your biggest emission sources.",
            "Consider switching to renewable energy sources or using public transportation to reduce your carbon footprint.",
            "Reducing meat consumption, especially beef, can significantly lower your environmental impact.",
            "Try carpooling or working from home one day a week to cut down on transportation emissions.",
            "Energy-efficient appliances and LED bulbs can help reduce your electricity consumption."
        ],
        'transport': [
            "Consider using public transportation, cycling, or walking for short trips.",
            "If you need a car, electric or hybrid vehicles produce significantly less emissions than traditional cars.",
            "Carpooling with colleagues can cut your commute emissions in half or more.",
            "Plan your trips efficiently to minimize unnecessary driving."
        ],
        'energy': [
            "Switch to LED bulbs - they use 75% less energy than traditional bulbs.",
            "Unplug devices when not in use to avoid phantom energy consumption.",
            "Consider installing solar panels if feasible in your area.",
            "Use a programmable thermostat to optimize heating and cooling."
        ],
        'food': [
            "Reducing beef consumption can have a huge impact - try plant-based alternatives.",
            "Buy local and seasonal produce to reduce transportation emissions.",
            "Reduce food waste by planning meals and storing food properly.",
            "Consider starting a compost bin for food scraps."
        ],
        'achievements': [
            "Great progress! You're making a real difference for the planet.",
            "Keep up the excellent work! Every kg of CO₂ saved matters.",
            "You're on the right track! Consistency is key to reducing your carbon footprint.",
            "Impressive commitment to sustainability! Share your journey to inspire others."
        ]
    }
    
    @staticmethod
    def get_personalized_insight(user_data, emissions_data, activities_data):
        """
        Generate personalized sustainability insight based on user data
        
        Args:
            user_data: User profile information
            emissions_data: Recent emissions data
            activities_data: Recent activities data
        
        Returns:
            dict: {
                'insight': str,
                'category': str,
                'action_items': list,
                'timestamp': str
            }
        """
        if not openai_available or not client:
            return AIEcoCoach._get_fallback_insight(emissions_data, activities_data)
        
        try:
            # Prepare context for AI
            context = AIEcoCoach._prepare_context(user_data, emissions_data, activities_data)
            
            prompt = f"""You are an expert sustainability coach. Based on the user's carbon footprint data, provide a personalized, actionable insight.

User Data:
{context}

Provide a response in the following format:
1. A brief, encouraging observation about their emissions pattern (2-3 sentences)
2. One specific, actionable recommendation to reduce emissions
3. Expected impact of this action

Keep the tone friendly, encouraging, and specific. Focus on the biggest emission source."""

            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a friendly, knowledgeable sustainability coach helping users reduce their carbon footprint."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=200,
                temperature=0.7
            )
            
            insight_text = response.choices[0].message.content.strip()
            
            # Determine category based on emissions data
            category = AIEcoCoach._determine_top_category(emissions_data)
            
            return {
                'insight': insight_text,
                'category': category,
                'timestamp': datetime.utcnow().isoformat(),
                'source': 'ai'
            }
            
        except Exception as e:
            print(f"⚠️ AI insight generation error: {e}")
            return AIEcoCoach._get_fallback_insight(emissions_data, activities_data)
    
    @staticmethod
    def chat_with_coach(message, conversation_history, user_context):
        """
        Chat with AI coach
        
        Args:
            message: User's message
            conversation_history: Previous messages in conversation
            user_context: User's emission and activity data
        
        Returns:
            dict: {
                'response': str,
                'timestamp': str
            }
        """
        if not openai_available or not client:
            return AIEcoCoach._get_fallback_chat_response(message)
        
        try:
            # Build conversation messages
            messages = [
                {
                    "role": "system",
                    "content": f"""You are EcoCoach, a friendly AI sustainability advisor. Help users reduce their carbon footprint with practical, personalized advice.

User Context:
{user_context}

Guidelines:
- Be encouraging and positive
- Provide specific, actionable advice
- Reference their actual data when relevant
- Keep responses concise (2-3 paragraphs max)
- Use emojis sparingly for friendliness"""
                }
            ]
            
            # Add conversation history (last 5 messages)
            for msg in conversation_history[-5:]:
                messages.append({
                    "role": msg.get('role', 'user'),
                    "content": msg.get('content', '')
                })
            
            # Add current message
            messages.append({
                "role": "user",
                "content": message
            })
            
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=300,
                temperature=0.8
            )
            
            response_text = response.choices[0].message.content.strip()
            
            return {
                'response': response_text,
                'timestamp': datetime.utcnow().isoformat(),
                'source': 'ai'
            }
            
        except Exception as e:
            print(f"⚠️ AI chat error: {e}")
            return AIEcoCoach._get_fallback_chat_response(message)
    
    @staticmethod
    def get_reduction_tips(category='general', current_emissions=0):
        """
        Get specific tips for reducing emissions in a category
        
        Args:
            category: Category to get tips for (transport, energy, food, waste)
            current_emissions: Current emission level
        
        Returns:
            list: List of actionable tips
        """
        if not openai_available or not client:
            return AIEcoCoach.FALLBACK_RESPONSES.get(category, AIEcoCoach.FALLBACK_RESPONSES['general'])[:3]
        
        try:
            prompt = f"""Provide 3 specific, actionable tips to reduce carbon emissions in the {category} category.
Current emissions: {current_emissions} kg CO₂

Format each tip as:
- [Tip]: [Expected impact]

Keep tips practical and achievable."""

            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a sustainability expert providing practical emission reduction tips."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=200,
                temperature=0.7
            )
            
            tips_text = response.choices[0].message.content.strip()
            tips = [tip.strip() for tip in tips_text.split('\n') if tip.strip() and tip.strip().startswith('-')]
            
            return tips[:3] if tips else AIEcoCoach.FALLBACK_RESPONSES.get(category, AIEcoCoach.FALLBACK_RESPONSES['general'])[:3]
            
        except Exception as e:
            print(f"⚠️ AI tips generation error: {e}")
            return AIEcoCoach.FALLBACK_RESPONSES.get(category, AIEcoCoach.FALLBACK_RESPONSES['general'])[:3]
    
    @staticmethod
    def _prepare_context(user_data, emissions_data, activities_data):
        """Prepare context string for AI"""
        context_parts = []
        
        # Emissions summary
        if emissions_data:
            total = sum(e.get('amount', 0) for e in emissions_data)
            context_parts.append(f"Total recent emissions: {total:.2f} kg CO₂")
            
            # Group by category
            by_category = {}
            for e in emissions_data:
                cat = e.get('emission_type', 'other')
                by_category[cat] = by_category.get(cat, 0) + e.get('amount', 0)
            
            if by_category:
                sorted_cats = sorted(by_category.items(), key=lambda x: x[1], reverse=True)
                context_parts.append(f"Top emission source: {sorted_cats[0][0]} ({sorted_cats[0][1]:.2f} kg CO₂)")
        
        # Activities summary
        if activities_data:
            context_parts.append(f"Recent activities logged: {len(activities_data)}")
        
        return "\n".join(context_parts) if context_parts else "No recent data available"
    
    @staticmethod
    def _determine_top_category(emissions_data):
        """Determine the category with highest emissions"""
        if not emissions_data:
            return 'general'
        
        by_category = {}
        for e in emissions_data:
            cat = e.get('emission_type', 'other')
            by_category[cat] = by_category.get(cat, 0) + e.get('amount', 0)
        
        if not by_category:
            return 'general'
        
        return max(by_category.items(), key=lambda x: x[1])[0]
    
    @staticmethod
    def _get_fallback_insight(emissions_data, activities_data):
        """Get fallback insight when AI is not available"""
        import random
        
        category = AIEcoCoach._determine_top_category(emissions_data) if emissions_data else 'general'
        responses = AIEcoCoach.FALLBACK_RESPONSES.get(category, AIEcoCoach.FALLBACK_RESPONSES['general'])
        
        return {
            'insight': random.choice(responses),
            'category': category,
            'timestamp': datetime.utcnow().isoformat(),
            'source': 'fallback'
        }
    
    @staticmethod
    def _get_fallback_chat_response(message):
        """Get fallback chat response when AI is not available"""
        import random
        
        message_lower = message.lower()
        
        # Simple keyword matching for fallback
        if any(word in message_lower for word in ['transport', 'car', 'drive', 'commute']):
            responses = AIEcoCoach.FALLBACK_RESPONSES['transport']
        elif any(word in message_lower for word in ['energy', 'electricity', 'power', 'heating']):
            responses = AIEcoCoach.FALLBACK_RESPONSES['energy']
        elif any(word in message_lower for word in ['food', 'eat', 'diet', 'meat']):
            responses = AIEcoCoach.FALLBACK_RESPONSES['food']
        elif any(word in message_lower for word in ['help', 'how', 'what', 'reduce']):
            responses = AIEcoCoach.FALLBACK_RESPONSES['general']
        else:
            responses = AIEcoCoach.FALLBACK_RESPONSES['general']
        
        return {
            'response': random.choice(responses),
            'timestamp': datetime.utcnow().isoformat(),
            'source': 'fallback'
        }


# Convenience functions
def get_daily_tip():
    """Get a random daily sustainability tip"""
    import random
    all_tips = []
    for tips in AIEcoCoach.FALLBACK_RESPONSES.values():
        all_tips.extend(tips)
    return random.choice(all_tips)


def analyze_emission_trend(emissions_history):
    """Analyze emission trend and provide insight"""
    if not emissions_history or len(emissions_history) < 2:
        return "Keep logging your activities to track your progress!"
    
    recent = sum(e.get('amount', 0) for e in emissions_history[:7])
    older = sum(e.get('amount', 0) for e in emissions_history[7:14])
    
    if older == 0:
        return "Great start! Continue tracking to see your progress over time."
    
    change = ((recent - older) / older) * 100
    
    if change < -10:
        return f"Excellent! Your emissions decreased by {abs(change):.1f}% this week. Keep up the great work! 🌱"
    elif change > 10:
        return f"Your emissions increased by {change:.1f}% this week. Let's work on bringing that down with some targeted actions."
    else:
        return "Your emissions are stable. Let's find opportunities to reduce them further!"
