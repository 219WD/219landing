import AmbientOrb from "./AmbientOrb";
import "./products-section.css";

const PRODUCTS = [
  {
    name: "219Shops",
    label: "Comercio online",
    title: "Tu tienda online y tu negocio, en un solo lugar.",
    text: "Productos, pedidos, stock, cobros, envíos y clientes conectados para vender sin depender de herramientas sueltas.",
    href: "https://www.219shops.com.ar/",
    cta: "Conocer 219Shops",
  },
  {
    name: "219Meds",
    label: "Salud",
    title: "Tecnología para gestión médica y farmacéutica.",
    text: "Una plataforma propia para ordenar procesos del sector salud. La vamos a presentar con funciones validadas antes de empujarla fuerte.",
    href: "https://219meds.vercel.app/",
    cta: "Conocer 219Meds",
  },
];

export default function ProductsSection() {
  return (
    <section className="pr-section" id="productos" aria-label="Productos propios">
      <div className="pr-bg" aria-hidden="true" />
      <AmbientOrb side="left" top="45%" parallaxY={20} size="clamp(240px, 31vw, 440px)" />
      <div className="pr-inner">
        <div className="pr-header">
          <span className="pr-eyebrow">Plataformas propias</span>
          <h2>
            No solo desarrollamos tecnología para otros.
            <em> También creamos la nuestra.</em>
          </h2>
          <p>
            Estos productos muestran cómo pensamos, diseñamos y construimos soluciones completas para problemas reales.
          </p>
        </div>

        <div className="pr-grid">
          {PRODUCTS.map((product, index) => (
            <article className="pr-card" key={product.name}>
              <span className="pr-card__index">0{index + 1}</span>
              <p className="pr-card__label">{product.label}</p>
              <h3>{product.name}</h3>
              <h4>{product.title}</h4>
              <p>{product.text}</p>
              <a href={product.href} target="_blank" rel="noopener noreferrer" className="pr-card__cta">
                <span>{product.cta}</span>
                <Arrow />
              </a>
            </article>
          ))}
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
