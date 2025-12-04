import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { useAudio } from '../../context/AudioContext';
import api from '../../api';
import './style.css';

const MonitorHorarios = () => {
  const { playClick } = useAudio();

  // Estados
  const [modalidades, setModalidades] = useState([]);
  const [horariosAgrupados, setHorariosAgrupados] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Agora vai ser usado!

  // Estados do Dropdown Cascata
  const [modId, setModId] = useState('');
  const [availableSubs, setAvailableSubs] = useState([]);
  const [categoria, setCategoria] = useState('');
  
  // Estados do Formulário
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [local, setLocal] = useState('');

  // === BUSCAR DADOS ===
  const fetchHorarios = async () => {
    try {
      setLoading(true);
      const response = await api.get('/monitor/horarios');
      
      // Garante que modalidades válidas venham
      const modsValidas = response.data.filter(m => m && m.nome);
      setModalidades(modsValidas);
      
      let agrupados = {};
      modsValidas.forEach(mod => {
        if (mod.horarios && mod.horarios.length > 0) {
          agrupados[mod.nome] = mod.horarios.map(h => ({
            ...h,
            modId: mod._id
          }));
        }
      });
      setHorariosAgrupados(agrupados);
      
    } catch (err) {
      console.error(err);
      setError('Erro ao buscar horários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHorarios();
  }, []);

  // === ATUALIZAR DROPDOWN ===
  const handleModalidadeChange = (novoModId) => {
    setModId(novoModId);
    setCategoria('');
    setAvailableSubs([]); // Reseta

    if (novoModId) {
      const modSelecionada = modalidades.find(m => String(m._id) === String(novoModId));
      
      if (modSelecionada) {
        if (modSelecionada.submodalidades && modSelecionada.submodalidades.length > 0) {
             setAvailableSubs(modSelecionada.submodalidades);
        }
      }
    }
  };

  // === ADICIONAR HORÁRIO ===
  const handleAddHorario = async (e) => {
    e.preventDefault();
    playClick();
    setError(null); // Limpa erro anterior

    const needsCategory = availableSubs.length > 0;

    if (!modId || !data || !horario || !local) {
      setError("Preencha Modalidade, Data, Horário e Local.");
      return;
    }

    if (needsCategory && !categoria) {
        setError("Para esta modalidade, selecione uma Categoria.");
        return;
    }

    const categoriaFinal = categoria || (needsCategory ? categoria : "Geral");

    try {
      await api.post('/monitor/horarios', {
        modId, 
        categoria: categoriaFinal, 
        data, 
        horario, 
        local
      });
      fetchHorarios();
      setData(''); setHorario(''); setLocal('');
      // Sucesso não precisa de estado, só atualiza a lista
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao adicionar.');
    }
  };

  const handleDeleteHorario = async (modId, horarioId) => {
    if (!window.confirm(`Apagar este horário?`)) return;
    try {
      setError(null);
      await api.delete(`/monitor/horarios/${modId}/${horarioId}`);
      fetchHorarios(); 
    } catch (err) {
      setError('Erro ao apagar.');
    }
  };
  
  const handleEditHorario = () => {
    alert("Em breve...");
  };
  
  return (
    <div className="monitor-horarios-container">
      
      <div className="admin-section">
        <h2><FaPlus /> Adicionar Jogo/Horário</h2>
        
        <form onSubmit={handleAddHorario} className="admin-form-inline">
          <div className="input-group">
            <label>Modalidade</label>
            <select value={modId} onChange={(e) => handleModalidadeChange(e.target.value)}>
              <option value="">-- Selecione --</option>
              {modalidades.map(mod => (
                <option key={mod._id} value={mod._id}>{mod.nome}</option>
              ))}
            </select>
          </div>
          
          {/* SEÇÃO CATEGORIA */}
          <div className="input-group">
            <label>
                Categoria 
                {availableSubs.length === 0 ? <small> (Nenhuma)</small> : <small> (Obrigatório)</small>}
            </label>
            <select 
              value={categoria} 
              onChange={(e) => setCategoria(e.target.value)}
              disabled={!modId || availableSubs.length === 0}
              style={{ 
                  opacity: (!modId || availableSubs.length === 0) ? 0.5 : 1,
                  cursor: (!modId || availableSubs.length === 0) ? 'not-allowed' : 'pointer'
              }}
            >
              <option value="">
                 {availableSubs.length === 0 ? "Sem subcategorias" : "-- Selecione --"}
              </option>
              {availableSubs.map((sub, index) => {
                const nomeSub = typeof sub === 'string' ? sub : sub.nome;
                return (
                    <option key={index} value={nomeSub}>
                        {nomeSub}
                    </option>
                );
              })}
            </select>
          </div>
          
          <div className="input-group" style={{minWidth: '100px', flex: '0.5'}}>
            <label>Data</label>
            <input type="text" placeholder="Ex: 25/03" value={data} onChange={(e) => setData(e.target.value)}/>
          </div>
          <div className="input-group" style={{minWidth: '100px', flex: '0.5'}}>
            <label>Horário</label>
            <input type="text" placeholder="Ex: 14:00" value={horario} onChange={(e) => setHorario(e.target.value)}/>
          </div>
          <div className="input-group">
            <label>Local</label>
            <input type="text" placeholder="Ex: Quadra 1" value={local} onChange={(e) => setLocal(e.target.value)}/>
          </div>
          
          <button type="submit" className="admin-btn-submit"><FaPlus /> Salvar</button>
        </form>
        
        {/* Exibe o erro aqui se houver */}
        {error && <p className="error-msg" style={{color: '#ff5555', marginTop: '10px'}}>{error}</p>}
      </div>

      {/* LISTA */}
      <div className="admin-section">
        <h2>Horários Cadastrados ({Object.values(horariosAgrupados).flat().length})</h2>
        {loading && <p>Carregando...</p>}
        
        {Object.keys(horariosAgrupados).map(nomeModalidade => (
          <div key={nomeModalidade} className="admin-tabela-container" style={{marginBottom: '20px'}}>
            <h3 style={{color: 'var(--neon-cyan)'}}>{nomeModalidade}</h3>
            <table className="admin-tabela">
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th>Data</th>
                  <th>Horário</th>
                  <th>Local</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {horariosAgrupados[nomeModalidade].map(jogo => (
                  <tr key={jogo._id}>
                    <td>{jogo.categoria}</td>
                    <td>{jogo.data}</td>
                    <td>{jogo.horario}</td>
                    <td>{jogo.local}</td>
                    <td>
                      <div className="tabela-acoes">
                        <button onClick={handleEditHorario} className="admin-btn-tabela edit"><FaEdit /></button>
                        <button onClick={() => handleDeleteHorario(jogo.modId, jogo._id)} className="admin-btn-tabela delete"><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonitorHorarios;