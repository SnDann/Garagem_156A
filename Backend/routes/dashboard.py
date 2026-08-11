from flask import Blueprint, jsonify

bp = Blueprint('dashboard', __name__)

@bp.route('/dashboard', methods=['GET'])
def dashboard():
    return jsonify({'total': 0}), 200
