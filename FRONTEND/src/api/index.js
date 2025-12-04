import axios from 'axios';

// === 1. CONFIGURAÇÃO DO ENDEREÇO (IP) ===
// Se existir uma variável de ambiente (no servidor), usa ela.
// Se não, usa o seu localhost na porta 3001 (Backend).
// IMPORTANTE: Mantivemos o /api no final para facilitar.
const BASE_URL = process.env.REACT_APP_API_URL || 'http://http://localhost:3001/api';

const api = axios.create({
  baseURL: BASE_URL,
});

// === 2. CONFIGURAÇÃO DO TOKEN (SEGURANÇA) ===
api.interceptors.request.use((config) => {
  // TENTA PEGAR O TOKEN DOS DOIS JEITOS (BLINDAGEM)
  // Se o seu login salvou como 'token', ele pega.
  // Se salvou como 'intergil_token', ele pega também.
  const token = localStorage.getItem('token') || localStorage.getItem('intergil_token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;