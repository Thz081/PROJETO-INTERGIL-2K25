import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api';
import './style.css'; 
import { FaChevronRight, FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';

// === FUNÇÃO "NORMALIZADORA" ===
const normalizeTurma = (str) => {
  if (!str) return '';
  return str
    .replace('º', '°') 
    .replace('ª', '°') 
    .replace(/\s+/g, ' ') 
    .trim(); 
};

const AdminListaInscricoes = () => {
  const [inscricoes, setInscricoes] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [turmaAberta, setTurmaAberta] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const [resInsc, resMods, resSalas] = await Promise.all([
          api.get('/admin/inscricoes'),
          api.get('/modalidades'),
          api.get('/admin/salas')
        ]);
        setInscricoes(resInsc.data);
        setModalidades(resMods.data);
        setSalas(resSalas.data);
      } catch (err) {
        console.error("Erro ao carregar lista mestra:", err);
        setError(err.response?.data?.message || 'Erro ao buscar dados.');
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  // === TRADUTOR BLINDADO (A CORREÇÃO) ===
  const traduzirEscolha = (codigoString) => {
    if (!modalidades.length) return codigoString;
    
    const codigoStr = String(codigoString);
    const partes = codigoStr.split('-');
    
    const modId = partes[0];
    const subIndex = partes.length > 1 ? parseInt(partes[1]) : null;
    
    // Busca convertendo para String para garantir match (1 === "1")
    const modalidade = modalidades.find(m => String(m._id) === modId);
    
    if (!modalidade) return `[Inválido: ${modId}]`;
    
    if (subIndex !== null) {
        if (modalidade.submodalidades && modalidade.submodalidades[subIndex]) {
            return `${modalidade.nome} - ${modalidade.submodalidades[subIndex].nome}`;
        }
        return `${modalidade.nome} (Sub desconhecida)`;
    }
    
    return modalidade.nome;
  };

  // === FUNÇÃO DE EXPORTAR EXCEL ===
  const exportarExcel = () => {
    const dadosFormatados = inscricoes.map(inscricao => {
      const modalidadesNomes = inscricao.modalidades
        .map(cod => traduzirEscolha(cod))
        .join(', '); 

      return {
        "Turma": inscricao.aluno?.turma || "N/A",
        "Aluno": inscricao.aluno?.nome || "Deletado",
        "Matrícula": inscricao.aluno?.n_inscricao || "N/A",
        "Inscrições": modalidadesNomes,
        "Pontos": inscricao.pontuacaoTotal,
        "Data": new Date(inscricao.data_inscricao).toLocaleDateString('pt-BR')
      };
    });

    dadosFormatados.sort((a, b) => {
        if (a.Turma === b.Turma) {
            return a.Aluno.localeCompare(b.Aluno);
        }
        return a.Turma.localeCompare(b.Turma);
    });

    const worksheet = XLSX.utils.json_to_sheet(dadosFormatados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inscritos 2K25");

    const wscols = [
      {wch: 15}, 
      {wch: 40}, 
      {wch: 15}, 
      {wch: 80}, 
      {wch: 10}, 
      {wch: 12}  
    ];
    worksheet['!cols'] = wscols;

    XLSX.writeFile(workbook, "Relatorio_Geral_Intergil.xlsx");
  };

  const logoPorTurma = useMemo(() => {
    const mapa = {};
    salas.forEach(sala => {
      mapa[normalizeTurma(sala.turma)] = sala.logo_url;
    });
    return mapa;
  }, [salas]);

  const getSafeLogoUrl = (url) => {
    const defaultLogo = '/images/sala 1.png'; 
    if (!url) return defaultLogo;
    if (url.startsWith('http') || url.startsWith('/')) {
      return url;
    }
    if (url.startsWith('public/')) {
      return url.replace('public/', '/');
    }
    return `/${url}`;
  };

  const inscricoesPorTurma = useMemo(() => {
    const grupos = {};
    inscricoes.forEach(inscricao => {
      const turma = normalizeTurma(inscricao.aluno?.turma) || 'Sem Turma';
      if (!grupos[turma]) {
        grupos[turma] = [];
      }
      grupos[turma].push(inscricao);
    });
    const turmasOrdenadas = Object.keys(grupos).sort();
    const resultadoOrdenado = {};
    turmasOrdenadas.forEach(turma => {
      resultadoOrdenado[turma] = grupos[turma];
    });
    return resultadoOrdenado;
  }, [inscricoes]);

  
  if (loading) {
    return (
      <>
        <div className="admin-header-bar"><h2>Carregando Lista...</h2></div>
        <div className="admin-content-inner"><p>Buscando dados...</p></div>
      </>
    );
  }

  if (error) {
    return <div className="admin-content-inner"><p style={{ color: '#FF5555' }}>{error}</p></div>;
  }

  return (
    <>
      <div className="admin-header-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <h2>Lista Mestra ({inscricoes.length} Alunos)</h2>
        
        <button 
          onClick={exportarExcel}
          style={{
            backgroundColor: '#217346',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontFamily: 'var(--font-title)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem'
          }}
        >
          <FaFileExcel /> Baixar Excel
        </button>
      </div>

      <div className="admin-content-inner">
        <p>Clique em uma turma para expandir. Use o botão acima para baixar o relatório completo.</p>
        
        <div className="acordeao-mestre-container">
          {Object.keys(inscricoesPorTurma).map(turma => {
            const alunosDaTurma = inscricoesPorTurma[turma];
            const estaAberta = turmaAberta === turma;
            const logoUrl = getSafeLogoUrl(logoPorTurma[turma]);

            return (
              <div key={turma} className="acordeao-item">
                <div 
                  className={`acordeao-header ${estaAberta ? 'aberto' : ''}`}
                  onClick={() => setTurmaAberta(estaAberta ? null : turma)}
                >
                  <img src={logoUrl} alt="Logo" className="acordeao-logo" />
                  <span className="acordeao-titulo">{turma}</span>
                  <span className="acordeao-contador">({alunosDaTurma.length} Alunos)</span>
                  <FaChevronRight className={`acordeao-seta ${estaAberta ? 'aberta' : ''}`} />
                </div>

                {estaAberta && (
                  <div className="acordeao-content">
                    {alunosDaTurma.map(inscricao => (
                      <div key={inscricao._id} className="aluno-item-compacto">
                        <div className="aluno-info">
                          <span className="aluno-nome">{inscricao.aluno?.nome || 'Aluno Deletado'}</span>
                          <span className="aluno-id">ID: {inscricao.aluno?.n_inscricao || 'N/A'}</span>
                        </div>
                        <div className="aluno-inscricoes">
                          {inscricao.modalidades.map((codigo, idx) => (
                            <li key={idx}>{traduzirEscolha(codigo)}</li>
                          ))}
                        </div>
                        <div className="aluno-pontos">
                          <span>{inscricao.pontuacaoTotal}</span> PTS
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AdminListaInscricoes;