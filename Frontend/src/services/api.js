const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function safeJsonError(data) {
  if (!data) return null;
  if (typeof data === 'string') return data;
  return data.error || data.message || null;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');

  let response;
  try {
    response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch (err) {
    throw new Error(
      `Falha ao conectar com a API (${url}). Backend pode não estar rodando ou API_BASE_URL está incorreto.`
    );
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = safeJsonError(data) || `Erro na requisição (${response.status} ${response.statusText || ''})`.trim();
    throw new Error(errorMsg);
  }

  return data;
}

export function fetchData(endpoint) {
  return request(endpoint);
}

export function createCliente(payload) {
  return request('/api/clientes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateCliente(id, payload) {
  return request(`/api/clientes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteCliente(id) {
  return request(`/api/clientes/${id}`, { method: 'DELETE' });
}

export function listClientes() {
  return fetchData('/api/clientes');
}

export function createMiniatura(payload) {
  return request('/api/miniaturas', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateMiniatura(id, payload) {
  return request(`/api/miniaturas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteMiniatura(id) {
  return request(`/api/miniaturas/${id}`, { method: 'DELETE' });
}

export function listMiniaturas() {
  return fetchData('/api/miniaturas');
}

export function createPedido(payload) {
  return request('/api/pedidos', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updatePedido(id, payload) {
  return request(`/api/pedidos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deletePedido(id) {
  return request(`/api/pedidos/${id}`, { method: 'DELETE' });
}

export function listPedidos() {
  return fetchData('/api/pedidos');
}

export function listGastos() {
  return fetchData('/api/gastos');
}

