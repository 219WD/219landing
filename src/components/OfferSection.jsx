import React from 'react';

const OfferSection = React.forwardRef(({ onWhatsAppClick }, ref) => {
  return (
    <section className="offer-section" ref={ref}>
      <div className="container">
        <div className="offer-content">
          <div className="offer-badge">
            <span className="badge-pulse"></span>
            Oferta Limitada - Solo Febrero 2026
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
                <span className="price-amount">500</span>
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
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="currentColor"/>
                </svg>
              </span>
              Empezar Ahora - WhatsApp
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