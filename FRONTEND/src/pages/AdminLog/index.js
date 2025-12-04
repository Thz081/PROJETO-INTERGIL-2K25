// Arquivo: intergil-client/src/pages/AdminLog/index.js
// VERSÃO 2.0 - "DES-HACKEADO"

import React, { useState, useEffect } from 'react';
import api from '../../api'; // A nossa API
import './style.css'; // O CSS que acabamos de criar
import { FaHistory } from 'react-icons/fa';

// Funçãozinha para deixar a data bonita (pt-BR)
const formatarData = (isoString) => {
  if (!isoString) return 'Data inválida';
  try {
    const data = new Date(isoString);
    const dia = data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const hora = data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${dia} às ${hora}`;
  } catch (e) {
    return 'Data inválida';
  }
};

const AdminLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar os logs da API
  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // CHAMA A ROTA QUE JÁ CRIAMOS ONTEM: GET /api/admin/logs
      // (O token de admin já vai automático)
      const response = await api.get('/admin/logs');
      
      setLogs(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar os registros.");
    } finally {
      setLoading(false);
    }
  };

  // Roda UMA VEZ ao carregar
  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    // Reusando as classes do AdminLayout/style.css
    <div className="admin-content-inner" style={{padding: '30px'}}>
      
      {/* Título (reusando o estilo do AdminSalas) */}
      <div className="admin-section">
        <h2 style={{borderBottom: '1px dashed var(--text-secondary)', paddingBottom: '15px'}}>
          <FaHistory /> Registro de Ações
        </h2>
      </div>

      {/* O Card que vai conter a lista */}
      <div className="admin-card">
        <h3>Últimas 100 Ações</h3>
        
        {loading && <p>Carregando registros do banco de dados...</p>}
        {error && <p className="admin-error">{error}</p>}
        
        {!loading && !error && (
          <ul className="log-list">
            {logs.length === 0 ? (
              <li className="log-item" style={{color: 'var(--text-secondary)'}}>
                Nenhum registro encontrado. (Tente adicionar pontos a uma sala para gerar um log!)
              </li>
            ) : (
              // O Loop que mostra os logs
              logs.map((log) => (
                <li key={log._id} className="log-item">
                  <span className="log-timestamp">{formatarData(log.timestamp)}</span>
                  <span className="log-autor">{log.autor}</span>
                  <span className="log-acao">{log.acao}</span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminLog;