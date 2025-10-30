from flask import Blueprint, jsonify, request
from backend.models import db, Asset, User
import traceback

asset_bp = Blueprint('asset_bp', __name__)

# GET ALL ASSETS
@asset_bp.route('/<int:user_id>', methods=['GET'])
def get_assets(user_id):
    """
    Get all assets for a user (for My Assets page)
    Returns: [{ id, name, type, fuel_type, model, year, emoji, carbon_impact, status }, ...]
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
@asset_bp.route('', methods=['POST'])
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
                error_msg = f"Missing required field: {field}"
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
            fuel_type=data.get('fuel_type', ''),
            model=data.get('model', ''),
            year=data.get('year', ''),
            emoji=data.get('emoji', '📝'),
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
@asset_bp.route('/<int:asset_id>', methods=['PUT'])
def update_asset(asset_id):
    """
    Update an existing asset
    Body: { name, type, fuel_type, model, year, emoji }
    """
    try:
        asset = Asset.query.get(asset_id)
        
        if not asset:
            print(f"❌ Asset {asset_id} not found")
            return jsonify({'error': 'Asset not found'}), 404
        
        data = request.get_json()
        print(f"📝 Updating asset {asset_id}: {data}")
        
        # Update fields if provided
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
        if 'carbon_impact' in data:
            asset.carbon_impact = data['carbon_impact']
        
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
@asset_bp.route('/<int:asset_id>', methods=['DELETE'])
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
@asset_bp.route('/single/<int:asset_id>', methods=['GET'])
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
