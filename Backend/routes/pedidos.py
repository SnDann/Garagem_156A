from contextlib import contextmanager
from flask import Blueprint, jsonify, request
from models import Pedido, SessionLocal

bp = Blueprint('pedidos', __name__)


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


def _serialize_pedido(pedido):
    return {
        'id': pedido.id,
        'cliente_id': pedido.cliente_id,
        'data_pedido': pedido.data_pedido.isoformat() if pedido.data_pedido else None,
        'status': pedido.status.value if pedido.status else 'pendente',
        'valor_total': pedido.valor_total,
        'forma_pagamento': pedido.forma_pagamento,
        'codigo_rastreio': pedido.codigo_rastreio,
        'status_entrega': pedido.status_entrega,
        'observacoes': pedido.observacoes,
    }


@bp.route('/pedidos', methods=['GET'])
def listar_pedidos():
    with get_db() as db:
        pedidos = db.query(Pedido).all()
        return jsonify([_serialize_pedido(p) for p in pedidos]), 200


@bp.route('/pedidos/<int:pedido_id>', methods=['GET'])
def obter_pedido(pedido_id):
    with get_db() as db:
        pedido = db.query(Pedido).filter(Pedido.id == pedido_id).first()
        if not pedido:
            return jsonify({'error': 'pedido não encontrado'}), 404
        return jsonify(_serialize_pedido(pedido)), 200


@bp.route('/pedidos', methods=['POST'])
def criar_pedido():
    payload = request.get_json(silent=True) or {}
    if not payload.get('cliente_id'):
        return jsonify({'error': 'cliente_id é obrigatório'}), 400

    with get_db() as db:
        pedido = Pedido(
            cliente_id=payload['cliente_id'],
            forma_pagamento=payload.get('forma_pagamento'),
            observacoes=payload.get('observacoes'),
            valor_total=payload.get('valor_total', 0.0),
            codigo_rastreio=payload.get('codigo_rastreio'),
            status_entrega=payload.get('status_entrega')
        )
        db.add(pedido)
        db.commit()
        db.refresh(pedido)
        return jsonify(_serialize_pedido(pedido)), 201


@bp.route('/pedidos/<int:pedido_id>', methods=['PUT'])
def atualizar_pedido(pedido_id):
    payload = request.get_json(silent=True) or {}
    with get_db() as db:
        pedido = db.query(Pedido).filter(Pedido.id == pedido_id).first()
        if not pedido:
            return jsonify({'error': 'pedido não encontrado'}), 404

        for field in ['cliente_id', 'status', 'valor_total', 'forma_pagamento', 'codigo_rastreio', 'status_entrega', 'observacoes']:
            if field in payload:
                setattr(pedido, field, payload[field])

        db.commit()
        return jsonify(_serialize_pedido(pedido)), 200


@bp.route('/pedidos/<int:pedido_id>', methods=['DELETE'])
def deletar_pedido(pedido_id):
    with get_db() as db:
        pedido = db.query(Pedido).filter(Pedido.id == pedido_id).first()
        if not pedido:
            return jsonify({'error': 'pedido não encontrado'}), 404
        db.delete(pedido)
        db.commit()
        return jsonify({'message': 'pedido removido'}), 200
