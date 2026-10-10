import { Link } from "react-router-dom";
import AmbientOrb from "./AmbientOrb";
import { trackEvent } from "../utils/analytics";
import productMockup from "../assets/mockup1-cutout.png";
import "./products-section.css";

const PRODUCTS = [
  {
    name: "219Shops",
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
    label: "Salud",
    status: "Comunicación a validar",
    title: "Tecnología para gestión médica y farmacéutica.",
    text: "Línea de producto orientada al sector salud. La presentamos con prudencia hasta validar módulos, alcance y estado comercial.",
    bullets: ["Sector salud", "Procesos internos", "Módulos a confirmar", "Comunicación responsable"],
    href: "/aplicar?servicio=productos",
    external: false,
    cta: "Consultar estado",
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
            219Shops ya funciona como prueba concreta de producto. Otras líneas se comunican solo cuando el alcance está claro y validado.
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
                <h3>{product.name}</h3>
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
