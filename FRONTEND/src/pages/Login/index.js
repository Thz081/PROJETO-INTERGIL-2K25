import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { IMaskInput } from 'react-imask'; 
import { useAudio } from '../../context/AudioContext';
import { useAuth } from '../../context/AuthProvider';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import './style.css';

const Login = () => {
  const [numeroInscricao, setNumeroInscricao] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [localError, setLocalError] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { playClick } = useAudio(); 
  const { loginAluno, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    playClick();
    setLocalError('');

    try {
      await loginAluno(numeroInscricao, dataNascimento);
      navigate('/inscricao');
    } catch (msgErro) {
      setLocalError(msgErro);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <h1 className="login-titulo">PORTAL DO ALUNO</h1>
        <form onSubmit={handleSubmit} className="login-form">
          
          <div className="input-group">
            <label htmlFor="inscricao">Nº de Matrícula</label>
            <input 
              type="text" 
              id="inscricao"
              // === DICA DE OURO ===
              inputMode="numeric"
              pattern="[0-9]*"
              // ====================
              value={numeroInscricao}
              onChange={(e) => setNumeroInscricao(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          
          <div className="input-group password-group">
            <label htmlFor="dataNascimento">Data de Nascimento</label>
            
            <div style={{ position: 'relative' }}>
                <IMaskInput
                  mask="00/00/0000"
                  type={showPassword ? "text" : "password"} 
                  // === DICA DE OURO ===
                  inputMode="numeric" 
                  // ====================
                  id="dataNascimento"
                  placeholder="DD/MM/AAAA"
                  value={dataNascimento}
                  onAccept={(value) => setDataNascimento(value)}
                  required
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

          {localError && <p className="login-error">{localError}</p>}

          <button type="submit" className="login-btn-submit" disabled={loading}>
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>

        <div className="admin-links-container">
          <Link to="/login-monitor" className="admin-link" onClick={playClick}>
            Sou Monitor
          </Link>
          <Link to="/login-admin" className="admin-link" onClick={playClick}>
            Sou Gestão
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default Login;