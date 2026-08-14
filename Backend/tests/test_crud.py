import importlib
import os
import tempfile


def test_clientes_miniaturas_pedidos_endpoints():
    """Teste com banco de dados em memória e autenticação JWT"""
    db_fd, db_path = tempfile.mkstemp()
    
    try:
        app_module = importlib.import_module('app')
        
        # Configura app para usar banco em memória
        app_module.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app_module.app.config['TESTING'] = True
        
        client = app_module.app.test_client()
        
        # Cria as tabelas no banco de testes
        with app_module.app.app_context():
            from models import engine, Base
            Base.metadata.create_all(bind=engine)
        
        # Registra usuário de teste
        register_response = client.post('/api/auth/register', json={
            'nome': 'Test User',
            'email': 'test@test.com',
            'password': 'test123'
        })
        assert register_response.status_code == 201
        
        # Faz login
        login_response = client.post('/api/auth/login', json={
            'email': 'test@test.com',
            'password': 'test123'
        })
        assert login_response.status_code == 200
        token = login_response.get_json()['token']
        headers = {'Authorization': f'Bearer {token}'}
        
        # Testa endpoints autenticados
        unique_email = f'ana+test+{__import__("time").time()}@email.com'
        
        create_client = client.post('/api/clientes', json={
            'nome': 'Ana',
            'email': unique_email,
            'telefone': '11999999999'
        }, headers=headers)
        assert create_client.status_code == 201
        created_client = create_client.get_json()
        assert created_client['id'] > 0
        
        list_clients = client.get('/api/clientes', headers=headers)
        assert list_clients.status_code == 200
        clients = list_clients.get_json()
        assert any(c['email'] == unique_email for c in clients)
        
        create_miniatura = client.post('/api/miniaturas', json={
            'nome': 'Miniatura Teste',
            'marca': 'Marca X',
            'escala': '1:24',
            'preco_custo': 20.0,
            'preco_venda': 40.0,
            'quantidade': 2
        }, headers=headers)
        assert create_miniatura.status_code == 201
        created_miniatura = create_miniatura.get_json()
        assert created_miniatura['id'] > 0
        
        list_miniaturas = client.get('/api/miniaturas', headers=headers)
        assert list_miniaturas.status_code == 200
        miniaturas = list_miniaturas.get_json()
        assert any(m['id'] == created_miniatura['id'] for m in miniaturas)
        
        payload = {
            'cliente_id': created_client['id'],
            'valor_total': 199.9,
            'forma_pagamento': 'PIX',
            'observacoes': 'Pedido de teste',
        }
        create_pedido = client.post('/api/pedidos', json=payload, headers=headers)
        assert create_pedido.status_code == 201
        pedido_data = create_pedido.get_json()
        assert pedido_data['cliente_id'] == created_client['id']
        assert pedido_data['valor_total'] == 199.9
        assert pedido_data['forma_pagamento'] == 'PIX'
        assert pedido_data['observacoes'] == 'Pedido de teste'
        
        list_pedidos = client.get('/api/pedidos', headers=headers)
        assert list_pedidos.status_code == 200
        pedidos = list_pedidos.get_json()
        assert any(p['id'] == pedido_data['id'] for p in pedidos)
        
    finally:
        os.close(db_fd)
        os.unlink(db_path)

