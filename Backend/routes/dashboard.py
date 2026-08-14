from flask import Blueprint, jsonify
from middleware.auth import token_required

bp = Blueprint('dashboard', __name__)

@bp.route('/dashboard', methods=['GET'])
@token_required
def dashboard():
    return jsonify({'total': 0}), 200
