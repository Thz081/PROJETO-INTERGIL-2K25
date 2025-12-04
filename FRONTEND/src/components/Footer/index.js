import React from 'react';
import { FaInstagram } from 'react-icons/fa'; // Vamos usar um ícone!
import './style.css';

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Pega o ano atual automaticamente

  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-socials">
          {/* Link do Instagram (por enquanto, #) */}
          <a 
            href="https://www.instagram.com/ete.iburajordao/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-link"
            aria-label="Instagram do Intergil"
          >
            <FaInstagram />
          </a>
        </div>
        <p>ETE Advogado José David Gil Rodrigues</p>
        <p className="copyright">
          © {currentYear} INTERGIL 2K25 - Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
