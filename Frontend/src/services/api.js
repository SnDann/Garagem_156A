// Frontend/src/services/api.js

const DEFAULT_API_URL = 'http://localhost:5000';
const API_BASE_URL = (process.env.REACT_APP_API_URL || DEFAULT_API_URL).replace(/\/+$/, '');

// ============================================
// UTILITÁRIOS DE AUTENTICAÇÃO
// ============================================

function getStoredToken() {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem('token') || localStorage.getItem('authToken');
}

function setStoredToken(token) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('token', token);
  localStorage.setItem('authToken', token);
}

function clearStoredTokens() {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
}

// ============================================
// UTILITÁRIOS DE URL
// ============================================

function normalizeEndpoint(endpoint) {
  if (!endpoint) return '';
  if (/^https?:\/\//i.test(endpoint)) return endpoint;
  return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
}

function apiEndpoint(endpoint) {
  const normalized = normalizeEndpoint(endpoint);
  if (/^https?:\/\//i.test(normalized) || normalized.startsWith('/api/')) {
    return normalized;
  }
  return `/api${normalized}`;
}

function buildUrl(endpoint) {
  const normalized = normalizeEndpoint(endpoint);
  if (/^https?:\/\//i.test(normalized)) return normalized;
  return `${API_BASE_URL}${normalized}`;
}

// ============================================
// UTILITÁRIOS DE TRATAMENTO DE ERROS
// ============================================

function safeJsonError(data) {
  if (!data) return null;
  if (typeof data === 'string') return data;
  
  // Tenta diferentes campos de erro
  return data.error || 
         data.message || 
         data.detail || 
         data.msg || 
         data.errors || 
         null;
}

function getErrorMessage(error) {
  if (error.message) return error.message;
  if (typeof error === 'string') return error;
  return 'Ocorreu um erro inesperado';
}

// ============================================
// UTILITÁRIOS DE REQUISIÇÃO
// ============================================

function prepareBody(body) {
  if (body === undefined || body === null) return undefined;
  
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  if (typeof body === 'string' || isFormData) {
    return body;
  }
  
  return JSON.stringify(body);
}

function getHeaders(token, isFormData, customHeaders = {}) {
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };
  
  // Remove headers com valores undefined ou null
  Object.keys(headers).forEach(key => {
    if (headers[key] === undefined || headers[key] === null) {
      delete headers[key];
    }
  });
  
  return headers;
}

async function parseResponse(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// ============================================
// FUNÇÃO PRINCIPAL DE REQUISIÇÃO
// ============================================

export async function request(endpoint, options = {}) {
  const url = buildUrl(endpoint);
  const token = getStoredToken();
  const body = prepareBody(options.body);
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  // Timeout para a requisição (30 segundos)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 30000);

  let response;
  try {
    response = await fetch(url, {
      ...options,
      body,
      signal: controller.signal,
      headers: getHeaders(token, isFormData, options.headers),
    });
    clearTimeout(timeoutId);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('A requisição excedeu o tempo limite (30 segundos)');
    }
    throw new Error(
      `Falha ao conectar com a API (${url}). Verifique se o backend está rodando e se REACT_APP_API_URL está correto.`
    );
  }

  const data = await parseResponse(response);
  
  if (!response.ok) {
    // Token expirado ou inválido
    if (response.status === 401) {
      clearStoredTokens();
      // Redirecionar para login se estiver no browser
      if (typeof window !== 'undefined' && !options.skipRedirect) {
        window.location.href = '/login';
      }
    }
    
    const errorMsg = safeJsonError(data) ||
      `Erro na requisição (${response.status} ${response.statusText || ''})`.trim();
    throw new Error(errorMsg);
  }

  return data;
}

// ============================================
// WRAPPER COM RESPOSTA
// ============================================

async function requestWithResponse(endpoint, options = {}) {
  const data = await request(endpoint, options);
  return { data };
}

// ============================================
// API PRINCIPAL
// ============================================

const api = {
  get(endpoint, options = {}) {
    return requestWithResponse(apiEndpoint(endpoint), { ...options, method: 'GET' });
  },
  
  post(endpoint, data, options = {}) {
    return requestWithResponse(apiEndpoint(endpoint), {
      ...options,
      method: 'POST',
      body: data,
    });
  },
  
  put(endpoint, data, options = {}) {
    return requestWithResponse(apiEndpoint(endpoint), {
      ...options,
      method: 'PUT',
      body: data,
    });
  },
  
  patch(endpoint, data, options = {}) {
    return requestWithResponse(apiEndpoint(endpoint), {
      ...options,
      method: 'PATCH',
      body: data,
    });
  },
  
  delete(endpoint, options = {}) {
    return requestWithResponse(apiEndpoint(endpoint), { ...options, method: 'DELETE' });
  },
};

// ============================================
// FUNÇÕES DE AUTENTICAÇÃO
// ============================================

export function login(credentials) {
  return request('/api/auth/login', {
    method: 'POST',
    body: credentials,
  }).then(data => {
    const token = data.token || data.access_token;
    if (token) {
      setStoredToken(token);
    }
    return data;
  });
}

export function register(userData) {
  return request('/api/auth/register', {
    method: 'POST',
    body: userData,
  });
}

export function logout() {
  clearStoredTokens();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
  return Promise.resolve();
}

export function getCurrentUser() {
  return request('/api/auth/me', {
    method: 'GET',
  });
}

// ============================================
// FUNÇÕES DE CLIENTES
// ============================================

export function listClientes(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString ? `/api/clientes?${queryString}` : '/api/clientes';
  return request(endpoint);
}

export function getCliente(id) {
  return request(`/api/clientes/${id}`);
}

export function createCliente(payload) {
  return request('/api/clientes', {
    method: 'POST',
    body: payload,
  });
}

export function updateCliente(id, payload) {
  return request(`/api/clientes/${id}`, {
    method: 'PUT',
    body: payload,
  });
}

export function deleteCliente(id) {
  return request(`/api/clientes/${id}`, { method: 'DELETE' });
}

// ============================================
// FUNÇÕES DE MINIATURAS
// ============================================

export function listMiniaturas(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString ? `/api/miniaturas?${queryString}` : '/api/miniaturas';
  return request(endpoint);
}

export function getMiniatura(id) {
  return request(`/api/miniaturas/${id}`);
}

export function createMiniatura(payload) {
  return request('/api/miniaturas', {
    method: 'POST',
    body: payload,
  });
}

export function updateMiniatura(id, payload) {
  return request(`/api/miniaturas/${id}`, {
    method: 'PUT',
    body: payload,
  });
}

export function deleteMiniatura(id) {
  return request(`/api/miniaturas/${id}`, { method: 'DELETE' });
}

// ============================================
// FUNÇÕES DE PEDIDOS
// ============================================

export function listPedidos(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString ? `/api/pedidos?${queryString}` : '/api/pedidos';
  return request(endpoint);
}

export function getPedido(id) {
  return request(`/api/pedidos/${id}`);
}

export function createPedido(payload) {
  return request('/api/pedidos', {
    method: 'POST',
    body: payload,
  });
}

export function updatePedido(id, payload) {
  return request(`/api/pedidos/${id}`, {
    method: 'PUT',
    body: payload,
  });
}

export function deletePedido(id) {
  return request(`/api/pedidos/${id}`, { method: 'DELETE' });
}

// ============================================
// FUNÇÕES DE GASTOS
// ============================================

export function listGastos(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString ? `/api/gastos?${queryString}` : '/api/gastos';
  return request(endpoint);
}

export function getGasto(id) {
  return request(`/api/gastos/${id}`);
}

export function createGasto(payload) {
  return request('/api/gastos', {
    method: 'POST',
    body: payload,
  });
}

export function updateGasto(id, payload) {
  return request(`/api/gastos/${id}`, {
    method: 'PUT',
    body: payload,
  });
}

export function deleteGasto(id) {
  return request(`/api/gastos/${id}`, { method: 'DELETE' });
}

// ============================================
// FUNÇÕES DE RELATÓRIOS
// ============================================

export function getDashboardData() {
  return request('/api/dashboard');
}

export function getRelatorioVendas(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString ? `/api/relatorios/vendas?${queryString}` : '/api/relatorios/vendas';
  return request(endpoint);
}

export function getRelatorioEstoque() {
  return request('/api/relatorios/estoque');
}

// ============================================
// FUNÇÃO GENÉRICA PARA FETCH
// ============================================

export function fetchData(endpoint) {
  return request(endpoint);
}

// ============================================
// EXPORTAÇÃO PADRÃO
// ============================================

export default api;