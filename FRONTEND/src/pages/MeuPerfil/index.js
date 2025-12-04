import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../../context/AudioContext';
import { useAuth } from '../../context/AuthProvider'; 
import api from '../../api'; 
import './style.css'; 
import { FaUserCircle, FaSignOutAlt, FaThList, FaTrash } from 'react-icons/fa';

const MeuPerfil = () => {
  const { playClick } = useAudio();
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  const [inscricao, setInscricao] = useState(null);
  const [todasModalidades, setTodasModalidades] = useState([]);
  const [loading, setLoading] = useState(true);

  // === 1. BUSCAR DADOS ===
  useEffect(() => {
    if (!user) { navigate('/login'); return; }

    const carregarDados = async () => {
      try {
        // Busca Inscrição
        const reqInscricao = await api.get('/inscricoes/me');
        setInscricao(reqInscricao.data);
      } catch (error) {
        console.log("Aluno sem inscrição ainda (404 esperado).");
      }

      try {
        // Busca Dicionário de Modalidades
        const reqMods = await api.get('/modalidades');
        // Filtra nulos para evitar crash
        setTodasModalidades(reqMods.data.filter(m => m));
      } catch (error) {
        console.error("Erro ao carregar modalidades:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [user, navigate]);

  // === 2. FUNÇÃO DE CANCELAR ===
  const handleCancelarInscricao = async () => {
    playClick();
    const confirmacao = window.confirm(
      "⚠️ TEM CERTEZA?\n\nIsso vai apagar TODAS as suas escolhas e você perderá sua vaga atual.\nVocê terá que se inscrever do zero novamente."
    );

    if (confirmacao) {
      try {
        await api.delete('/inscricoes/me');
        alert("Sua inscrição foi cancelada com sucesso.");
        window.location.reload();
      } catch (err) {
        alert("Erro ao cancelar. Tente novamente.");
        console.error(err);
      }
    }
  };

  // === 3. O "TRADUTOR" BLINDADO (ID Numérico/String) ===
  const traduzirEscolha = (codigoString) => {
    // codigoString pode ser "12" ou "12-1"
    const codigoStr = String(codigoString); // Garante que é string
    const partes = codigoStr.split('-');
    
    const modId = partes[0]; // ID da modalidade (ex: "12")
    const subIndex = partes.length > 1 ? parseInt(partes[1]) : null; // Índice (ex: 1)

    // Busca convertendo ambos para String para garantir match
    const modalidade = todasModalidades.find(m => String(m._id) === modId);

    if (!modalidade) return `Modalidade não encontrada (ID: ${modId})`;

    // Se tem sub-índice, busca o nome da sub
    if (subIndex !== null) {
        if (modalidade.submodalidades && modalidade.submodalidades[subIndex]) {
            return `${modalidade.nome} - ${modalidade.submodalidades[subIndex].nome}`;
        }
        return `${modalidade.nome} (Sub indefinida)`;
    }
    
    // Se é modalidade pura
    return modalidade.nome;
  };

  // === RENDERIZAÇÃO ===
  if (loading) {
    return (
      <div className="perfil-wrapper">
        <h1 className="perfil-loading">Carregando Perfil...</h1>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="perfil-wrapper">
      <div className="perfil-container">
        <FaUserCircle className="perfil-icone-gigante" />
        
        <h1 className="perfil-nome">{user.nome}</h1>
        <p className="perfil-turma">{user.turma} • {user.sexo === 'M' ? 'Masculino' : 'Feminino'}</p>

        <div className="perfil-card">
          <h3><FaThList /> Minhas Inscrições</h3>
          
          {inscricao && inscricao.modalidades && inscricao.modalidades.length > 0 ? (
            <>
              <ul className="perfil-lista-inscricoes">
                {inscricao.modalidades.map((codigo, index) => (
                  <li key={index}>{traduzirEscolha(codigo)}</li>
                ))}
              </ul>
              
              <div className="resumo-pontos" style={{ marginTop: '15px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                  Total: <strong>{inscricao.pontuacaoTotal}</strong> pontos utilizados.
              </div>

              <div style={{ marginTop: '25px', borderTop: '1px dashed #444', paddingTop: '20px' }}>
                <button 
                  onClick={handleCancelarInscricao}
                  className="btn-cancelar-inscricao"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #FF5555',
                    color: '#FF5555',
                    padding: '12px',
                    width: '100%',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-title)',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.3s'
                  }}
                >
                  <FaTrash /> Cancelar Minha Inscrição
                </button>
              </div>
            </>
          ) : (
            <div className="sem-inscricao-container">
                <p className="perfil-lista-vazia">Você ainda não se inscreveu em nada.</p>
                
                <button 
                    className="btn-ir-inscricao" 
                    style={{marginTop: '15px', width: '100%', padding: '10px', cursor: 'pointer'}}
                    onClick={() => navigate('/inscricao')}
                >
                    Ir para Inscrição
                </button>
            </div>
          )}
        </div>

        <button onClick={() => { playClick(); logout(); }} className="perfil-logout-btn">
          <FaSignOutAlt /> Sair (Logout)
        </button>
      </div>
    </div>
  );
};

export default MeuPerfil;