// Arquivo: intergil-client/src/pages/MonitorLinks/index.js
// VERSÃO 2.1 - FIX DA BOCHA (APARECE SEMPRE)

import React, { useState, useEffect } from 'react';
import { useAudio } from '../../context/AudioContext';
import { FaLink, } from 'react-icons/fa';
import api from '../../api';
import './style.css'; 

const MonitorLinks = () => {
  const { playClick } = useAudio();

  // Estados
  const [subsFlat, setSubsFlat] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Estados do Formulário
  const [selectedSub, setSelectedSub] = useState(''); 
  const [arquivoEdital, setArquivoEdital] = useState(null); 
  const [linkChaveamento, setLinkChaveamento] = useState(''); 

  const fetchModalidadesParaLinks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/monitor/modalidades-para-links');
      
      // === AQUI ESTAVA O PROBLEMA DA BOCHA ===
      // Antes: Se submodalidades fosse [], o .map não retornava nada.
      // Agora: Se estiver vazio, forçamos uma entrada "Geral".
      
      const flatList = response.data.flatMap(mod => {
        // Verifica se tem subcategorias E se não está vazio
        if (mod.submodalidades && mod.submodalidades.length > 0) {
           return mod.submodalidades.map(sub => ({
             // Suporta tanto string ("Futsal") quanto objeto ({nome: "Futsal"})
             value: `${mod._id}|${sub.nome || sub}`,
             label: `${mod.nome} - ${sub.nome || sub}`
           }));
        } else {
           // CASO DA BOCHA: Cria uma opção padrão se não tiver subcategorias
           return [{
             value: `${mod._id}|Geral`,
             label: `${mod.nome} - Geral/Única`
           }];
        }
      });
      
      setSubsFlat(flatList);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao buscar modalidades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModalidadesParaLinks();
  }, []);

  const handleFileChange = (e) => {
    setArquivoEdital(e.target.files[0]); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    playClick();
    setError(null);
    setSuccess(null);

    if (!selectedSub) {
      setError("Você precisa selecionar uma Modalidade/Sub primeiro.");
      return;
    }
    
    const [modId, subNome] = selectedSub.split('|');
    let acaoRealizada = false;

    // 1. UPLOAD DE EDITAL
    if (arquivoEdital) {
      try {
        const formData = new FormData();
        formData.append('modId', modId);
        formData.append('subNome', subNome);
        formData.append('edital', arquivoEdital); 

        setLoading(true);
        await api.post('/monitor/upload-edital', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        setSuccess('Arquivo de Edital enviado com sucesso!');
        setArquivoEdital(null); 
        acaoRealizada = true;
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao enviar o arquivo PDF.');
        setLoading(false);
        return; 
      }
    }

    // 2. SALVAR LINK
    if (linkChaveamento) {
      try {
        setLoading(true);
        await api.post('/monitor/links', {
          modId,
          subNome,
          tipoLink: 'chaveamento',
          url: linkChaveamento
        });

        setSuccess('Link de Chaveamento salvo com sucesso!');
        setLinkChaveamento(''); 
        acaoRealizada = true;
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao salvar o link.');
      }
    }
    
    setLoading(false);
    if (!acaoRealizada) {
      setError("Nenhuma ação para salvar. Anexe um arquivo ou insira um link.");
    }
  };

  return (
    <div className="monitor-horarios-container"> 
      
      <div className="admin-section">
        <h2><FaLink /> Enviar Links e Editais</h2>
        
        <form onSubmit={handleSubmit} className="admin-form-inline">
          
          {/* Dropdown "Achatado" com Bocha corrigida */}
          <div className="input-group" style={{minWidth: '300px', flex: '2'}}>
            <label>Modalidade/Sub</label>
            <select value={selectedSub} onChange={(e) => setSelectedSub(e.target.value)}>
              <option value="">-- Selecione a Categoria --</option>
              {subsFlat.map((sub, idx) => (
                <option key={`${sub.value}-${idx}`} value={sub.value}>{sub.label}</option>
              ))}
            </select>
          </div>
          
          <div className="input-group">
            <label>Arquivo do Edital (.pdf)</label>
            <input 
              type="file" 
              className="admin-file-input" 
              accept="application/pdf"
              onChange={handleFileChange}
              key={arquivoEdital ? 'file-loaded' : 'file-empty'}
            />
          </div>

          <div className="input-group" style={{minWidth: '300px', flex: '2'}}>
            <label>Link do Chaveamento (Google Docs)</label>
            <input 
              type="text" 
              placeholder="https://docs.google.com/..."
              value={linkChaveamento}
              onChange={(e) => setLinkChaveamento(e.target.value)}
            />
          </div>
          
          <button type="submit" className="admin-btn-submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
        
        {loading && <p style={{color: 'var(--neon-cyan)', marginTop: '15px'}}>Enviando dados...</p>}
        {error && <div className="admin-error">{error}</div>}
        {success && <div style={{color: '#55FF55', marginTop: '15px', fontWeight: 'bold'}}>{success}</div>}
      </div>

    </div>
  );
};

export default MonitorLinks;