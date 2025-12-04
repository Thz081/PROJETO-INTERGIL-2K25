// Arquivo: intergil-client/src/pages/Home/index.js
// VERSÃO 2.0 - COM LINK REAL DO EDITAL

import React from 'react';
import { useAudio } from '../../context/AudioContext';
import { FaDownload } from 'react-icons/fa';
import './style.css'; 
import Leaderboard from '../../components/Leaderboard';
import ModalidadesCarousel from '../../components/ModalidadesCarousel';
import api from '../../api'; // <--- 1. IMPORTAR A API

// 2. USA A URL BASE DA API PARA CRIAR O LINK DE DOWNLOAD
const LINK_EDITAL_GERAL = `${api.defaults.baseURL}/edital-geral`;

const Home = () => {
  const { playClick } = useAudio();

  return (
    <main>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--golden-yellow)', fontFamily: 'var(--font-title)' }}>
          GAME ON: JOGO VELHO E JOGO NOVO
        </h1>
      </div>

      <div className="edital-geral-container">
        <a 
          href={LINK_EDITAL_GERAL} 
          target="_blank" // Abre em nova aba (ou força download)
          rel="noopener noreferrer" 
          className="edital-geral-btn"
          onClick={playClick}
        >
          <FaDownload />
          Baixar Edital Geral 2K25
        </a>
      </div>

      <Leaderboard />
      <ModalidadesCarousel />
    </main>
  );
};

export default Home;