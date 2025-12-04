import React, { useState, useEffect } from 'react';
import api from '../../api';
import { FaGamepad, FaTrash, FaPlus, FaImage, FaEdit, FaTimes } from 'react-icons/fa';
import './style.css'; 

// Ajuste para o seu IP
const BASE_URL_IMG = process.env.REACT_APP_API_URL ||'http://localhost:3001';

const AdminModalidades = () => {
    const [modalidades, setModalidades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null); // ID de quem estou editando

    // Form States
    const [nome, setNome] = useState('');
    const [maxInscritos, setMaxInscritos] = useState('20');
    const [tipo, setTipo] = useState('coletivo');
    const [subcategorias, setSubcategorias] = useState('');
    
    // UPLOADS
    const [fileCarrossel, setFileCarrossel] = useState(null);
    const [fileDetalhe, setFileDetalhe] = useState(null);

    useEffect(() => {
        fetchModalidades();
    }, []);

    const fetchModalidades = async () => {
        try {
            const res = await api.get('/modalidades');
            setModalidades(res.data.filter(m => m).sort((a,b) => a.nome.localeCompare(b.nome)));
        } catch (error) {
            console.error("Erro ao buscar modalidades", error);
        }
    };

    // === PREENCHE O FORMULÁRIO PARA EDIÇÃO ===
    const handleEdit = (mod) => {
        setEditingId(mod._id);
        setNome(mod.nome);
        setMaxInscritos(mod.max_inscritos);
        setTipo(mod.isAvulsoSimples ? 'individual' : 'coletivo');
        
        // Transforma o array de subs em string separada por vírgula
        const subsString = mod.submodalidades 
            ? mod.submodalidades.map(s => s.nome).join(', ') 
            : '';
        setSubcategorias(subsString);

        // Rola a tela para o topo (formulário)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        resetForm();
    };

    const resetForm = () => {
        setNome(''); setMaxInscritos('20'); setSubcategorias('');
        setFileCarrossel(null); setFileDetalhe(null);
        setTipo('coletivo');
        document.getElementById('inputCarrossel').value = "";
        document.getElementById('inputDetalhe').value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validação (Na edição, as fotos são opcionais, pois mantém as antigas)
        if (!nome) return alert("Preencha o nome!");
        if (!editingId && (!fileCarrossel || !fileDetalhe)) {
            return alert("Na criação, as duas imagens são obrigatórias!");
        }

        setLoading(true);
        const formData = new FormData();
        
        formData.append('nome', nome);
        formData.append('max_inscritos', maxInscritos);
        formData.append('tipo', tipo);
        
        const subsArray = subcategorias.split(',').map(s => s.trim()).filter(s => s !== '');
        formData.append('subcategorias', JSON.stringify(subsArray));

        if (fileCarrossel) formData.append('imgCarrossel', fileCarrossel);
        if (fileDetalhe) formData.append('imgDetalhe', fileDetalhe);

        try {
            if (editingId) {
                // MODO EDIÇÃO (PUT)
                await api.put(`/admin/modalidades/${editingId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('Modalidade Atualizada!');
            } else {
                // MODO CRIAÇÃO (POST)
                await api.post('/admin/modalidades', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('Modalidade Criada!');
            }
            
            resetForm();
            setEditingId(null);
            fetchModalidades();
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza? Isso apagará a modalidade.")) {
            try {
                await api.delete(`/admin/modalidades/${id}`);
                fetchModalidades();
            } catch (error) {
                alert("Erro ao deletar.");
            }
        }
    };

    return (
        <div className="admin-content-inner">
            <div className="admin-header-bar">
                <h2><FaGamepad /> Gestão de Modalidades</h2>
            </div>

            {/* === FORMULÁRIO === */}
            <div className="admin-card" style={editingId ? {borderColor: 'var(--golden-yellow)'} : {}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <h3>{editingId ? `Editando: ${nome}` : 'Nova Modalidade'}</h3>
                    {editingId && (
                        <button onClick={cancelEdit} className="btn-cancel-edit">
                            <FaTimes /> Cancelar Edição
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="form-grid-modalidade">
                    
                    <div className="input-group">
                        <label>Nome da Modalidade</label>
                        <input value={nome} onChange={e=>setNome(e.target.value)} required className="admin-input" placeholder="Ex: Handebol"/>
                    </div>

                    <div className="input-group">
                        <label>Limite de Inscritos (Geral)</label>
                        <input type="number" value={maxInscritos} onChange={e=>setMaxInscritos(e.target.value)} className="admin-input"/>
                    </div>

                    <div className="input-group">
                        <label>Tipo de Modalidade</label>
                        <select 
                            value={tipo} 
                            onChange={e => setTipo(e.target.value)} 
                            className="admin-input"
                            style={{backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff'}}
                        >
                            <option value="coletivo">Padrão (Com Subs/Principal)</option>
                            <option value="individual">Simples (Avulso/Sem Principal)</option>
                        </select>
                    </div>

                    <div className="input-group full-width">
                        <label>Subcategorias (Separadas por vírgula)</label>
                        <input 
                            value={subcategorias} 
                            onChange={e=>setSubcategorias(e.target.value)} 
                            className="admin-input" 
                            placeholder="Ex: Masculino, Feminino, Misto, X1"
                        />
                    </div>

                    {/* UPLOADS */}
                    <div className="input-group">
                        <label><FaImage/> Capa {editingId ? '(Opcional)' : '(Obrigatório)'}</label>
                        <input 
                            id="inputCarrossel" 
                            type="file" 
                            onChange={e=>setFileCarrossel(e.target.files[0])} 
                            accept="image/*" 
                            className="file-input"
                        />
                    </div>

                    <div className="input-group">
                        <label><FaImage/> Banner {editingId ? '(Opcional)' : '(Obrigatório)'}</label>
                        <input 
                            id="inputDetalhe" 
                            type="file" 
                            onChange={e=>setFileDetalhe(e.target.files[0])} 
                            accept="image/*" 
                            className="file-input"
                        />
                    </div>

                    <button disabled={loading} className={`upload-btn-submit full-width ${editingId ? 'btn-update' : ''}`}>
                        {loading ? "Salvando..." : (editingId ? "Salvar Alterações" : <><FaPlus/> Criar Modalidade</>)}
                    </button>
                </form>
            </div>

            {/* === LISTA === */}
            <div className="modalidades-list-admin">
                {modalidades.map(mod => (
                    <div key={mod._id} className="mod-admin-card">
                        <div className="mod-admin-imgs">
                            <div className="img-box">
                                <span>Capa</span>
                                <img src={`${BASE_URL_IMG}${mod.imgCarrossel || mod.imageUrl}`} alt="Capa" onError={(e)=>{e.target.src='/images/gameon-logo.png'}}/>
                            </div>
                            <div className="img-box">
                                <span>Banner</span>
                                <img src={`${BASE_URL_IMG}${mod.imgDetalhe || mod.imageUrl}`} alt="Banner" onError={(e)=>{e.target.src='/images/gameon-logo.png'}}/>
                            </div>
                        </div>
                        
                        <div className="mod-admin-info">
                            <h4>{mod.nome}</h4>
                            <p>Subs: {mod.submodalidades?.length || 0}</p>
                            <p>Limite: {mod.max_inscritos}</p>
                        </div>

                        {/* BOTÕES DE AÇÃO */}
                        <div className="mod-actions">
                            <button onClick={() => handleEdit(mod)} className="btn-icon btn-edit">
                                <FaEdit />
                            </button>
                            <button onClick={() => handleDelete(mod._id)} className="btn-icon btn-delete">
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminModalidades;