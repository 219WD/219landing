import { Link, useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import "./service-page.css";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="sp-page sp-page--not-found">
      <section className="sp-hero">
        <div className="sp-orb" aria-hidden="true" />
        <div className="sp-hero__content">
          <span className="sp-eyebrow">404</span>
          <h1>
            Esta página no existe. <em>Pero podemos volver al camino.</em>
          </h1>
          <p>
            Puede que el enlace haya cambiado o que la dirección esté mal escrita.
            Desde acá podés volver al inicio o contarnos qué necesitás.
          </p>
          <div className="sp-actions">
            <Link to="/" className="sp-cta">
              <span>Volver al inicio</span>
            </Link>
            <Link to="/aplicar" className="sp-link">
              <span>Consultar con 219Labs</span>
            </Link>
          </div>
        </div>
      </section>
      <Footer onWhatsAppClick={() => navigate("/aplicar")} />
    </main>
  );
}
