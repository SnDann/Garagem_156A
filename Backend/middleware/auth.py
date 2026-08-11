from functools import wraps
from flask import request, jsonify
import jwt
from config import settings


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Token ausente'}), 401

        token = auth_header.split(" ")[1] if auth_header.startswith("Bearer ") else auth_header

        try:
            data = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            request.current_user = data
        except jwt.PyJWTError:
            return jsonify({'error': 'Token inválido'}), 401

        return f(*args, **kwargs)
    return decorated
