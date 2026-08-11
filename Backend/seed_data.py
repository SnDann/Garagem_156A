import sys
import os
sys.path.append('Backend')

from models import SessionLocal, Base, engine, Cliente, Miniatura, Pedido, StatusCliente, StatusPedido

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Cliente).count() < 3:
            clientes = [
                Cliente(nome="Carlos Eduardo", email="carlos.eduardo@email.com", telefone="(11) 98765-4321", cpf="123.456.789-01", status=StatusCliente.VIP),
                Cliente(nome="Mariana Silva", email="mariana.silva@email.com", telefone="(21) 99876-5432", cpf="234.567.890-12", status=StatusCliente.ATIVO),
                Cliente(nome="Fernando Souza", email="fernando.souza@email.com", telefone="(31) 97654-3210", cpf="345.678.901-23", status=StatusCliente.ATIVO),
            ]
            db.add_all(clientes)
            db.commit()

        if db.query(Miniatura).count() < 3:
            miniaturas = [
                Miniatura(nome="Porsche 911 GT3 RS", marca="Minichamps", escala="1:18", cor="Laranja", categoria="Esportivos", preco_custo=350.0, preco_venda=590.0, quantidade=12),
                Miniatura(nome="Ferrari F40 1987", marca="Bburago", escala="1:24", cor="Vermelho", categoria="Superesportivos", preco_custo=120.0, preco_venda=220.0, quantidade=8),
                Miniatura(nome="Chevrolet Opala SS 1974", marca="California Toys", escala="1:43", cor="Amarelo", categoria="Nacionais", preco_custo=80.0, preco_venda=160.0, quantidade=15),
            ]
            db.add_all(miniaturas)
            db.commit()

        if db.query(Pedido).count() < 2:
            cli = db.query(Cliente).first()
            if cli:
                pedidos = [
                    Pedido(cliente_id=cli.id, status=StatusPedido.ENTREGUE, valor_total=590.0, forma_pagamento="PIX", observacoes="Entrega rápida efetuada"),
                    Pedido(cliente_id=cli.id, status=StatusPedido.EM_PREPARACAO, valor_total=380.0, forma_pagamento="Cartão de Crédito", observacoes="Aguardando embalagem especial"),
                ]
                db.add_all(pedidos)
                db.commit()
        print("Seed concluído com sucesso!")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
