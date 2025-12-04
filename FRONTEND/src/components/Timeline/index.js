import React from 'react';
import './style.css';
import { FaTrophy, FaInstagram } from 'react-icons/fa'; 

const Timeline = ({ items }) => {
  
  const renderContent = (item) => (
    <>
      {/* TAG DO ANO (Fica no topo no mobile) */}
      <span className="tag" style={{ 
          background: item.campeao === 'PANDEMIA' ? '#ccc' : '#ffd700', 
          color: '#000'
      }}>
        {item.campeao !== 'PANDEMIA' && <FaTrophy size={12} />} 
        {item.ano}
      </span>

      {/* WRAPPER FLEXÍVEL (Para alinhar Logo e Texto) */}
      <div className="campeao-info-mobile" style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '100%' }}>
          
          {/* LOGO */}
          {item.logo && item.campeao !== 'PANDEMIA' && (
            <div className="timeline-logo-wrapper">
                <img 
                    src={item.logo} 
                    alt={`Logo ${item.campeao}`} 
                    className="timeline-logo" 
                    onError={(e) => e.target.style.display = 'none'}
                />
            </div>
          )}

          {/* TEXTO */}
          <div className="timeline-text">
            {item.campeao === 'PANDEMIA' ? (
              <p className="timeline-campeao-pandemia">Não houve jogos</p>
            ) : (
              <h3 className="timeline-campeao">{item.campeao}</h3>
            )}
          </div>
      </div>

      {/* ÍCONE INSTA */}
      {item.instaUrl && item.instaUrl !== '#' && (
        <div className="timeline-insta-icon">
            <FaInstagram />
        </div>
      )}
    </>
  );

  return (
    <div className="timeline-container">
      <h2 className="timeline-titulo">HALL DA FAMA</h2>
      <div className="timeline">
        {items.map((item, index) => {
          const hasLink = item.instaUrl && item.instaUrl !== '#';
          const WrapperTag = hasLink ? 'a' : 'div';
          
          return (
            <div 
              key={index}
              className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'} ${item.campeao === 'PANDEMIA' ? 'item-pandemia' : ''}`}
            >
              <WrapperTag
                href={hasLink ? item.instaUrl : undefined}
                target={hasLink ? "_blank" : undefined}
                rel={hasLink ? "noopener noreferrer" : undefined}
                className={`timeline-content-wrapper ${hasLink ? 'clickable' : ''}`}
              >
                <div className="timeline-content">
                  {renderContent(item)}
                </div>
              </WrapperTag>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;