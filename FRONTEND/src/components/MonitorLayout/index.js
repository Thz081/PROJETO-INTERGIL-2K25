import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAudio } from '../../context/AudioContext';
// Importa todos os ícones necessários
import { FaEye, FaClock, FaLink, FaSignOutAlt, FaHome, FaBars } from 'react-icons/fa'; 
import { useAuth } from '../../context/AuthProvider';
import './style.css'; 

const MonitorLayout = () => {
  const { playClick } = useAudio();
  const navigate = useNavigate();
  const { logout } = useAuth(); 
  
  // O State que controla o menu (Correto)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    playClick();
    logout(); 
    navigate('/');
  };

  // --- FUNÇÃO PARA FECHAR O MENU QUANDO CLICAR NUM LINK ---
  // (Senão o menu fica aberto no celular)
  const handleLinkClick = () => {
    playClick();
    setIsMenuOpen(false); // <--- Fecha o menu
  }

  return (
    // 1. O Wrapper ÚNICO
    <div className={`admin-wrapper ${isMenuOpen ? 'menu-open' : ''}`}>
      
      {/* 2. O BOTÃO HAMBÚRGUER */}
      <button 
        className="admin-hamburger-btn" 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <FaBars />
      </button>
      
      {/* 3. A BARRA LATERAL (Sidebar) */}
      <nav className="admin-sidebar">
        <h1 className="admin-sidebar-titulo">Monitor Intergil</h1>
        
        <ul className="admin-menu">

          {/* Botão: Voltar para o Site */}
          <Link 
            to="/" 
            className="admin-menu-link"
            style={{ borderBottom: '1px dashed #444', marginBottom: '10px' }}
            onClick={handleLinkClick} // <-- Usa a função de fechar
          >
            <FaHome /> Voltar para o Site
          </Link>
          
          {/* O resto dos links */}
          <NavLink 
            to="/monitor-dashboard" 
            className={({isActive}) => isActive ? "admin-menu-link active" : "admin-menu-link"}
            onClick={handleLinkClick} // <-- Usa a função de fechar
            end
          >
            <FaEye /> Visão Geral
          </NavLink>
          
          <NavLink 
            to="/monitor-horarios" 
            className={({isActive}) => isActive ? "admin-menu-link active" : "admin-menu-link"}
            onClick={handleLinkClick} // <-- Usa a função de fechar
          >
            <FaClock /> Gerenciar Horários
          </NavLink>

          <NavLink 
            to="/monitor-links" 
            className={({isActive}) => isActive ? "admin-menu-link active" : "admin-menu-link"}
            onClick={handleLinkClick} // <-- Usa a função de fechar
          >
            <FaLink /> Enviar Links (Editais)
          </NavLink>

        </ul>
        <div className="admin-logout-container">
          <button onClick={handleLogout} className="admin-logout-btn">
            <FaSignOutAlt /> Sair
          </button>
        </div>
      </nav>

      {/* 4. O CONTEÚDO PRINCIPAL */}
      <main className="admin-content">
        
        {/* O Overlay que fecha o menu ao clicar fora */}
        {isMenuOpen && (
          <div 
            className="admin-content-overlay" 
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}

        {/* Onde as páginas (Visão Geral, Horários, etc) vão carregar */}
        <Outlet /> 

      </main>
    </div> // <-- Fecha o wrapper único
  );
};

export default MonitorLayout;