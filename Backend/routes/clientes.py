from contextlib import contextmanager
from flask import Blueprint, jsonify, request
from models import Cliente, SessionLocal

bp = Blueprint('clientes', __name__)


@contextmanager
def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


@bp.route('/clientes', methods=['GET'])
def listar_clientes():
    with get_db() as db:
        clientes = db.query(Cliente).all()
        return jsonify([{
            'id': c.id,
            'nome': c.nome,
            'email': c.email,
            'telefone': c.telefone,
            'status': c.status.value if c.status else 'ativo'
        } for c in clientes]), 200


@bp.route('/clientes', methods=['POST'])
def criar_cliente():
    payload = request.get_json(silent=True) or {}
    if not payload.get('nome') or not payload.get('email') or not payload.get('telefone'):
        return jsonify({'error': 'nome, email e telefone são obrigatórios'}), 400

    with get_db() as db:
        cliente = Cliente(
            nome=payload['nome'],
            email=payload['email'],
            telefone=payload['telefone'],
            cpf=payload.get('cpf'),
            endereco=payload.get('endereco'),
            cidade=payload.get('cidade'),
            estado=payload.get('estado'),
            cep=payload.get('cep')
        )
        db.add(cliente)
        db.commit()
        db.refresh(cliente)
        return jsonify({'id': cliente.id, 'nome': cliente.nome, 'email': cliente.email}), 201


@bp.route('/clientes/<int:cliente_id>', methods=['GET'])
def obter_cliente(cliente_id):
    with get_db() as db:
        cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
        if not cliente:
            return jsonify({'error': 'cliente não encontrado'}), 404
        return jsonify({
            'id': cliente.id,
            'nome': cliente.nome,
            'email': cliente.email,
            'telefone': cliente.telefone,
            'status': cliente.status.value if cliente.status else 'ativo'
        }), 200


@bp.route('/clientes/<int:cliente_id>', methods=['PUT'])
def atualizar_cliente(cliente_id):
    payload = request.get_json(silent=True) or {}
    with get_db() as db:
        cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
        if not cliente:
            return jsonify({'error': 'cliente não encontrado'}), 404
        for field in ['nome', 'email', 'telefone', 'cpf', 'endereco', 'cidade', 'estado', 'cep']:
            if field in payload:
                setattr(cliente, field, payload[field])
        db.commit()
        return jsonify({'id': cliente.id, 'nome': cliente.nome}), 200


@bp.route('/clientes/<int:cliente_id>', methods=['DELETE'])
def deletar_cliente(cliente_id):
    with get_db() as db:
        cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
        if not cliente:
            return jsonify({'error': 'cliente não encontrado'}), 404
        db.delete(cliente)
        db.commit()
        return jsonify({'message': 'cliente removido'}), 200
