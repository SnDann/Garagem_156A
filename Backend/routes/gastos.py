from flask import Blueprint, jsonify, request
from models import Gasto, SessionLocal

bp = Blueprint('gastos', __name__)


@bp.route('/gastos', methods=['GET'])
def listar_gastos():
    db = SessionLocal()
    try:
        gastos = db.query(Gasto).all()
        return jsonify([{'id': g.id, 'descricao': g.descricao, 'valor': g.valor, 'categoria': g.categoria.value if g.categoria else 'Outros'} for g in gastos]), 200
    finally:
        db.close()


@bp.route('/gastos', methods=['POST'])
def criar_gasto():
    payload = request.get_json(silent=True) or {}
    if not payload.get('descricao') or not payload.get('valor'):
        return jsonify({'error': 'descricao e valor são obrigatórios'}), 400

    db = SessionLocal()
    try:
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
    finally:
        db.close()
