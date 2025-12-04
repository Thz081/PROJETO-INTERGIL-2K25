// Arquivo: intergil-client/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('intergil_user'));
    } catch (e) {
      return null;
    }
  });
  
  const [token, setToken] = useState(localStorage.getItem('intergil_token'));
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); // Adicionei state de erro global se precisar
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  // === LOGIN ALUNO (NOVO) ===
  const loginAluno = async (n_inscricao, data_nascimento) => {
    setLoading(true);
    setError(null);
    try {
      // Nota: A rota no backend deve ser /auth/login-aluno
      // Mudei para enviar 'n_inscricao' para bater com o controller
      const response = await api.post('/auth/login', { 
        n_inscricao, 
        data_nascimento 
      });

      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('intergil_token', newToken);
      localStorage.setItem('intergil_user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);

      // A LINHA DA VITÓRIA
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return true; // Retorna sucesso
    } catch (err) {
      console.error("Erro Login Aluno:", err);
      const msg = err.response?.data?.message || 'Falha ao entrar.';
      setError(msg);
      throw msg; // Joga o erro pro componente pegar
    } finally {
      setLoading(false);
    }
  };

  // === LOGIN GESTÃO ===
  const loginGestao = async (nome, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login-gestao', {
        nome: nome,
        senha: password, 
      });

      const { token: newToken, user: newUser } = response.data;
      localStorage.setItem('intergil_token', newToken);
      localStorage.setItem('intergil_user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);

      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      navigate('/admin-dashboard');
      
    } catch (error) {
      console.error('Falha no login da Gestão:', error);
      throw error.response?.data?.message || 'Erro desconhecido';
    } finally {
      setLoading(false);
    }
  };

  // === LOGIN MONITOR ===
  const loginMonitor = async (matricula, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login-monitor', {
        matricula: matricula,
        senha: password,
      });

      const { token: newToken, user: newUser } = response.data;
      localStorage.setItem('intergil_token', newToken);
      localStorage.setItem('intergil_user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);

      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      navigate('/monitor-dashboard');
      
    } catch (error) {
      console.error('Falha no login do Monitor:', error);
      throw error.response?.data?.message || 'Erro desconhecido';
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('intergil_token');
    localStorage.removeItem('intergil_user');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    navigate('/');
  };

  const value = {
    user,
    token,
    loading,
    error,
    loginAluno, // EXPORTADO AQUI
    loginGestao,
    loginMonitor,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};