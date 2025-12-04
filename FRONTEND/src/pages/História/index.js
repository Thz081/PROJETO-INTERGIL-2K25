import React, { useState, useEffect } from 'react';
import './style.css'; 
import Timeline from '../../components/Timeline'; 
import { FaInstagram, FaEnvelope } from 'react-icons/fa';
import api from '../../api'; 

// === CONFIGURAÇÃO CRÍTICA PARA O CELULAR ===
// Se você mudar de Wi-Fi, lembre de atualizar esse IP!

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const profEli = {
  nome: 'Profª ELI BATISTA',
  instagram: 'https://www.instagram.com/elibatista5/',
  email: 'mailto:elisangela.bdsouza@professor.educacao.pe.gov.br'
};

const textoHistoria = `Projeto Criado e Idealizado pela Professora ELISANGELA BATISTA, que buscou como um dos principais motivos da criação deste evento o entretenimento, a educação, o trabalho em equipe e a competitividade.\n\nO Intergil tem um diferencial: é um projeto onde alunos, gestão e professores se unem em prol da educação, diversão e entretenimento, com todos contribuindo na organização e no respeito mútuo.\n\nO Intergil nasceu em 2016 e, até os dias atuais, vive sendo o evento favorito e mais aguardado do ano!`;

const Historia = () => {
  const [campeoes, setCampeoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHall = async () => {
      try {
        // A rota /hall é pública (definida no api.routes.js)
        const res = await api.get('/hall'); 
        
        const formattedData = res.data.map(item => {
            let logoFinal = '/images/gameon-logo.png'; // Fallback

            if (item.logo_path) {
                // Se o caminho vier do banco tipo "/uploads/foto.png", a gente junta com o IP
                // O replace garante que não fique barra duplicada
                const pathLimpo = item.logo_path.startsWith('/') ? item.logo_path : `/${item.logo_path}`;
                logoFinal = `${BASE_URL}${pathLimpo}`;
            }

            return {
                ano: item.ano.toString(),
                campeao: item.turma,
                logo: logoFinal, // URL completa (http://192...) para o celular entender
                instaUrl: (item.instagram && item.instagram.length > 5) ? item.instagram : null 
            };
        });

        setCampeoes(formattedData);
      } catch (error) {
        console.error("Erro ao buscar Hall da Fama:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHall();
  }, []);

  return (
    <div className="historia-container">
      <div className="historia-origem">
        <h1 className="historia-titulo-pagina">A ORIGEM</h1>
        {textoHistoria.split('\n\n').map((paragrafo, index) => (
          <p key={index} className="historia-paragrafo">{paragrafo}</p>
        ))}
      </div>

      {loading ? (
        <div className="loading-container">
            <p>Carregando a História...</p>
        </div>
      ) : (
        campeoes.length > 0 ? (
            <Timeline items={campeoes} />
        ) : (
            <div style={{textAlign: 'center', padding: '40px', color: 'var(--text-secondary)'}}>
                <p>Nenhum registro histórico encontrado ainda.</p>
            </div>
        )
      )}

      <div className="historia-contato">
        <h2 className="contato-titulo">Idealizadora do Projeto</h2>
        <p className="contato-nome">{profEli.nome}</p>
        <div className="contato-links">
          <a href={profEli.instagram} target="_blank" rel="noopener noreferrer" className="contato-btn">
            <FaInstagram size={20} /> Instagram
          </a>
          <a href={profEli.email} target="_blank" rel="noopener noreferrer" className="contato-btn btn-email">
            <FaEnvelope size={20} /> Email
          </a>
        </div>
      </div>
    </div>
  );
};

export default Historia;