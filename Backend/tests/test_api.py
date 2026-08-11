import importlib


def test_app_imports():
    app_module = importlib.import_module('app')
    client = app_module.app.test_client()

    response = client.get('/health')
    assert response.status_code == 200
    assert response.get_json()['status'] == 'ok'
