import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../../context/AudioContext';
import { useAuth } from '../../context/AuthProvider';
import api from '../../api';
import './style.css';
import { FaCheckCircle, FaChevronRight, FaLock, FaSignOutAlt } from 'react-icons/fa';

// SEU IP DE HOJE
const BASE_URL_IMG = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const Inscricao = () => {
  const { playClick, playSuccess } = useAudio();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [modalidades, setModalidades] = useState([]);
  const [contagem, setContagem] = useState({}); // Armazena a lotação das turmas
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [carrinho, setCarrinho] = useState({});

  // === FETCH DE DADOS BLINDADO ===
  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    
    const carregarDados = async () => {
      try {
        // 1. Busca Modalidades (Essencial)
        const resMods = await api.get('/modalidades');
        setModalidades(resMods.data.filter(m => m && m.slug)); 

        // 2. Tenta buscar contagem (Opcional / Pode falhar)
        try {
            const resCont = await api.get('/inscricoes/contagem');
            setContagem(resCont.data);
        } catch (errCont) {
            console.warn("Aviso: Não foi possível carregar a contagem de vagas.", errCont);
            // Não faz nada, apenas segue a vida sem o contador visual
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Erro fatal:", err);
        setError("Erro ao carregar sistema de inscrição.");
        setLoading(false);
      }
    };
    carregarDados();
  }, [user, navigate]);

  // === LIMITES (MIN/MAX) ===
  const { minModalidades, maxModalidades } = useMemo(() => {
    if (!user) return { minModalidades: 2, maxModalidades: 3 };
    const t = user.turma ? user.turma.toLowerCase() : '';
    const isTerceiro = t.includes('3º') || t.includes('3°') || t.startsWith('3');
    return {
        minModalidades: isTerceiro ? 3 : 2,
        maxModalidades: isTerceiro ? 4 : 3
    };
  }, [user]);

  // === HELPER DE FAMÍLIA DIGITAL ===
  const getDigitalFamily = (name) => {
      if (name.includes("Free Fire")) return "FF";
      if (name.includes("Call of Duty")) return "COD";
      if (name.includes("FIFA")) return "FIFA";
      return name;
  };

  // =========================================================
  // 🧠 CÁLCULO TOTAL (PRE-GIL + RPG + DIGITAIS + GERAL)
  // =========================================================
  const totalSelecionado = useMemo(() => {
    let total = 0;
    
    for (const modSlug in carrinho) {
      const subs = carrinho[modSlug];
      if (!subs || subs.length === 0) continue;
      
      const modData = modalidades.find(m => m.slug === modSlug);
      if (!modData) continue;

      // RPG
      if (modSlug === 'jogos-imaginacao') { 
          total += 1; 
          continue; 
      }
      
      // DIGITAIS
      if (modSlug === 'jogos-digitais') {
          const fams = {};
          subs.forEach(i => {
              const idx = parseInt(i.split('-').pop());
              const sub = modData.submodalidades[idx];
              if(sub) { 
                  const f = getDigitalFamily(sub.nome); 
                  if(!fams[f]) fams[f]=[]; 
                  fams[f].push(sub); 
              }
          });
          for (const itens of Object.values(fams)) {
              if (itens.some(s => s.isPrincipal)) total += 1;
              else total += itens.length;
          }
          continue;
      }
      
      // AVULSO SIMPLES
      if (modData.isAvulsoSimples) { 
          total += subs.length; 
          continue; 
      }
      
      // ESPORTES PADRÃO
      const idsP = modData.submodalidades.map((s,i) => s.isPrincipal ? `${modSlug}-${i}` : null).filter(x=>x);
      const temP = idsP.some(id => subs.includes(id));
      if (temP) total += 1; else total += subs.length;
    }

    // --- SOMA DO PRÉ-GIL ---
    if (user && user.preGil) {
        const temPrincipalFutsalAgora = carrinho['futsal']?.some(item => {
            const idx = parseInt(item.split('-').pop());
            return modalidades.find(m=>m.slug==='futsal')?.submodalidades[idx]?.isPrincipal;
        });
        if (!temPrincipalFutsalAgora) total += (user.preGil.futsal || 0);

        const temPrincipalVoleiAgora = carrinho['volei']?.some(item => {
            const idx = parseInt(item.split('-').pop());
            return modalidades.find(m=>m.slug==='volei')?.submodalidades[idx]?.isPrincipal;
        });
        if (!temPrincipalVoleiAgora) total += (user.preGil.volei || 0);

        const temPrincipalBasqueteAgora = carrinho['basquete']?.some(item => {
            const idx = parseInt(item.split('-').pop());
            return modalidades.find(m=>m.slug==='basquete')?.submodalidades[idx]?.isPrincipal;
        });
        if (!temPrincipalBasqueteAgora) total += (user.preGil.basquete || 0);
    }

    return total;
  }, [carrinho, modalidades, user]);

  const isLimiteAtingido = totalSelecionado >= maxModalidades;

  // =========================================================
  // 📊 HELPER VISUAL (BADGE DE VAGAS)
  // =========================================================
  const renderBadge = (idUnico, limiteMax) => {
      const ocupadas = contagem[idUnico] || 0;
      const isLotado = ocupadas >= limiteMax;
      
      return (
          <span className={`vagas-badge ${isLotado ? 'lotado' : 'disponivel'}`}>
              {ocupadas}/{limiteMax}
          </span>
      );
  };

  // =========================================================
  // 🔒 BLOQUEIOS
  // =========================================================
  const [slugAberto, setSlugAberto] = useState(null);
  const isModAberta = (slug) => !!carrinho[slug];
  const isSubSelecionada = (slug, subIndex) => carrinho[slug]?.includes(`${slug}-${subIndex}`);

  const isSubBloqueada = (slug, sub, subIndex) => {
      if (!user) return true;
      const subId = `${slug}-${subIndex}`;
      const subsAtuais = carrinho[slug] || [];
      const modData = modalidades.find(m => m.slug === slug);
      
      if (!modData) return true;

      // --- BLOQUEIO DE LOTAÇÃO (TURMA) ---
      const idParaContagem = subIndex !== undefined && subIndex !== null 
          ? `${modData._id}-${subIndex}` 
          : String(modData._id);
          
      const limiteVagas = sub?.max_inscritos || modData.max_inscritos || 99;
      const vagasOcupadas = contagem[idParaContagem] || 0;

      // Se lotou e eu não estou na lista -> Bloqueia
      if (vagasOcupadas >= limiteVagas && !subsAtuais.includes(subId)) {
          return true; 
      }

      // Gênero
      if (sub.genero && sub.genero !== 'X' && user.sexo !== sub.genero) return true;
      
      // Se já marquei, libera
      if (subsAtuais.includes(subId)) return false;

      // RPG
      if (slug === 'jogos-imaginacao') {
          if (subsAtuais.length >= 2) return true;
          if (subsAtuais.length === 0 && isLimiteAtingido) return true;
          return false;
      }

      // DIGITAIS
      if (slug === 'jogos-digitais') {
          const fam = getDigitalFamily(sub.nome);
          const itensFam = subsAtuais.map(id => {
              const idx = parseInt(id.split('-').pop());
              return modData.submodalidades[idx];
          }).filter(s => s && getDigitalFamily(s.nome) === fam);

          const temP = itensFam.some(s=>s.isPrincipal);
          
          if (temP) { 
              if (sub.isPrincipal) return true; 
              return false; 
          } else { 
              if (sub.isPrincipal) return isLimiteAtingido; 
              if (isLimiteAtingido) return true;
              if (itensFam.length >= 2) return true; 
              return false; 
          }
      }

      // ESPORTES PADRÃO
      if (modData.isAvulsoSimples) return isLimiteAtingido;

      const idsP = modData.submodalidades.map((s,i) => s.isPrincipal ? `${slug}-${i}` : null).filter(x=>x);
      const temP = idsP.some(id => subsAtuais.includes(id));

      if (temP) { 
          if (sub.isPrincipal) return true; 
          const g = subsAtuais.filter(id => !idsP.includes(id)).length; 
          if (g >= 2) return true; 
          return false; 
      } else { 
          if (sub.isPrincipal) return isLimiteAtingido; 
          if (isLimiteAtingido) return true; 
          if (subsAtuais.length >= 2) return true; 
          return false; 
      }
  };

  // =========================================================
  // 🖱️ HANDLERS
  // =========================================================
  const handleToggleInscricao = (mod, subObj) => {
      playClick(); setError('');
      const modSlug = mod.slug;
      const realIndex = mod.submodalidades.indexOf(subObj);
      if (realIndex === -1) return;

      const subId = `${modSlug}-${realIndex}`;
      let novo = { ...carrinho };
      const atuais = novo[modSlug] || [];

      if (atuais.includes(subId)) {
          novo[modSlug] = atuais.filter(id => id !== subId);
          if (novo[modSlug].length === 0) delete novo[modSlug];
      } else {
          if (modSlug === 'jogos-imaginacao' && atuais.length >= 2) {
               setError("Máximo 2 opções no RPG."); return;
          }
          novo[modSlug] = [...atuais, subId];
      }
      setCarrinho(novo);
  };
  
  const handleToggleSimples = (mod) => {
      playClick(); setError('');
      const modSlug = mod.slug; 
      let novo = { ...carrinho };
      
      if (novo[modSlug]) delete novo[modSlug];
      else { 
          if (isLimiteAtingido) { setError("Limite Atingido!"); return; } 
          novo[modSlug] = [modSlug]; 
      } 
      setCarrinho(novo);
  };

  const handleFinalizarInscricao = async () => {
      playClick(); setSuccess(''); setError('');

      if (totalSelecionado < minModalidades) {
          setError(`Mínimo de ${minModalidades} modalidades! (Atual: ${totalSelecionado})`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
      }

      try {
        const payload = [];
        for (const [slug, itens] of Object.entries(carrinho)) {
            const modReal = modalidades.find(m => m.slug === slug);
            if (!modReal) continue;
            
            itens.forEach(itemStr => {
                if (itemStr === slug) {
                    payload.push(String(modReal._id));
                } else {
                    const index = itemStr.split('-').pop();
                    payload.push(`${modReal._id}-${index}`);
                }
            });
        }

        await api.post('/inscricoes', { modalidades: payload, pontuacaoTotal: totalSelecionado });
        playSuccess(); setSuccess("INSCRIÇÃO REALIZADA!"); setCarrinho({});
        setTimeout(() => navigate('/meu-perfil'), 2000);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Erro ao salvar.");
      }
  };

  if (loading) return <div className="loading-screen">Carregando Arena...</div>;

  return (
    <div className="inscricao-wrapper">
      <div className="inscricao-container">
        <h1 className="inscricao-titulo">ARENA DE INSCRIÇÃO</h1>
        
        <div className="aluno-info-bar">
          <div className="info-dados">
             <span>Inscrito: <strong>{user.nome}</strong></span>
             <span>Turma: <strong>{user.turma}</strong></span>
          </div>
          <button className="btn-logout" onClick={() => { playClick(); logout(); }}>
             <FaSignOutAlt /> Sair
          </button>
        </div>

        {error && <p className="inscricao-mensagem error">{error}</p>}
        {success && <p className="inscricao-mensagem success">{success}</p>}

        <div className="inscricao-contador">
          <p>MODALIDADES: <span>{totalSelecionado} / {maxModalidades}</span> (Min: {minModalidades})</p>
        </div>

        <div className="inscricao-lista-mecanica">
          {modalidades.map((mod) => {
            if (!mod) return null;
            const modSlug = mod.slug;
            const subsVisiveis = mod.submodalidades?.filter(s => s.inscricao) || [];

            // Lógica de Imagem (com fallback)
            const imgSrc = mod.imgCarrossel 
                ? `${BASE_URL_IMG}${mod.imgCarrossel}` 
                : `${BASE_URL_IMG}/images/gameon-logo.png`;

            // CASO 1: SIMPLES (Sem subs)
            if (subsVisiveis.length === 0) {
                const sel = isModAberta(modSlug);
                
                // Dados da Contagem
                const idUnico = String(mod._id);
                const limite = mod.max_inscritos || 99;
                const ocupadas = contagem[idUnico] || 0;
                const lotado = ocupadas >= limite;
                const badge = renderBadge(idUnico, limite);

                // Bloqueia se lotado e não selecionado
                const bloq = isSubBloqueada(modSlug, null, null) || (!sel && lotado);

                return (
                    <div key={modSlug} className={`mecanica-item ${sel?'selecionado':''} ${bloq?'bloqueado-geral':''}`}
                         onClick={()=>!bloq && handleToggleSimples(mod)}>
                        <img src={imgSrc} className="mecanica-img" alt={mod.nome} onError={(e)=>{e.target.onerror=null; e.target.src='/images/gameon-logo.png'}}/>
                        <span className="mecanica-nome">
                            {mod.nome}
                            {badge} 
                        </span>
                        {sel && <FaCheckCircle className="check-icon"/>}
                        {bloq && <FaLock className="lock-icon"/>}
                    </div>
                )
            }

            // CASO 2: ACCORDION (Com subs)
            const isOpen = slugAberto === modSlug;
            const hasSel = isModAberta(modSlug);
            return (
                <div key={modSlug} className={`mecanica-item ${isOpen?'aberto':''} ${hasSel?'grupo-selecionado':''}`}>
                    <div className="mecanica-header" onClick={()=>setSlugAberto(isOpen?null:modSlug)}>
                        <img src={imgSrc} className="mecanica-img" alt={mod.nome} onError={(e)=>{e.target.onerror=null; e.target.src='/images/gameon-logo.png'}}/>
                        <span className="mecanica-nome">{mod.nome}</span>
                        <FaChevronRight className={`seta ${isOpen?'rotate':''}`}/>
                    </div>
                    {isOpen && (
                        <div className="mecanica-subs-container">
                            {subsVisiveis.map((subObj, i) => {
                                const realIndex = mod.submodalidades.indexOf(subObj);
                                
                                // Contagem
                                const idUnico = `${mod._id}-${realIndex}`;
                                const limite = subObj.max_inscritos || mod.max_inscritos || 99;
                                const badge = renderBadge(idUnico, limite);

                                const bloq = isSubBloqueada(modSlug, subObj, realIndex);
                                const sel = isSubSelecionada(modSlug, realIndex);
                                
                                return (
                                    <div key={i} className={`mecanica-sub-item ${sel?'selecionado':''} ${bloq?'bloqueado':''}`}
                                         onClick={()=>!bloq && handleToggleInscricao(mod, subObj)}>
                                        <div className="mecanica-checkbox">
                                            {bloq ? <FaLock/> : (sel && <FaCheckCircle/>)}
                                        </div>
                                        <span className="mecanica-nome">
                                            {subObj.nome}
                                            {badge}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )
          })}
        </div>
        
        {totalSelecionado > 0 && !success && (
            <div className="finalizar-container">
                <button className="btn-finalizar" onClick={handleFinalizarInscricao}>CONFIRMAR INSCRIÇÃO</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Inscricao;