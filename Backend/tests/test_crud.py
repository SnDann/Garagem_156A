import importlib


def test_clientes_miniaturas_pedidos_endpoints():
    app_module = importlib.import_module('app')
    client = app_module.app.test_client()

    unique_email = f'ana+test+{__import__("time").time()}@email.com'

    create_client = client.post('/api/clientes', json={
        'nome': 'Ana',
        'email': unique_email,
        'telefone': '11999999999'
    })
    assert create_client.status_code == 201
    created_client = create_client.get_json()
    assert created_client['id'] > 0

    list_clients = client.get('/api/clientes')
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
    })
    assert create_miniatura.status_code == 201
    created_miniatura = create_miniatura.get_json()
    assert created_miniatura['id'] > 0

    list_miniaturas = client.get('/api/miniaturas')
    assert list_miniaturas.status_code == 200
    miniaturas = list_miniaturas.get_json()
    assert any(m['id'] == created_miniatura['id'] for m in miniaturas)

    payload = {
        'cliente_id': created_client['id'],
        'valor_total': 199.9,
        'forma_pagamento': 'PIX',
        'observacoes': 'Pedido de teste',
    }
    create_pedido = client.post('/api/pedidos', json=payload)
    assert create_pedido.status_code == 201
    pedido_data = create_pedido.get_json()
    assert pedido_data['cliente_id'] == created_client['id']
    assert pedido_data['valor_total'] == 199.9
    assert pedido_data['forma_pagamento'] == 'PIX'
    assert pedido_data['observacoes'] == 'Pedido de teste'

    list_pedidos = client.get('/api/pedidos')
    assert list_pedidos.status_code == 200
    pedidos = list_pedidos.get_json()
    assert any(p['id'] == pedido_data['id'] for p in pedidos)

