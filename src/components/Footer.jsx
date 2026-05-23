import LogoFooter from '../assets/logo-blanco.png';

const SERVICES_TAGS = [
  'Marketing',
  'Desarrollo Web',
  'Software',
  'Automatización',
];

const Footer = ({ onWhatsAppClick }) => {
  return (
    <footer className="footer">
      <div className="container">

        <div className="footer-content">

          {/* ── Brand ── */}
          <div className="footer-brand">

            <div className="footer-logo-wrapper">
              <img
                src={LogoFooter}
                alt="219Labs"
                className="footer-logo-img"
              />
            </div>

            {/* Sistemas de captación */}
            <p className="footer-sistema">Sistemas de Captación</p>

            {/* Tags de servicios */}
            <div className="footer-tags">
              {SERVICES_TAGS.map((tag) => (
                <span key={tag} className="footer-tag">{tag}</span>
              ))}
            </div>

            <p className="footer-tagline">
              Diseñamos sistemas digitales que atraen personas<br />
              interesadas en lo que vendés y las convertimos en clientes.<br />
              Desde Tucumán para todo el país.
            </p>

            {/* Redes */}
            <div className="footer-social">
              <a href="https://linkedin.com/company/219labs" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" fill="currentColor"/>
                </svg>
              </a>
              <a href="https://instagram.com/219labs" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="currentColor"/>
                </svg>
              </a>
              <a href="https://facebook.com/219labs" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>

          {/* ── CTA ── */}
          <div className="footer-cta">
            <p className="footer-cta__label">¿Listo para empezar?</p>
            <button className="cta-button secondary" onClick={onWhatsAppClick}>
              <span className="button-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M7 3h7l4 4v14H7V3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M14 3v5h5M9.5 14l2 2 4-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Aplicar para trabajar juntos
            </button>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <p className="copyright">© 2026 219Labs. Todos los derechos reservados.</p>
          <p className="legal">Desarrollado con ❤️ en Argentina</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
