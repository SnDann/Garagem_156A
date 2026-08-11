from flask import Blueprint, jsonify, request
from models import SessionLocal, Usuario
from security import create_access_token, hash_password, verify_password

bp = Blueprint('auth', __name__)


@bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get('email') or data.get('username')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email e senha são obrigatórios'}), 400

    db = SessionLocal()
    try:
        user = db.query(Usuario).filter(Usuario.email == email).first()
        if not user or not user.is_active or not verify_password(password, user.password_hash):
            return jsonify({'error': 'Email ou senha inválidos'}), 401

        token = create_access_token({'sub': user.email, 'user_id': user.id})
        return jsonify({
            'message': 'Login realizado com sucesso',
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email,
                'nome': user.nome,
                'is_admin': user.is_admin,
            }
        }), 200
    finally:
        db.close()


@bp.route('/auth/register', methods=['POST'])
def register():
    payload = request.get_json(silent=True) or {}
    if not payload.get('nome') or not payload.get('email') or not payload.get('password'):
        return jsonify({'error': 'nome, email e senha são obrigatórios'}), 400

    db = SessionLocal()
    try:
        total_users = db.query(Usuario).count()
        if total_users > 0:
            return jsonify({'error': 'Criação de usuário desativada após o primeiro registro'}), 403

        if db.query(Usuario).filter(Usuario.email == payload['email']).first():
            return jsonify({'error': 'Email já cadastrado'}), 400

        user = Usuario(
            nome=payload['nome'],
            email=payload['email'],
            password_hash=hash_password(payload['password']),
            is_active=True,
            is_admin=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return jsonify({'id': user.id, 'email': user.email, 'nome': user.nome}), 201
    finally:
        db.close()
