// Arquivo: intergil-client/src/components/Leaderboard/index.js
// VERSÃO 2.1 - CORRIGIDO (Com o JSX correto para o seu CSS)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './style.css'; // O seu CSS que você me mandou
import { useAudio } from '../../context/AudioContext';
import { FaArrowRight } from 'react-icons/fa';
import api from '../../api';

const Leaderboard = () => {
  const { playClick } = useAudio();

  // A LÓGICA (useState, useEffect, fetchSalas) está 100% CORRETA.
  // Não mude nada aqui.
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSalas = async () => {
      try {
        setLoading(true);
        const response = await api.get('/ranking/salas');
        setSalas(response.data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar salas:", err);
        setError("Não foi possível carregar o ranking.");
      } finally {
        setLoading(false);
      }
    };
    fetchSalas();
  }, []); 


  // === Lógica de Renderização ===
  // (Aqui está o erro que o 'catch' pegou)
  if (error) {
    return (
      <div className="leaderboard-container">
        <h2 className="leaderboard-titulo">RANKING 2K25</h2>
        <p className="loading-text" style={{color: 'var(--neon-purple)'}}>
          {error}
        </p>
      </div>
    );
  }

  // (Mensagem de loading)
  if (loading) {
    return (
      <div className="leaderboard-container">
        <h2 className="leaderboard-titulo">RANKING 2K25</h2>
        <p className="loading-text">Carregando Ranking...</p>
      </div>
    );
  }

  // === AQUI ESTÁ A CORREÇÃO (v2.1) ===
  // Trocamos os <div>s por uma <Table> para bater com o seu CSS
  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-titulo">RANKING 2K25</h2>
      
      {/* Usando <table> com a classe que o seu CSS espera */}
      <table className="leaderboard-table">
        {/* Cabeçalho (opcional, mas bom ter) */}
        <thead>
          <tr>
            <th>Pos.</th>
            <th colSpan="2">Sala</th>
            <th style={{textAlign: 'right'}}>Pontuação</th>
          </tr>
        </thead>
        
        {/* Corpo da tabela com os dados da API */}
        <tbody>
          {salas.slice(0, 6).map((sala, index) => (
            <tr key={sala._id || index}>
              {/* Classe .posicao */}
              <td className="posicao">{index + 1}º</td>
              
              {/* Classe .logo-guilda */}
              <td className="logo-guilda">
                {/* O seu CSS espera o 'logo_url' aqui */}
              <img src={sala.logo_url} alt={sala.nome} className="sala-logo logo-sala" />
              </td>
              
              {/* Classe .nome-guilda */}
              <td className="nome-guilda">{sala.nome}</td>
              
              {/* Classe .pontuacao */}
              <td className="pontuacao">{sala.pontos} pts</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* O link para ver tudo (já estava certo) */}
      <Link to="/ranking" className="ver-todos" onClick={playClick}>
        Ver Ranking Completo <FaArrowRight />
      </Link>
    </div>
  );
};

export default Leaderboard;