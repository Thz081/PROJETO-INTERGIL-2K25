import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import api from '../../api'; // <--- IMPORTANTE: Usar API, não arquivo estático
import './style.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useAudio } from '../../context/AudioContext';

// IP PARA IMAGENS (Ajuste conforme seu dia)
const BASE_URL_IMG = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function PrevArrow(props) {
  const { className, style, onClick } = props;
  const { playClick } = useAudio();
  const handleClick = () => { if (onClick) onClick(); playClick(); };
  return (
    <div className={`${className} custom-arrow prev-arrow`} style={{ ...style }} onClick={handleClick}>
      <FaChevronLeft />
    </div>
  );
}

function NextArrow(props) {
  const { className, style, onClick } = props;
  const { playClick } = useAudio();
  const handleClick = () => { if (onClick) onClick(); playClick(); };
  return (
    <div className={`${className} custom-arrow next-arrow`} style={{ ...style }} onClick={handleClick}>
      <FaChevronRight />
    </div>
  );
}

const useSlidesToShow = () => {
  const [slidesToShow, setSlidesToShow] = useState(5);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) setSlidesToShow(3);
      else if (window.innerWidth <= 768) setSlidesToShow(1);
      else setSlidesToShow(5);
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return slidesToShow;
};

const ModalidadesCarousel = () => {
  const [modalidades, setModalidades] = useState([]); // Estado para dados da API
  const slides = useSlidesToShow();

  // BUSCA DO BANCO (Substitui o import estático)
  useEffect(() => {
    const fetchModalidades = async () => {
      try {
        const { data } = await api.get('/modalidades');
        setModalidades(data.filter(m => m));
      } catch (error) {
        console.error("Erro ao buscar modalidades", error);
      }
    };
    fetchModalidades();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: slides,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  if (modalidades.length === 0) return <div className="carousel-loading">Carregando Arenas...</div>;

  return (
    <div className="carousel-container">
      <h2>ARENAS DE BATALHA</h2>
      <Slider {...settings} key={slides}>
        {modalidades.map((mod) => (
          <Link to={`/modalidade/${mod.slug}`} key={mod._id} className="card-container">
            <div className="mod-card">
              {/* === AQUI A MUDANÇA: IMAGEM DO BANCO === */}
              <img 
                src={mod.imgCarrossel ? `${BASE_URL_IMG}${mod.imgCarrossel}` : `${BASE_URL_IMG}/images/gameon-logo.png`} 
                alt={mod.nome} 
                className="card-image"
                onError={(e)=>{e.target.onerror = null; e.target.src="/images/gameon-logo.png"}}
              />
              <div className="card-overlay">
                <h3>{mod.nome}</h3>
              </div>
            </div>
          </Link>
        ))}
      </Slider>
    </div>
  );
};

export default ModalidadesCarousel;