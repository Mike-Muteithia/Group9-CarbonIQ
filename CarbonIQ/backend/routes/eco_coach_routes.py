from flask import Blueprint, request, jsonify
import openai

eco_coach_bp = Blueprint("eco_coach_bp", __name__)

# Make sure your OpenAI API key is set
openai.api_key = "your-openai-api-key"

@eco_coach_bp.route("/", methods=["POST"])
def generate_tip():
    data = request.get_json()
    user_input = data.get("prompt")

    if not user_input:
        return jsonify({"error": "Missing prompt"}), 400

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an eco-coach helping users reduce carbon emissions."},
                {"role": "user", "content": user_input}
            ],
            max_tokens=150
        )
        tip = response.choices[0].message["content"]
        return jsonify({"tip": tip})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
