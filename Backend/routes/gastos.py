from flask import Blueprint, jsonify, request
from database import get_db
from middleware.auth import token_required
from models import Gasto

bp = Blueprint('gastos', __name__)


@bp.route('/gastos', methods=['GET'])
@token_required
def listar_gastos():
    with get_db() as db:
        gastos = db.query(Gasto).all()
        return jsonify([{'id': g.id, 'descricao': g.descricao, 'valor': g.valor, 'categoria': g.categoria.value if g.categoria else 'Outros'} for g in gastos]), 200


@bp.route('/gastos', methods=['POST'])
@token_required
def criar_gasto():
    payload = request.get_json(silent=True) or {}
    if not payload.get('descricao') or not payload.get('valor'):
        return jsonify({'error': 'descricao e valor são obrigatórios'}), 400

    with get_db() as db:
        gasto = Gasto(
            descricao=payload['descricao'],
            valor=payload['valor'],
            categoria=payload.get('categoria', 'Outros'),
            data=payload.get('data')
        )
        db.add(gasto)
        db.commit()
        db.refresh(gasto)
        return jsonify({'id': gasto.id, 'descricao': gasto.descricao}), 201
