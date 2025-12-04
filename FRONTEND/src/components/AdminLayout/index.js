import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAudio } from '../../context/AudioContext';
import './style.css'; 
import { 
    FaUsers, 
    FaClipboardList, 
    FaSignOutAlt, 
    FaHistory, 
    FaHome, 
    FaListOl, 
    FaBars, 
    FaImages,
    FaGamepad,
    FaTrophy
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthProvider'; 

// RECEBE PROPS CHILDREN AGORA
const AdminLayout = ({ children }) => {
  const { playClick } = useAudio();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    playClick();
    logout();
    navigate('/');
  };

  const handleLinkClick = () => {
    playClick();
    setIsMenuOpen(false); 
  }

  return (
    <div className={`admin-wrapper ${isMenuOpen ? 'menu-open' : ''}`}>
      
      <button 
        className="admin-hamburger-btn" 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <FaBars />
      </button>

      <nav className="admin-sidebar">
        <h1 className="admin-sidebar-titulo">Gestão Intergil</h1>
        <ul className="admin-menu">
          
          <Link 
            to="/" 
            className="admin-menu-link"
            style={{ borderBottom: '1px dashed #444', marginBottom: '10px' }}
            onClick={handleLinkClick}
          >
            <FaHome /> Voltar para o Site
          </Link>
          
          <NavLink to="/admin-dashboard" onClick={handleLinkClick} className={({isActive}) => isActive ? "admin-menu-link active" : "admin-menu-link"} end>
            <FaClipboardList /> Visão Geral
          </NavLink>
          
          <NavLink to="/admin-salas" onClick={handleLinkClick} className={({isActive}) => isActive ? "admin-menu-link active" : "admin-menu-link"}>
            <FaUsers /> Gerenciar Salas
          </NavLink>

          <NavLink to="/admin-lista-inscricoes" onClick={handleLinkClick} className={({isActive}) => isActive ? "admin-menu-link active" : "admin-menu-link"}>
            <FaListOl /> Lista de Inscrições
          </NavLink>

          <NavLink to="/admin-dashboard/modalidades" onClick={handleLinkClick} className={({isActive}) => isActive ? "admin-menu-link active" : "admin-menu-link"}>
            <FaGamepad /> Modalidades
          </NavLink>

          <NavLink to="/admin-dashboard/hall" onClick={handleLinkClick} className={({isActive}) => isActive ? "admin-menu-link active" : "admin-menu-link"}>
            <FaTrophy /> Hall da Fama
          </NavLink>

          <NavLink to="/admin-momentos" onClick={handleLinkClick} className={({isActive}) => isActive ? "admin-menu-link active" : "admin-menu-link"}>
            <FaImages /> Gerenciar Momentos
          </NavLink>

          <NavLink to="/admin-log" onClick={handleLinkClick} className={({isActive}) => isActive ? "admin-menu-link active" : "admin-menu-link"}>
            <FaHistory /> Registro de Ações
          </NavLink>

        </ul>
        <div className="admin-logout-container">
          <button onClick={handleLogout} className="admin-logout-btn">
            <FaSignOutAlt /> Sair
          </button>
        </div>
      </nav>

      <main className="admin-content">
        {isMenuOpen && (
          <div 
            className="admin-content-overlay" 
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}

        {/* MÁGICA HÍBRIDA: Se tiver filho direto, renderiza. Se não, tenta o Outlet. */}
        {children ? children : <Outlet />}
      </main>
    </div>
  );
};

export default AdminLayout;