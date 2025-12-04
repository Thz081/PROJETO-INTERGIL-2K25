import React, { useState, useEffect } from 'react';
import api from '../../api';
import { FaUpload, FaCheckCircle, FaExclamationTriangle, FaCog, FaSave, FaImage } from 'react-icons/fa';
import './style.css'; 
// Importe o hook do contexto de configuração
import { useConfig } from '../../context/ConfigContext';

// === CARD 1: UPLOAD EDITAL GERAL ===
const UploadEditalCard = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setFeedback({ type: '', message: '' });
    } else {
      setFile(null);
      setFeedback({ type: 'error', message: 'Selecione um arquivo .pdf' });
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('editalGeral', file);

    try {
      await api.post('/admin/upload-edital-geral', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFeedback({ type: 'success', message: 'Edital Geral atualizado!' });
      setFile(null); 
      // Limpar o input file visualmente é chato no React sem ref, mas ok por enquanto
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Erro ao enviar arquivo.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card upload-card">
      <h3><FaUpload /> Atualizar Edital Geral</h3>
      <p>Envie o arquivo <strong>EDITAL_GERAL_2K25.pdf</strong> para atualizar o botão da Home.</p>
      <div className="upload-input-wrapper">
        <label htmlFor="edital-geral-input" className="upload-label">
          {file ? file.name : 'Escolher arquivo .pdf'}
        </label>
        <input type="file" id="edital-geral-input" accept=".pdf" onChange={handleFileChange} />
      </div>
      <button className="upload-btn-submit" onClick={handleUpload} disabled={loading || !file}>
        {loading ? 'Enviando...' : 'Enviar Edital'}
      </button>
      {feedback.message && (
        <div className={`upload-feedback ${feedback.type}`}>
          {feedback.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
          {feedback.message}
        </div>
      )}
    </div>
  );
};

// === CARD 2: CONFIGURAÇÃO DO SITE (ATUALIZADO - UPLOAD DE LOGO) ===
const ConfigSiteCard = () => {
  const { config, refreshConfig } = useConfig();
  const [siteName, setSiteName] = useState('');
  
  // Estado para o arquivo da logo
  const [logoFile, setLogoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const [loading, setLoading] = useState(false);

  // Carrega os dados atuais quando o componente monta
  useEffect(() => {
    if (config) {
      setSiteName(config.siteName || '');
      // Se já tiver logo, poderíamos mostrar, mas vamos focar no preview do novo upload
    }
  }, [config]);

  // Handler para seleção de arquivo da logo
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      // Cria um preview local
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveConfig = async () => {
    setLoading(true);
    try {
      let msg = [];

      // 1. Se tiver arquivo de logo selecionado, faz o upload
      if (logoFile) {
        const formData = new FormData();
        formData.append('logo', logoFile);
        
        await api.put('/admin/config/logo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        msg.push("Logo atualizada");
      }

      // 2. Se o nome mudou, atualiza via JSON (API antiga/padrão)
      // Verifica se realmente mudou para evitar requisição extra desnecessária
      if (config && siteName !== config.siteName) {
         await api.put('/admin/config', { siteName });
         msg.push("Nome do evento atualizado");
      }

      if (msg.length === 0 && !logoFile) {
          alert("Nenhuma alteração detectada.");
          setLoading(false);
          return;
      }

      // 3. Atualiza o contexto global
      await refreshConfig();
      
      alert(`Sucesso! ${msg.join(' e ')}.`);
      
      // Limpa estados temporários
      setLogoFile(null);
      setPreview(null);

    } catch (error) {
      console.error(error);
      alert('Erro ao salvar configurações.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card config-card">
      <h3><FaCog /> Configurações do Site</h3>
      <p>Altere a identidade visual do evento.</p>
      
      <div className="config-inputs">
        <div className="input-group" style={{ marginBottom: '15px' }}>
          <label>Nome do Evento (Título)</label>
          <input 
            type="text" 
            className="admin-input" 
            value={siteName} 
            onChange={(e) => setSiteName(e.target.value)} 
            placeholder="Ex: INTERGIL 2K25"
          />
        </div>

        <div className="input-group" style={{ marginBottom: '15px' }}>
          <label>Logo do Evento</label>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
            {/* Input File escondido estilizado */}
            <label htmlFor="logo-upload" className="upload-label-small" style={{ cursor: 'pointer', background: '#333', padding: '8px 12px', borderRadius: '4px', border: '1px solid #444', color: '#fff', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FaImage /> {logoFile ? 'Imagem Selecionada' : 'Trocar Logo'}
            </label>
            <input 
                id="logo-upload"
                type="file" 
                accept="image/*"
                onChange={handleLogoChange}
                style={{ display: 'none' }}
            />
          </div>
          
          {/* Área de Preview */}
          {(preview || config?.logoUrl) && (
             <div style={{ marginTop: '10px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                 <p style={{fontSize: '0.8rem', color: '#aaa', marginBottom: '5px'}}>
                    {preview ? 'Pré-visualização (Nova):' : 'Logo Atual:'}
                 </p>
                 <img 
                    src={preview || `http://localhost:5000${config.logoUrl}`} 
                    alt="Logo Preview" 
                    style={{ maxHeight: '60px', objectFit: 'contain' }} 
                    onError={(e) => e.target.style.display = 'none'} // Esconde se quebrar
                 />
             </div>
          )}
        </div>

        <button className="upload-btn-submit" onClick={handleSaveConfig} disabled={loading}>
          <FaSave /> {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </div>
  );
};

// === PÁGINA PRINCIPAL ===
const AdminDashboard = () => {
  return (
    <>
      <div className="admin-header-bar">
        <h2>Visão Geral</h2>
      </div>

      <div className="admin-content-inner">
        <div className="admin-card">
          <h3>Bem-vindo, Gestor!</h3>
          <p>Use o menu ao lado para gerenciar todo o evento.</p>
        </div>
        
        {/* GRID PARA OS CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
            <UploadEditalCard />
            <ConfigSiteCard />
        </div>
        
      </div>
    </>
  );
};

export default AdminDashboard;