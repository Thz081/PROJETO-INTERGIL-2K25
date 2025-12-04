import React, { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import api from '../../api';
import { useAudio } from '../../context/AudioContext';
import './style.css';

// SEU IP DE HOJE
const BASE_URL_IMG = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const Horarios = () => {
    const { playClick } = useAudio();
    const [modalidadesComHorarios, setModalidadesComHorarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [idAberto, setIdAberto] = useState(null);

    useEffect(() => {
        const fetchHorariosPublicos = async () => {
            try {
                setLoading(true);
                const response = await api.get('/modalidades');
                
                // Filtra apenas as que têm horários cadastrados
                const modalidadesFiltradas = response.data.filter(
                    (mod) => mod.horarios && mod.horarios.length > 0
                );
                setModalidadesComHorarios(modalidadesFiltradas);
            } catch (err) {
                console.error('Erro ao buscar horários públicos:', err);
                setError('Erro ao carregar horários. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchHorariosPublicos();
    }, []);

    const toggleAccordion = (modId) => {
        playClick();
        if (idAberto === modId) setIdAberto(null);
        else setIdAberto(modId);
    };

    const renderConteudo = () => {
        if (loading) {
            return <p className="horarios-status-text">Carregando horários...</p>;
        }
        if (error) {
            return <p className="horarios-status-text error">{error}</p>;
        }
        if (modalidadesComHorarios.length === 0) {
            return <p className="horarios-status-text">Nenhum horário disponível no momento.</p>;
        }
        
        return (
            <div className="horarios-acordeao">
                {modalidadesComHorarios.map((mod) => {
                    // === CORREÇÃO DA IMAGEM ===
                    // Usa imgCarrossel do banco + IP
                    const imgSrc = mod.imgCarrossel 
                        ? `${BASE_URL_IMG}${mod.imgCarrossel}` 
                        : `${BASE_URL_IMG}/images/gameon-logo.png`;

                    return (
                        <div key={mod._id} className="acordeao-item-horario">
                            <div 
                                className={`acordeao-header-horario ${idAberto === mod._id ? 'aberta' : ''}`}
                                onClick={() => toggleAccordion(mod._id)}
                            >
                                <img 
                                    src={imgSrc} 
                                    alt={mod.nome} 
                                    className="header-img-horario" 
                                    onError={(e)=>{e.target.src=`${BASE_URL_IMG}/images/gameon-logo.png`}}
                                />
                                <span className="header-titulo-horario">{mod.nome}</span>
                                <FaChevronDown />
                            </div>
                            
                            {idAberto === mod._id && (
                                <div className="acordeao-conteudo-horario">
                                    <table className="horarios-tabela">
                                        <thead>
                                            <tr>
                                                <th>Categoria</th>
                                                <th>Data</th>
                                                <th>Horário</th>
                                                <th>Local</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mod.horarios.map((jogo) => (
                                                <tr key={jogo._id}>
                                                    <td data-label="Categoria:">{jogo.categoria}</td>
                                                    <td data-label="Data:">{jogo.data}</td>
                                                    <td data-label="Horário:">{jogo.horario}</td>
                                                    <td data-label="Local:">{jogo.local}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="horarios-wrapper">
            <div className="horarios-container">
                <h1 className="horarios-titulo">Horários e Local dos Jogos</h1>
                <p className="horarios-subtitulo">
                    Clique em uma modalidade para ver os horários:
                </p>
                
                {renderConteudo()}
                
            </div>
        </div>
    );
};

export default Horarios;