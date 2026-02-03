import React from 'react';

const BenefitsSection = React.forwardRef(({ onWhatsAppClick }, ref) => {
  return (
    <section className="benefits-section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">Por qué elegirnos</span>
          <h2 className="section-title">
            Tu Negocio Merece<br />
            <span className="gradient-text">Resultados Reales</span>
          </h2>
        </div>

        <div className="benefits-grid">
          <div className="benefit-card" data-index="0">
            <div className="benefit-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M24 4L6 14v12c0 11.11 7.67 21.47 18 24 10.33-2.53 18-12.89 18-24V14L24 4zm0 8l14 7v9c0 8.63-5.63 16.71-14 19-8.37-2.29-14-10.37-14-19v-9l14-7z" fill="currentColor"/>
                <path d="M18 24l-4-4-2.83 2.83L18 29.66l14-14-2.83-2.83L18 24z" fill="currentColor"/>
              </svg>
            </div>
            <h3 className="benefit-title">Conversión Garantizada</h3>
            <p className="benefit-description">
              Landing pages optimizadas con psicología de conversión, diseño UX/UI premium y copywriting persuasivo que generan resultados desde el día uno.
            </p>
            <button 
              className="benefit-cta"
              onClick={() => onWhatsAppClick('benefit-conversion')}
            >
              Consultar ahora
              <span className="arrow">→</span>
            </button>
          </div>

          <div className="benefit-card" data-index="1">
            <div className="benefit-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M24 8c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16S32.837 8 24 8zm0 28c-6.627 0-12-5.373-12-12S17.373 12 24 12s12 5.373 12 12-5.373 12-12 12z" fill="currentColor"/>
                <circle cx="24" cy="24" r="6" fill="currentColor"/>
                <path d="M24 2C11.85 2 2 11.85 2 24s9.85 22 22 22 22-9.85 22-24S36.15 2 24 2zm0 40c-9.925 0-18-8.075-18-18S14.075 6 24 6s18 8.075 18 18-8.075 18-18 18z" fill="currentColor" opacity="0.3"/>
              </svg>
            </div>
            <h3 className="benefit-title">Facebook, Instagram y Google</h3>
            <p className="benefit-description">
              Campañas publicitarias en Facebook, Instagram y Google con targeting preciso, optimización diaria y estrategias probadas para maximizar tu inversión.
            </p>
            <button 
              className="benefit-cta"
              onClick={() => onWhatsAppClick('benefit-meta')}
            >
              Quiero más leads
              <span className="arrow">→</span>
            </button>
          </div>

          <div className="benefit-card" data-index="2">
            <div className="benefit-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M41 8H7c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h34c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4zM7 36V12h34v24H7z" fill="currentColor"/>
                <path d="M13 18h8v4h-8v-4zm0 8h16v4H13v-4zm22-8h6v12h-6V18z" fill="currentColor"/>
              </svg>
            </div>
            <h3 className="benefit-title">Medición Profesional</h3>
            <p className="benefit-description">
              Meta Pixel y Google Analytics 4 configurados correctamente. Dashboards en tiempo real para decisiones basadas en datos, no en intuición.
            </p>
            <button 
              className="benefit-cta"
              onClick={() => onWhatsAppClick('benefit-analytics')}
            >
              Ver métricas
              <span className="arrow">→</span>
            </button>
          </div>

          <div className="benefit-card" data-index="3">
            <div className="benefit-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M24 4L4 14v12c0 11.11 7.67 21.47 18 24 10.33-2.53 18-12.89 18-24V14L24 4z" fill="currentColor" opacity="0.2"/>
                <path d="M16 22l-2.83 2.83L22 33.66l16-16-2.83-2.83L22 28 16 22z" fill="currentColor"/>
                <path d="M38 14l-14-8L10 14v10c0 9.11 6.3 17.62 14 20 7.7-2.38 14-10.89 14-20V14zm-2 10c0 7.72-5.3 14.97-12 17-6.7-2.03-12-9.28-12-17v-8.3l12-6.85 12 6.85V24z" fill="currentColor"/>
              </svg>
            </div>
            <h3 className="benefit-title">Soporte Premium 24/7</h3>
            <p className="benefit-description">
              Equipo dedicado disponible cuando lo necesites. Optimizaciones continuas, ajustes en tiempo real y asesoramiento estratégico incluido.
            </p>
            <button 
              className="benefit-cta"
              onClick={() => onWhatsAppClick('benefit-support')}
            >
              Hablar con expertos
              <span className="arrow">→</span>
            </button>
          </div>
        </div>

        <div className="benefits-footer">
          <button 
            className="cta-button secondary"
            onClick={() => onWhatsAppClick('benefits-section')}
          >
            <span className="button-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="currentColor"/>
              </svg>
            </span>
            Agenda una Consultoría Gratuita
          </button>
        </div>
      </div>
    </section>
  );
});

export default BenefitsSection;