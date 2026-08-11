from flask import Blueprint, jsonify

bp = Blueprint('whatsapp', __name__)

@bp.route('/whatsapp/webhook', methods=['GET'])
def webhook():
    return jsonify({'status': 'ok'}), 200
