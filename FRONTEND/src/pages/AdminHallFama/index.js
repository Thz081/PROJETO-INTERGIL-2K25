import React, { useState, useEffect } from 'react';
import api from '../../api';
import { FaTrophy, FaTrash, FaPlus } from 'react-icons/fa';
import './style.css'; 

// URL BASE (Ajuste o IP se necessário)
const BASE_URL_IMG = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const AdminHallFama = () => {
    const [hall, setHall] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form
    const [ano, setAno] = useState('');
    const [turma, setTurma] = useState('');
    const [pontos, setPontos] = useState('');
    const [instagram, setInstagram] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchHall();
    }, []);

    const fetchHall = async () => {
        try {
            const res = await api.get('/admin/hall');
            setHall(res.data);
        } catch (error) {
            console.error("Erro ao buscar hall", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return alert("Selecione uma imagem!");

        setLoading(true);
        const formData = new FormData();
        formData.append('ano', ano);
        formData.append('turma', turma);
        formData.append('pontos', pontos);
        formData.append('instagram', instagram);
        formData.append('logo', file); 

        try {
            await api.post('/admin/hall', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Campeão adicionado!');
            setAno(''); setTurma(''); setPontos(''); setInstagram(''); setFile(null);
            document.getElementById('fileInput').value = "";
            fetchHall();
        } catch (error) {
            alert('Erro ao salvar. Verifique se o ano já existe.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja apagar este registro?")) {
            try {
                await api.delete(`/admin/hall/${id}`);
                fetchHall();
            } catch (error) {
                alert("Erro ao deletar.");
            }
        }
    };

    return (
        <div className="admin-content-inner">
            <div className="admin-header-bar">
                <h2><FaTrophy /> Gerenciar Hall da Fama</h2>
            </div>

            <div className="admin-card">
                <h3>Novo Campeão</h3>
                <form onSubmit={handleSubmit} className="form-grid">
                    <div className="input-group">
                        <label>Ano</label>
                        <input type="number" value={ano} onChange={e=>setAno(e.target.value)} required className="admin-input" placeholder="2024"/>
                    </div>
                    <div className="input-group">
                        <label>Nome da Turma/Equipe</label>
                        <input value={turma} onChange={e=>setTurma(e.target.value)} required className="admin-input" placeholder="Ex: BLUESTORM"/>
                    </div>
                    <div className="input-group">
                        <label>Pontos (Opcional)</label>
                        <input value={pontos} onChange={e=>setPontos(e.target.value)} className="admin-input" placeholder="Ex: 1500"/>
                    </div>
                    <div className="input-group">
                        <label>Instagram (URL Completa)</label>
                        <input value={instagram} onChange={e=>setInstagram(e.target.value)} className="admin-input" placeholder="https://instagram.com/..."/>
                    </div>
                    <div className="input-group">
                        <label>Foto / Logo</label>
                        <input id="fileInput" type="file" onChange={e=>setFile(e.target.files[0])} required accept="image/*" className="admin-input"/>
                    </div>
                    <button disabled={loading} className="upload-btn-submit full-width">
                        {loading ? "Salvando..." : <><FaPlus/> Adicionar</>}
                    </button>
                </form>
            </div>

            <div className="hall-list" style={{marginTop: '30px'}}>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Ano</th>
                            <th>Foto</th>
                            <th>Turma</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hall.map(h => (
                            <tr key={h._id}>
                                <td data-label="Ano">{h.ano}</td>
                                <td data-label="Foto">
                                    <img 
                                        src={`${BASE_URL_IMG}${h.logo_path}`} 
                                        alt={h.turma} 
                                        style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #fff'}}
                                        onError={(e)=>{e.target.src='/images/gameon-logo.png'}}
                                    />
                                </td>
                                <td data-label="Turma">
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <span>{h.turma}</span>
                                        {h.instagram && <span style={{fontSize: '0.7rem', color: '#aaa'}}>Insta: Sim</span>}
                                    </div>
                                </td>
                                <td data-label="Ações">
                                    <button onClick={() => handleDelete(h._id)} className="btn-delete"><FaTrash/> Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminHallFama;