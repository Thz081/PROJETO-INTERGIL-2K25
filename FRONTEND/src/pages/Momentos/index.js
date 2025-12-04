import React, { useState, useEffect } from 'react';
import api from '../../api';
import './style.css';
import { FaImage } from 'react-icons/fa';

// SEU IP DE HOJE (Se mudar amanhã, atualize aqui)
const BASE_URL_IMG = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const Momentos = () => {
  const [momentos, setMomentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMomentos = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/momentos');
        setMomentos(data);
      } catch (err) {
        setError('Erro ao carregar os momentos.');
      } finally {
        setLoading(false);
      }
    };
    fetchMomentos();
  }, []);

  return (
    <div className="momentos-wrapper">
      <div className="momentos-container">
        <h1 className="momentos-titulo"><FaImage /> Momentos do Intergil</h1>
        <p className="momentos-subtitulo">
          Os registros mais marcantes do nosso evento.
        </p>

        {loading && <h2 className="momentos-loading">Carregando mídias...</h2>}
        {error && <h2 className="momentos-loading error">{error}</h2>}

        <div className="momentos-grid">
          {!loading && momentos.length === 0 && !error && (
            <p className="momentos-subtitulo" style={{ gridColumn: '1 / -1' }}>
              Nenhum momento cadastrado ainda. Volte em breve!
            </p>
          )}

          {momentos.map((item) => {
            let mediaUrl = item.url;
            
            // === LÓGICA SIMPLIFICADA E CORRETA ===
            // Se NÃO for link externo (http...), é arquivo nosso
            if (mediaUrl && !mediaUrl.startsWith('http')) {
                // Garante que começa com / (ex: /arquivos/foto.png)
                const cleanPath = mediaUrl.startsWith('/') ? mediaUrl : `/${mediaUrl}`;
                // Monta a URL completa com o IP
                mediaUrl = `${BASE_URL_IMG}${cleanPath}`;
            }

            return (
              <div key={item._id} className="momento-card">
                {item.tipo === 'video' ? (
                  <div className="momento-video-wrapper">
                    <iframe
                      src={mediaUrl}
                      title={item.titulo}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <img 
                    src={mediaUrl} 
                    alt={item.titulo} 
                    className="momento-imagem" 
                    onError={(e) => { e.target.src = `${BASE_URL_IMG}/images/gameon-logo.png`; }} // Fallback
                  />
                )}
                <p className="momento-legenda">{item.titulo}</p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Momentos;