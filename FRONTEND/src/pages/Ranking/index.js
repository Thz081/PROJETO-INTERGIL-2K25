// Arquivo: intergil-client/src/pages/Ranking/index.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { FaArrowLeft } from 'react-icons/fa';
import { useAudio } from '../../context/AudioContext';
import './style.css'; // O CSS novo

const Ranking = () => {
  const { playClick } = useAudio();
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        setLoading(true);
        // A MESMA chamada da API
        const response = await api.get('/ranking/salas');
        // A API já manda ordenado, então não precisamos fazer nada
        setSalas(response.data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar ranking:", err);
        setError("Não foi possível carregar o ranking.");
      } finally {
        setLoading(false);
      }
    };
    fetchSalas();
  }, []);

  return (
    <div className="ranking-page-container">
      <div className="leaderboard-container"> {/* Reaproveitando o CSS */}
        <h2 className="leaderboard-titulo">RANKING GERAL</h2>
        
        {loading && <p className="loading-text">Carregando Ranking...</p>}
        {error && <p className="loading-text error">{error}</p>}
        
        {!loading && !error && (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Pos.</th>
                <th colSpan="2">Sala</th>
                <th></th>
                <th style={{ textAlign: 'right' }}>Pontuação</th>
              </tr>
            </thead>
            <tbody>
              {/* AQUI ESTÁ A MUDANÇA: Sem .slice(0, 6) */}
              {salas.map((sala, index) => (
                <tr key={sala._id || index}>
                  <td className="posicao">{index + 1}º</td>
                  <td className="logo-guilda">
                    <img src={sala.logo_url} alt={sala.nome} />
                  </td>
                  <td className="nome-guilda">{sala.nome}</td>
                  {/* Nova coluna de Turma */}
                  <td className="turma-guilda">{sala.serie_turma}</td>
                  <td className="pontuacao">{sala.pontos} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <Link to="/" className="ver-todos" onClick={playClick}>
          <FaArrowLeft /> Voltar para Home
        </Link>
      </div>
    </div>
  );
};

export default Ranking;