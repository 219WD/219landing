import { Link } from "react-router-dom";
import AmbientOrb from "./AmbientOrb";
import { trackEvent } from "../utils/analytics";
import productMockup from "../assets/mockup1-cutout.png";
import "./products-section.css";

const PRODUCTS = [
  {
    name: "219Shops",
    logo: "https://www.219shops.com.ar/assets/logo-219shops-blanco-BecVQ_iw.png",
    logoClass: "pr-card__logo-img--shops",
    label: "Comercio online",
    status: "Producto activo",
    title: "Tu tienda online y tu negocio, en un solo lugar.",
    text: "Plataforma propia para vender, mostrar productos y administrar la operación comercial con más orden.",
    bullets: ["Tienda online", "Catálogo", "Pedidos", "Stock", "Cobros", "Envíos"],
    href: "https://www.219shops.com.ar/",
    external: true,
    cta: "Conocer 219Shops",
  },
  {
    name: "219Meds",
    logo: "https://219meds.vercel.app/assets/219Meds-CVPjGVlg.png",
    logoClass: "pr-card__logo-img--meds",
    label: "Salud",
    status: "Plataforma activa",
    title: "Gestión médica y farmacéutica en un solo sistema.",
    text: "Plataforma para consultorios y equipos de salud con pacientes, turnos, historias clínicas, stock, ventas, reportes y comunicación ordenada.",
    bullets: ["Turnos", "Historia clínica", "Pacientes", "Stock", "Ventas", "Reportes"],
    href: "https://219meds.vercel.app/",
    external: true,
    cta: "Ver 219Meds",
  },
];

export default function ProductsSection() {
  const trackProductClick = (product) => {
    trackEvent("product_outbound_click", {
      product: product.name,
      href: product.href,
      external: product.external,
    });
  };

  return (
    <section className="pr-section" id="productos" aria-label="Productos propios">
      <div className="pr-bg" aria-hidden="true" />
      <AmbientOrb side="left" top="45%" parallaxY={20} size="clamp(240px, 31vw, 440px)" />
      <div className="pr-inner">
        <div className="pr-header">
          <div className="pr-header__title">
            <span className="pr-eyebrow">Plataformas propias</span>
            <h2>
              No solo desarrollamos tecnología para otros.
              <em> También creamos la nuestra.</em>
            </h2>
          </div>
          <p>
            219Shops y 219Meds muestran cómo convertimos necesidades reales en plataformas con operación, diseño y tecnología funcionando.
          </p>
        </div>

        <div className="pr-feature">
          <div className="pr-feature__media">
            <img src={productMockup} alt="Mockup de tienda online desarrollada por 219Labs" loading="lazy" />
          </div>
          <div className="pr-feature__content">
            <span className="pr-eyebrow">Producto en acción</span>
            <h3>Una plataforma propia demuestra más que una promesa.</h3>
            <p>
              Cuando mostramos 219Shops hablamos de una solución real: diseño, catálogo, operación, cobros y administración pensados como producto.
            </p>
            <a
              href="https://www.219shops.com.ar/disenos"
              target="_blank"
              rel="noopener noreferrer"
              className="pr-card__cta"
              onClick={() => trackEvent("product_outbound_click", {
                product: "Diseños 219Shops",
                href: "https://www.219shops.com.ar/disenos",
                external: true,
              })}
            >
              <span>Ver diseños navegables</span>
              <Arrow />
            </a>
          </div>
        </div>

        <div className="pr-grid">
          {PRODUCTS.map((product, index) => {
            const content = (
              <>
                <span className="pr-card__index">0{index + 1}</span>
                <p className="pr-card__label">{product.label}</p>
                <p className="pr-card__status">{product.status}</p>
                <h3 className="pr-card__logo">
                  <img
                    src={product.logo}
                    alt={product.name}
                    className={product.logoClass}
                    loading="lazy"
                  />
                </h3>
                <h4>{product.title}</h4>
                <p>{product.text}</p>
                <ul>
                  {product.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </>
            );

            return (
              <article className="pr-card" key={product.name}>
                {content}
                {product.external ? (
                  <a
                    href={product.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pr-card__cta"
                    onClick={() => trackProductClick(product)}
                  >
                    <span>{product.cta}</span>
                    <Arrow />
                  </a>
                ) : (
                  <Link
                    to={product.href}
                    className="pr-card__cta"
                    onClick={() => trackProductClick(product)}
                  >
                    <span>{product.cta}</span>
                    <Arrow />
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
