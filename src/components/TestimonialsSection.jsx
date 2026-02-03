import React from "react";
import ColorUva from "../assets/coloruva.jpg";
import Albiero from "../assets/albiero.jpg";
import Canepa from "../assets/aclogo.png";

const TestimonialsSection = React.forwardRef(({ onWhatsAppClick }, ref) => {
  return (
    <section className="testimonials-section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">Casos de éxito</span>
          <h2 className="section-title">
            Resultados que
            <br />
            <span className="gradient-text">Hablan por Sí Mismos</span>
          </h2>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card" data-index="2">
            <div className="testimonial-header">
              <div className="testimonial-avatar">
                {/* Logo ColorUva */}
                <img 
                  src={ColorUva}
                  alt="ColorUva"
                  className="avatar-logo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="avatar-placeholder">ME</div>';
                  }}
                />
              </div>
              <div className="testimonial-info">
                <h4 className="testimonial-name">Maria Emilia</h4>
                <p className="testimonial-role">CEO, ColorUva</p>
              </div>
              <div className="testimonial-rating">
                <span>★★★★★</span>
              </div>
            </div>
            <blockquote className="testimonial-quote">
              "Empezamos de cero sin ventas en la web y ahora facturamos de
              forma estable. Ordenaron nuestro contenido y nos guiaron paso a
              paso en la creacion de contenido. Son muy atentos de todo lo que
              pasa en mi local."
            </blockquote>
            <div className="testimonial-metrics">
              <div className="metric">
                <span className="metric-value">68%</span>
                <span className="metric-label">Tasa Conv.</span>
              </div>
              <div className="metric">
                <span className="metric-value">5.8x</span>
                <span className="metric-label">ROAS</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card featured" data-index="1">
            <div className="featured-badge">★ Destacado</div>
            <div className="testimonial-header">
              <div className="testimonial-avatar">
                {/* Logo Albiero Seguridad */}
                <img 
                  src={Albiero}
                  alt="Albiero Seguridad"
                  className="avatar-logo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="avatar-placeholder">AZ</div>';
                  }}
                />
              </div>
              <div className="testimonial-info">
                <h4 className="testimonial-name">Alejandro Zambrizzi</h4>
                <p className="testimonial-role">Director, Albiero Seguridad</p>
              </div>
              <div className="testimonial-rating">
                <span>★★★★★</span>
              </div>
            </div>
            <blockquote className="testimonial-quote">
              "Nuestra presencia online se transformó completamente con Meta Ads
              y Google Ads. Pasamos de recibir apenas 10 consultas a más de 300
              leads mensuales. El crecimiento ha sido exponencial y constante
              cada mes."
            </blockquote>
            <div className="testimonial-metrics">
              <div className="metric">
                <span className="metric-value">+2900%</span>
                <span className="metric-label">Leads</span>
              </div>
              <div className="metric">
                <span className="metric-value">10 → 300</span>
                <span className="metric-label">Mensajes/Mes</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card" data-index="1">
            <div className="testimonial-header">
              <div className="testimonial-avatar">
                {/* Logo Canepa Peluquería */}
                <img 
                  src={Canepa}
                  alt="Canepa Peluquería"
                  className="avatar-logo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="avatar-placeholder">AC</div>';
                  }}
                />
              </div>
              <div className="testimonial-info">
                <h4 className="testimonial-name">Alejandro Canepa</h4>
                <p className="testimonial-role">Dueño, Canepa Peluquería</p>
              </div>
              <div className="testimonial-rating">
                <span>★★★★★</span>
              </div>
            </div>
            <blockquote className="testimonial-quote">
              "Creamos contenido desde cero logrando una presencia online
              sólida. Los resultados son claros: pasamos de cero a generar entre
              250 y 350 mensajes de clientas de calidad. La estrategia fue
              impecable."
            </blockquote>
            <div className="testimonial-metrics">
              <div className="metric">
                <span className="metric-value">250-350</span>
                <span className="metric-label">Mensajes de Clientas</span>
              </div>
              <div className="metric">
                <span className="metric-value">Desde 0</span>
                <span className="metric-label">Inicio</span>
              </div>
            </div>
          </div>
        </div>

        <div className="testimonials-cta">
          <p className="cta-text">¿Listo para resultados como estos?</p>
          <button className="cta-button primary" onClick={onWhatsAppClick}>
            <span className="button-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                  fill="currentColor"
                />
              </svg>
            </span>
            Sí, quiero estos resultados
          </button>
        </div>
      </div>
    </section>
  );
});

export default TestimonialsSection;