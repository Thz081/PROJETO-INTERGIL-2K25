// Arquivo: src/components/ProtectedRoute/index.js
import React from 'react';
import { useAuth } from '../../context/AuthProvider'; // Use o nome que você renomeou
import { Navigate, Outlet } from 'react-router-dom';

/*
  Este componente faz 3 coisas:
  1. Pega o 'user' do cofre (useAuth).
  2. Se o user EXISTIR, ele libera a passagem (renderiza o <Outlet />).
  3. Se o user NÃO EXISTIR, ele chuta o cara pro /login (<Navigate to="/login" />).
*/

const ProtectedRoute = ({ role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Se estiver checando o login (carregando), mostra uma tela em branco
    // para não piscar o /login antes da hora.
    return null; 
  }

  // Se não estiver carregando E NÃO tiver usuário, manda pro Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se exigirmos um cargo (ex: 'aluno') e o user não tiver esse cargo
  if (role && user.role !== role) {
    // Manda pra home (ou pra uma página de "Acesso Negado")
    return <Navigate to="/" replace />;
  }

  // Se chegou até aqui, o user existe (e tem o cargo certo, se exigido).
  // Libera a passagem!
  return <Outlet />;
};

export default ProtectedRoute;