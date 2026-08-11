from flask import Blueprint, jsonify, request
from models import Miniatura, SessionLocal

bp = Blueprint('miniaturas', __name__)


def _session():
    return SessionLocal()


@bp.route('/miniaturas', methods=['GET'])
def listar_miniaturas():
    db = _session()
    try:
        miniaturas = db.query(Miniatura).all()
        return jsonify([{
            'id': m.id,
            'nome': m.nome,
            'marca': m.marca,
            'escala': m.escala,
            'cor': m.cor,
            'categoria': m.categoria,
            'preco_venda': m.preco_venda,
            'quantidade': m.quantidade,
            'ativo': m.ativo
        } for m in miniaturas]), 200
    finally:
        db.close()


@bp.route('/miniaturas', methods=['POST'])
def criar_miniatura():
    payload = request.get_json(silent=True) or {}
    required = ['nome', 'marca', 'escala', 'preco_custo', 'preco_venda', 'quantidade']
    if not all(field in payload for field in required):
        return jsonify({'error': 'campos obrigatórios ausentes'}), 400

    db = _session()
    try:
        miniatura = Miniatura(
            nome=payload['nome'],
            marca=payload['marca'],
            escala=payload['escala'],
            cor=payload.get('cor', ''),
            categoria=payload.get('categoria', 'Outros'),
            preco_custo=payload['preco_custo'],
            preco_venda=payload['preco_venda'],
            quantidade=payload['quantidade'],
            codigo_barras=payload.get('codigo_barras'),
            descricao=payload.get('descricao'),
            foto_url=payload.get('foto_url'),
            ativo=payload.get('ativo', True)
        )
        db.add(miniatura)
        db.commit()
        db.refresh(miniatura)
        return jsonify({'id': miniatura.id, 'nome': miniatura.nome}), 201
    finally:
        db.close()


@bp.route('/miniaturas/<int:miniatura_id>', methods=['PUT'])
def atualizar_miniatura(miniatura_id):
    payload = request.get_json(silent=True) or {}
    db = _session()
    try:
        miniatura = db.query(Miniatura).filter(Miniatura.id == miniatura_id).first()
        if not miniatura:
            return jsonify({'error': 'miniatura não encontrada'}), 404
        for field in ['nome', 'marca', 'escala', 'cor', 'categoria', 'preco_custo', 'preco_venda', 'quantidade', 'codigo_barras', 'descricao', 'foto_url', 'ativo']:
            if field in payload:
                setattr(miniatura, field, payload[field])
        db.commit()
        return jsonify({'id': miniatura.id, 'nome': miniatura.nome}), 200
    finally:
        db.close()


@bp.route('/miniaturas/<int:miniatura_id>', methods=['DELETE'])
def deletar_miniatura(miniatura_id):
    db = _session()
    try:
        miniatura = db.query(Miniatura).filter(Miniatura.id == miniatura_id).first()
        if not miniatura:
            return jsonify({'error': 'miniatura não encontrada'}), 404
        db.delete(miniatura)
        db.commit()
        return jsonify({'message': 'miniatura removida'}), 200
    finally:
        db.close()
