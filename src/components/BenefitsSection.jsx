import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldHalved, 
  faBullseye, 
  faChartLine, 
  faHeadset 
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import TextFloat from './TextFloat';

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
              <FontAwesomeIcon icon={faShieldHalved} size="3x" />
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
              <FontAwesomeIcon icon={faBullseye} size="3x" />
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
              <FontAwesomeIcon icon={faChartLine} size="3x" />
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
              <FontAwesomeIcon icon={faHeadset} size="3x" />
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
              <FontAwesomeIcon icon={faWhatsapp} size="lg" />
            </span>
            Agenda una Consultoría Gratuita
          </button>
        </div>
      </div>
    </section>
  );
});

export default BenefitsSection;