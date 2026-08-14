from flask import Blueprint, jsonify, request
from database import get_db
from middleware.auth import token_required
from models import Miniatura

bp = Blueprint('miniaturas', __name__)


@bp.route('/miniaturas', methods=['GET'])
@token_required
def listar_miniaturas():
    with get_db() as db:
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


@bp.route('/miniaturas', methods=['POST'])
@token_required
def criar_miniatura():
    payload = request.get_json(silent=True) or {}
    required = ['nome', 'marca', 'escala', 'preco_custo', 'preco_venda', 'quantidade']
    if not all(field in payload for field in required):
        return jsonify({'error': 'campos obrigatórios ausentes'}), 400

    with get_db() as db:
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


@bp.route('/miniaturas/<int:miniatura_id>', methods=['PUT'])
@token_required
def atualizar_miniatura(miniatura_id):
    payload = request.get_json(silent=True) or {}
    with get_db() as db:
        miniatura = db.query(Miniatura).filter(Miniatura.id == miniatura_id).first()
        if not miniatura:
            return jsonify({'error': 'miniatura não encontrada'}), 404
        for field in ['nome', 'marca', 'escala', 'cor', 'categoria', 'preco_custo', 'preco_venda', 'quantidade', 'codigo_barras', 'descricao', 'foto_url', 'ativo']:
            if field in payload:
                setattr(miniatura, field, payload[field])
        db.commit()
        return jsonify({'id': miniatura.id, 'nome': miniatura.nome}), 200


@bp.route('/miniaturas/<int:miniatura_id>', methods=['DELETE'])
@token_required
def deletar_miniatura(miniatura_id):
    with get_db() as db:
        miniatura = db.query(Miniatura).filter(Miniatura.id == miniatura_id).first()
        if not miniatura:
            return jsonify({'error': 'miniatura não encontrada'}), 404
        db.delete(miniatura)
        db.commit()
        return jsonify({'message': 'miniatura removida'}), 200
