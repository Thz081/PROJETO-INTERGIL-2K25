import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './style.css';
// Importa a logo padrão como fallback
import LogoPadrao from '../../assets/images/gameon-logo.png'; 
import { FaVolumeMute, FaVolumeUp, FaBars, FaTimes, FaUserAstronaut, FaUserTie, FaUserSecret } from 'react-icons/fa'; 
import { useAudio } from '../../context/AudioContext'; 
import { useAuth } from '../../context/AuthProvider'; 
import { useConfig } from '../../context/ConfigContext'; 

const Header = () => {
  const { isMuted, toggleMute, playClick } = useAudio();
  const { user } = useAuth(); 
  const { config } = useConfig(); 

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = () => {
    playClick();
    setIsMobileMenuOpen(false);
  }
  
  const handleToggleMobileMenu = () => {
    playClick();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  const handleToggleMute = () => {
    toggleMute();
  }

  // === FUNÇÃO CORRIGIDA PARA MONTAR A URL DA LOGO ===
  const getLogoUrl = () => {
    // 1. Se não tiver config ou logoUrl, usa a padrão do projeto
    if (!config || !config.logoUrl) return LogoPadrao;
    
    const url = config.logoUrl;

    // 2. Se for link externo (https://...), retorna direto
    if (url.startsWith('http')) return url;
    
    // 3. Se for caminho relativo (/uploads/...), precisamos adicionar o domínio do backend.
    // Tenta pegar do .env (REACT_APP_API_URL) ou chuta localhost:3001 (que vi no seu print)
    // ATENÇÃO: Se seu backend rodar em outra porta, mude aqui!
    const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001'; 
    
    // Garante que a url começa com /
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    
    // Remove 'public' se por acaso foi salvo errado no banco antigo
    const finalPath = cleanPath.replace('/public/', '/');

    return `${backendUrl}${finalPath}`;
  };

  const logoSrc = getLogoUrl();
  const siteName = config?.siteName || "INTERGIL 2K25";

  // === RENDERIZAÇÃO DOS BOTÕES (Igual ao seu) ===
  const renderAuthButton = (isMobile = false) => {
    const baseClass = "nav-link"; 
    const activeClass = "active";

    if (!user) {
      return (
        <NavLink 
            to="/login" 
            className={({isActive}) => isActive ? `${baseClass} login-btn ${activeClass}` : `${baseClass} login-btn`} 
            onClick={handleNavClick}
        >
          Login
        </NavLink>
      );
    }

    let linkDestino = "/meu-perfil";
    let Icone = FaUserAstronaut;

    if (user.role === 'gestao') {
        linkDestino = "/admin-dashboard"; 
        Icone = FaUserTie;
    } else if (user.role === 'monitor') {
        linkDestino = "/monitor-dashboard"; 
        Icone = FaUserSecret;
    }

    const primeiroNome = user.nome.split(' ')[0];

    return (
        <NavLink 
            to={linkDestino} 
            className={({isActive}) => isActive ? `${baseClass} profile-btn ${activeClass}` : `${baseClass} profile-btn`} 
            onClick={handleNavClick}
        >
            <Icone style={{ marginRight: '8px' }} />
            {primeiroNome}
        </NavLink>
    );
  };

  return (
    <header className="main-header">
      
      <Link to="/" className="logo-container" onClick={handleNavClick}>
        {/* LOGO DINÂMICA COM TRATAMENTO DE ERRO */}
        <img 
            src={logoSrc} 
            alt="Logo Site" 
            className="header-logo gameon-logo"
            onError={(e) => {
                // Se der erro ao carregar (ex: 404), volta para a logo padrão
                e.target.onerror = null; 
                e.target.src = LogoPadrao;
            }} 
        />
        <span className="header-title">{siteName}</span>
      </Link>
      
      <nav className="main-nav desktop-nav">
        <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={handleNavClick}>
          Home
        </NavLink>
        <NavLink to="/horarios" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={handleNavClick}>
          Horários
        </NavLink>
        <NavLink to="/momentos" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={handleNavClick}>
          Momentos
        </NavLink>
        <NavLink to="/historia" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={handleNavClick}>
          História
        </NavLink>
        
        <button onClick={handleToggleMute} className="nav-link mute-btn">
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>

        {renderAuthButton(false)}
      </nav>

      <button className="hamburger-btn" onClick={handleToggleMobileMenu}>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {isMobileMenuOpen && (
        <nav className="mobile-nav">
          <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={handleNavClick}>
            Home
          </NavLink>
          <NavLink to="/horarios" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={handleNavClick}>
            Horários
          </NavLink>
          <NavLink to="/momentos" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={handleNavClick}>
            Momentos
          </NavLink>
          <NavLink to="/historia" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={handleNavClick}>
            História
          </NavLink>
          
          {renderAuthButton(true)}

          <button onClick={handleToggleMute} className="nav-link mute-btn">
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            <span style={{marginLeft: '10px'}}>
              {isMuted ? 'Ativar Som' : 'Mutar Som'}
            </span>
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;