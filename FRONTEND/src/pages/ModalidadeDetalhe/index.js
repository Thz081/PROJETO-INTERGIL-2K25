import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api'; 
import { useAudio } from '../../context/AudioContext';
import './style.css'; 
import { FaDownload, FaStream, FaChevronLeft, FaChevronRight, FaArrowLeft } from 'react-icons/fa';

// SEU IP DE HOJE (ATUALIZE SE MUDAR)
const BASE_URL_IMG = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const ModalidadeDetalhe = () => {
  const { slug } = useParams();
  const { playClick } = useAudio();
  const navigate = useNavigate();

  const [modalidade, setModalidade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para navegação
  const [prevMod, setPrevMod] = useState(null);
  const [nextMod, setNextMod] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Busca TODAS as modalidades para saber a ordem
        const { data: listaCompleta } = await api.get('/modalidades');
        
        // 2. Acha a modalidade atual pelo SLUG
        const currentIndex = listaCompleta.findIndex(m => m.slug === slug);

        if (currentIndex === -1) {
            setError("Modalidade não encontrada.");
            setLoading(false);
            return;
        }

        setModalidade(listaCompleta[currentIndex]);

        // 3. Define quem é o Anterior e o Próximo (Loop infinito)
        const prevIndex = currentIndex === 0 ? listaCompleta.length - 1 : currentIndex - 1;
        const nextIndex = currentIndex === listaCompleta.length - 1 ? 0 : currentIndex + 1;

        setPrevMod(listaCompleta[prevIndex]);
        setNextMod(listaCompleta[nextIndex]);

      } catch (err) {
        setError("Erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const renderLink = (link, texto, classeBtn = "submodalidade-btn") => {
    if (!link || link === '#') {
      return (
        <span className={`${classeBtn} sub-btn-secundario`} style={{opacity: 0.5, cursor: 'not-allowed'}}>
          {texto} (Em breve)
        </span>
      );
    }
    
    // === CORREÇÃO DOS LINKS DE PDF ===
    // Se começar com /arquivos ou /uploads, é local e precisa do IP
    const isLocal = link.startsWith('/arquivos/') || link.startsWith('/uploads/');
    const url = isLocal ? `${BASE_URL_IMG}${link}` : link;
    
    // Define ícone (PDF ou Link normal)
    const isPDF = link.toLowerCase().endsWith('.pdf');
    const icone = isPDF ? <FaDownload /> : <FaStream />;
    
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={classeBtn} onClick={playClick}>
        {icone} {texto}
      </a>
    );
  };

  if (loading) return <div className="detalhe-container loading">Carregando...</div>;
  if (error) return <div className="detalhe-container error">{error}</div>;
  if (!modalidade) return null;

  // === MONTA URL DA IMAGEM (BANNER) ===
  const bannerSrc = modalidade.imgDetalhe 
    ? `${BASE_URL_IMG}${modalidade.imgDetalhe}` 
    : `${BASE_URL_IMG}/images/gameon-logo.png`;

  return (
    <div className="page-modalidade-wrapper">
      
      {/* === SETAS DE NAVEGAÇÃO (DESKTOP) === */}
      {prevMod && (
        <Link to={`/modalidade/${prevMod.slug}`} className="nav-arrow prev" onClick={playClick}>
            <FaChevronLeft />
            <span>{prevMod.nome}</span>
        </Link>
      )}
      
      {nextMod && (
        <Link to={`/modalidade/${nextMod.slug}`} className="nav-arrow next" onClick={playClick}>
            <FaChevronRight />
            <span>{nextMod.nome}</span>
        </Link>
      )}

      <div className="detalhe-container">
        {/* Botão Voltar (Mobile Friendly) */}
        <button className="btn-voltar-mobile" onClick={() => navigate('/')}>
            <FaArrowLeft /> Voltar
        </button>

        {/* === IMAGEM DO BANCO === */}
        <img 
            src={bannerSrc} 
            alt={modalidade.nome} 
            className="detalhe-imagem" 
            onError={(e)=>{e.target.onerror = null; e.target.src="/images/gameon-logo.png"}}/>

        <h1 className="detalhe-titulo">{modalidade.nome}</h1>
        
        <p className="detalhe-descricao">
          {modalidade.descricao || "Descrição da modalidade em breve."}
        </p>

        <div className="detalhe-links principal-links">
          {renderLink(modalidade.linkEdital, "Edital Principal", "detalhe-btn")}
          <Link to="/inscricao" className="detalhe-btn btn-secundario" onClick={playClick}>
            Inscrever-se
          </Link>
        </div>

        <div className="submodalidades-section">
          <h2 className="submodalidades-titulo">Categorias / Variações</h2>
          <ul className="submodalidades-lista">
            {modalidade.submodalidades.map((sub, index) => (
              <li key={index} className="submodalidade-item">
                <span className="submodalidade-nome">{sub.nome}</span>
                <div className="submodalidade-links">
                  {renderLink(sub.edital, "Edital", "submodalidade-btn")}
                  {renderLink(sub.chaveamento, "Chaveamento", "submodalidade-btn")}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* === NAVEGAÇÃO MOBILE === */}
        <div className="mobile-nav-buttons">
            {prevMod && (
                <Link to={`/modalidade/${prevMod.slug}`} className="mobile-nav-btn" onClick={playClick}>
                    <FaChevronLeft /> {prevMod.nome}
                </Link>
            )}
            {nextMod && (
                <Link to={`/modalidade/${nextMod.slug}`} className="mobile-nav-btn" onClick={playClick}>
                    {nextMod.nome} <FaChevronRight />
                </Link>
            )}
        </div>

      </div>
    </div>
  );
};

export default ModalidadeDetalhe;