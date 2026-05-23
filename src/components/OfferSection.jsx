import React from 'react';

const OfferSection = React.forwardRef(({ onWhatsAppClick }, ref) => {
  return (
    <section className="offer-section" ref={ref}>
      <div className="container">
        <div className="offer-content">
          <div className="offer-badge">
            <span className="badge-pulse"></span>
            Oferta Limitada - Solo Marzo 2026
          </div>
          
          <h2 className="offer-title">
            Landing Page Premium<br />
            <span className="gradient-text">+ Meta Ads</span><br />
            Todo Incluido
          </h2>

          <div className="offer-features">
            <div className="feature-item">
              <svg className="check-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1"/>
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Landing Page optimizada para conversión</span>
            </div>
            <div className="feature-item">
              <svg className="check-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1"/>
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Configuración Meta Pixel + Google Analytics 4</span>
            </div>
            <div className="feature-item">
              <svg className="check-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1"/>
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Campaña Meta Ads lista para lanzar</span>
            </div>
            <div className="feature-item">
              <svg className="check-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1"/>
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Dashboard personalizado de métricas</span>
            </div>
            <div className="feature-item">
              <svg className="check-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1"/>
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Diseño responsive + optimización mobile</span>
            </div>
            <div className="feature-item">
              <svg className="check-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1"/>
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>30 días de optimización y soporte incluido</span>
            </div>
          </div>

          <div className="offer-pricing">
            <div className="price-container">
              <span className="price-label">Inversión Total</span>
              <div className="price-wrapper">
                <span className="price-currency">USD</span>
                <span className="price-amount">1000</span>
              </div>
              <span className="price-note">Pago único · Costo en publicidad no incluido</span>
            </div>

            <div className="bonus-container">
              <div className="bonus-badge">BONUS</div>
              <ul className="bonus-list">
                <li>✓ Copywriting persuasivo profesional</li>
                <li>✓ Estrategia de remarketing incluida</li>
                <li>✓ A/B Testing inicial configurado</li>
              </ul>
            </div>
          </div>

          <div className="offer-cta-group">
            <button 
              className="cta-button primary large"
              onClick={() => onWhatsAppClick('offer-main')}
            >
              <span className="button-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M7 3h7l4 4v14H7V3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M14 3v5h5M9.5 14l2 2 4-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Aplicar para trabajar juntos
            </button>

            <p className="guarantee-text">
              🛡️ Garantía de satisfacción · Resultados en 30/60 días
            </p>
          </div>

          <div className="urgency-footer">
            <div className="urgency-item">
              <span className="urgency-icon">⚡</span>
              <span>Solo 3 cupos disponibles este mes</span>
            </div>
            <div className="urgency-item">
              <span className="urgency-icon">🚀</span>
              <span>Entrega express</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default OfferSection;
