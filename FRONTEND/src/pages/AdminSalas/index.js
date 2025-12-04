// Arquivo: intergil-client/src/pages/AdminSalas/index.js
// VERSÃO 3.3 - 100% ALINHADO COM 'turma'

import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus, FaMinus, FaInstagram } from 'react-icons/fa';
import { useAudio } from '../../context/AudioContext';
import api from '../../api';
import './style.css';

const AdminSalas = () => {
  const { playClick } = useAudio(); 
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nomeSala, setNomeSala] = useState('');
  const [turmaSala, setTurmaSala] = useState(''); // <-- USA 'turma'
  const [logoSala, setLogoSala] = useState('');
  const [instagramSala, setInstagramSala] = useState('');
  const [pontosInput, setPontosInput] = useState({});

  const fetchSalas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/salas');
      setSalas(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao buscar salas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalas();
  }, []);

  const handleUpdatePontos = async (salaId, pontos) => {
    playClick();
    const pontosNum = parseInt(pontos, 10);
    if (isNaN(pontosNum) || pontosNum === 0) {
      setError('Por favor, digite um número de pontos válido (Ex: 100 ou -50).');
      return;
    }
    const acao = pontosNum > 0 ? 'ADICIONAR' : 'REMOVER';
    if (!window.confirm(`Tem certeza que quer ${acao} ${Math.abs(pontosNum)} pontos desta sala?`)) {
      return;
    }
    try {
      setError(null);
      await api.put('/admin/pontos', {
        salaId: salaId,
        pontos: pontosNum
      });
      fetchSalas();
      setPontosInput(prev => ({ ...prev, [salaId]: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar pontos');
    }
  };
  
  // --- CRIAR SALA (CORRIGIDO) ---
  const handleCreateSala = async (e) => {
    e.preventDefault();
    playClick();
    if (!nomeSala || !turmaSala) { // <-- USA 'turma'
      setError('Nome e Turma são obrigatórios para criar uma sala.');
      return;
    }
    try {
      setError(null);
      await api.post('/admin/salas', {
        nome: nomeSala,
        turma: turmaSala, // <-- USA 'turma'
        logo_url: logoSala || '/images/sala_padrao.png',
        instagram: instagramSala || '#'
      });
      fetchSalas();
      setNomeSala('');
      setTurmaSala('');
      setLogoSala('');
      setInstagramSala('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar sala');
    }
  };

  const handleDeleteSala = async (salaId, salaNome) => {
    // ... (função delete está ok) ...
    playClick();
    if (!window.confirm(`TEM CERTEZA QUE QUER APAGAR A SALA "${salaNome}"?`)) {
      return;
    }
    try {
      setError(null);
      await api.delete(`/admin/salas/${salaId}`);
      fetchSalas();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao apagar sala');
    }
  };

  const handleEditSala = (sala) => {
    playClick();
    alert("Função 'Editar' ainda em construção!");
  };
  
  const handlePontosInputChange = (salaId, valor) => {
    // ... (função pontos está ok) ...
    if (valor === '' || valor === '-' || !isNaN(parseInt(valor, 10))) {
        setPontosInput(prev => ({ ...prev, [salaId]: valor }));
    }
  };

  return (
    <div className="admin-salas-container">
      <div className="admin-section">
        <h2>Adicionar Nova Sala</h2>
        <form onSubmit={handleCreateSala} className="admin-form-inline">
          <div className="input-group">
            <label>Nome da Sala</label>
            <input 
              type="text" 
              placeholder="Ex: Spartta" 
              value={nomeSala}
              onChange={(e) => setNomeSala(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Série/Turma</label> {/* O label pode ser "Série/Turma" */}
            <input 
              type="text" 
              placeholder="Ex: 1° A ADM" // <-- USA O '°' (grau)
              value={turmaSala}
              onChange={(e) => setTurmaSala(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Caminho da Logo</label>
            <input 
              type="text" 
              placeholder="Ex: images/sala 1.png" // <-- SEM A BARRA NO COMEÇO
              value={logoSala}
              onChange={(e) => setLogoSala(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Instagram (Opcional)</label>
            <input 
              type="text" 
              placeholder="Link do perfil"
              value={instagramSala}
              onChange={(e) => setInstagramSala(e.target.value)}
            />
          </div>
          <button type="submit" className="admin-btn-submit">
            <FaPlus /> Adicionar
          </button>
        </form>
        {error && <div className="admin-error">{error}</div>}
      </div>

      <div className="admin-section">
        <h2>Salas Cadastradas ({salas.length})</h2>
        {loading && <p>Carregando...</p>}
        <div className="admin-tabela-container">
          <table className="admin-tabela">
            <thead>
              <tr>
                <th>Logo</th>
                <th>Nome</th>
                <th>Turma</th>
                <th>Insta</th>
                <th>Pontos</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {salas.map((sala) => {
                const pontosAtuais = pontosInput[sala._id] || '';
                return (
                  <tr key={sala._id}>
                    <td>
                      {/* AQUI A GENTE CHAMA A LOGO COM A FUNÇÃO DE SEGURANÇA */}
                      <img 
                        src={sala.logo_url.startsWith('/') ? sala.logo_url : `/${sala.logo_url}`} 
                        alt={sala.nome} 
                        className="tabela-logo" 
                      />
                    </td>
                    <td><strong>{sala.nome}</strong></td>
                    <td>{sala.turma}</td> {/* <-- EXIBE O CAMPO 'turma' */}
                    <td className="tabela-insta-icon">
                      {sala.instagram && sala.instagram !== '#' ? (
                        <a href={sala.instagram} target="_blank" rel="noopener noreferrer">
                          <FaInstagram />
                        </a>
                      ) : ( <span>-</span> )}
                    </td>
                    <td style={{ color: 'var(--neon-cyan)', fontWeight: 'bold' }}>
                      {sala.pontos}
                    </td>
                    <td>
                      <div className="tabela-acoes-pontos">
                        <input 
                          type="text"
                          className="admin-pontos-input"
                          placeholder="Pts"
                          value={pontosAtuais}
                          onChange={(e) => handlePontosInputChange(sala._id, e.target.value)}
                        />
                        <button 
                          onClick={() => handleUpdatePontos(sala._id, pontosAtuais)} 
                          className="admin-btn-tabela add" 
                          title="Adicionar Pontos"
                        >
                          <FaPlus />
                        </button>
                        <button 
                          onClick={() => handleUpdatePontos(sala._id, -pontosAtuais)} 
                          className="admin-btn-tabela remove" 
                          title="Remover Pontos"
                        >
                          <FaMinus />
                        </button>
                        <span style={{color: 'var(--text-secondary)', margin: '0 5px'}}>|</span>
                        <button onClick={() => handleEditSala(sala)} className="admin-btn-tabela edit" title="Editar Sala">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDeleteSala(sala._id, sala.nome)} className="admin-btn-tabela delete" title="Apagar Sala">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSalas;