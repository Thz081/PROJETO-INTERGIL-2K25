import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAudio } from '../../context/AudioContext';
import { useAuth } from '../../context/AuthProvider';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './style.css';

const LoginAdmin = () => {
  const { playClick } = useAudio();
  const { loginGestao, loading } = useAuth();

  const [nome, setNome] = useState(''); 
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    playClick();
    setErrorMessage(null); 

    if (!nome || !password) {
      setErrorMessage("Nome e senha são obrigatórios.");
      return;
    }

    try {
      await loginGestao(nome, password);
    } catch (error) {
      setErrorMessage(error || 'Nome ou senha inválidos.');
    }
  };

  return (
    <div className="login-page-wrapper"> 
      <div className="login-container">
        
        <h1 className="login-titulo">PORTAL DA GESTÃO</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          
          {errorMessage && (
            <div className="login-error"> 
              {errorMessage}
            </div>
          )}

          <div className="input-group">
            <label htmlFor="nome">Nome de Usuário</label> 
            <input
              type="text"
              id="nome"
              placeholder="Digite seu nome de usuário"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={loading} 
              autoComplete="username"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button 
                    type="button"
                    className="btn-eye"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
          </div>

          <button type="submit" className="login-btn-submit" disabled={loading}>
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>

        <div className="admin-links-container">
          <Link to="/login" onClick={playClick} className="admin-link">
            Voltar para Portal do Aluno
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;