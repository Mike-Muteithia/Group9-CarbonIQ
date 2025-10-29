from flask import Blueprint, request, jsonify

asset_bp = Blueprint("asset", __name__)

@asset_bp.route("/example", methods=["GET"])
def example_asset():
    return jsonify({"message": "Asset route is working"})
