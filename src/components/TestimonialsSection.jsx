import React from "react";
import ColorUva from "../assets/coloruva.jpg";
import Albiero from "../assets/albiero.jpg";
import Canepa from "../assets/aclogo.png";

const TestimonialsSection = React.forwardRef(({ onWhatsAppClick }, ref) => {
  const testimonials = [
    {
      id: 1,
      name: "Maria Emilia",
      role: "CEO, ColorUva",
      quote: "Empezamos de cero sin ventas en la web y ahora facturamos de forma estable. Ordenaron nuestro contenido y nos guiaron paso a paso en la creacion de contenido. Son muy atentos de todo lo que pasa en mi local.",
      metrics: [
        { value: "68%", label: "Tasa Conv." },
        { value: "5.8x", label: "ROAS" }
      ],
      logo: ColorUva,
      logoAlt: "ColorUva",
      placeholder: "ME",
      url: "https://coloruva.com.ar/",
      urlLabel: "Visitar sitio web",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      ),
      featured: false
    },
    {
      id: 2,
      name: "Alejandro Zambrizzi",
      role: "Director, Albiero Seguridad",
      quote: "Nuestra presencia online se transformó completamente con Meta Ads y Google Ads. Pasamos de recibir apenas 10 consultas a más de 300 leads mensuales. El crecimiento ha sido exponencial y constante cada mes.",
      metrics: [
        { value: "+2900%", label: "Leads" },
        { value: "10 → 300", label: "Mensajes/Mes" }
      ],
      logo: Albiero,
      logoAlt: "Albiero Seguridad",
      placeholder: "AZ",
      url: "https://www.instagram.com/albieroseguridad.tuc/",
      urlLabel: "Ver Instagram",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      ),
      featured: true
    },
    {
      id: 3,
      name: "Alejandro Canepa",
      role: "Dueño, Canepa Peluquería",
      quote: "Creamos contenido desde cero logrando una presencia online sólida. Los resultados son claros: pasamos de cero a generar entre 250 y 350 mensajes de clientas de calidad. La estrategia fue impecable.",
      metrics: [
        { value: "250-350", label: "Mensajes de Clientas" },
        { value: "Desde 0", label: "Inicio" }
      ],
      logo: Canepa,
      logoAlt: "Canepa Peluquería",
      placeholder: "AC",
      url: "https://www.facebook.com/alejandrocanepapeluqueria1",
      urlLabel: "Visitar Facebook",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
      ),
      featured: false
    }
  ];

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
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className={`testimonial-card ${testimonial.featured ? 'featured' : ''}`}
              data-index={testimonial.id}
            >
              {testimonial.featured && <div className="featured-badge">★ Destacado</div>}
              
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <img 
                    src={testimonial.logo}
                    alt={testimonial.logoAlt}
                    className="avatar-logo"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<div class="avatar-placeholder">${testimonial.placeholder}</div>`;
                    }}
                  />
                </div>
                <div className="testimonial-info">
                  <h4 className="testimonial-name">{testimonial.name}</h4>
                  <p className="testimonial-role">{testimonial.role}</p>
                </div>
                <div className="testimonial-rating">
                  <span>★★★★★</span>
                </div>
              </div>
              
              <blockquote className="testimonial-quote">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="testimonial-metrics">
                {testimonial.metrics.map((metric, index) => (
                  <div key={index} className="metric">
                    <span className="metric-value">{metric.value}</span>
                    <span className="metric-label">{metric.label}</span>
                  </div>
                ))}
              </div>
              
              {/* Botón para visitar la página del cliente */}
              <a 
                href={testimonial.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="testimonial-link"
              >
                {testimonial.icon}
                <span>{testimonial.urlLabel}</span>
              </a>
            </div>
          ))}
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