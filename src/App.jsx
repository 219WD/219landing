import React, { useRef } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import HeroSection from "./components/HeroSection";
import Benefits from "./components/Benefits";
import TestimonialsSection from "./components/TestimonialsSection";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import ProblemSolution from "./components/ProblemSolution";
import Services from "./components/Services";
import ForWho from "./components/ForWho";
import FinalCTA from "./components/FinalCTA";
import LandingOptions from "./components/LandingOptions";
import ProductsSection from "./components/ProductsSection";
import ProcessFAQ from "./components/ProcessFAQ";
import SiteHeader from "./components/SiteHeader";
import SEO from "./components/SEO";
import ApplicationPage from "./ApplicationPage";
import AdminPage from "./AdminPage";
import ServicePage from "./ServicePage";
import NotFoundPage from "./NotFoundPage";
import { useScrollAnimation } from "./hooks/useScrollAnimation";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { trackEvent } from "./utils/analytics";
import "./App.css";

const conversionBlocks = {
  afterServices: {
    eyebrow: "Decisión simple",
    title: "Elegí el camino, o dejá que lo definamos juntos.",
    text: "No necesitás llegar con el brief perfecto. Con una consulta clara podemos separar prioridad, alcance y primer movimiento.",
    cta: "Hablar con 219Labs",
  },
  afterProducts: {
    eyebrow: "Producto + servicio",
    title: "Podemos usar lo que ya existe o construir lo que falta.",
    text: "219Shops, desarrollo a medida y nuevas líneas propias nos permiten proponer soluciones sin inventar desde cero cuando no hace falta.",
    cta: "Evaluar mi proyecto",
  },
  afterTestimonials: {
    eyebrow: "Prueba concreta",
    title: "Ya viste cómo trabajamos. Ahora bajémoslo a tu negocio.",
    text: "Podemos revisar tu caso y decirte si el próximo paso es presencia digital, campañas, sistema o automatización.",
    cta: "Aplicar con mi negocio",
  },
};

function HomeConversionCTA({ block, onClick }) {
  return (
    <section className="home-conversion" aria-label={block.eyebrow}>
      <div>
        <span>{block.eyebrow}</span>
        <h2>{block.title}</h2>
      </div>
      <p>{block.text}</p>
      <Link to="/aplicar" className="home-conversion__cta" onClick={onClick}>
        <span>{block.cta}</span>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </section>
  );
}

const LandingPage = () => {
  const heroRef = useRef(null);
  const benefitsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const navigate = useNavigate();

  // Aplicar animaciones de scroll
  useScrollAnimation([heroRef, benefitsRef, testimonialsRef]);

  // Aplicar smooth scroll
  useSmoothScroll();

  // Envia las llamadas a accion al filtro de aplicacion.
  const handleWhatsAppClick = (section) => {
    trackEvent("cta_click", {
      event_category: "engagement",
      event_label: section,
      destination: "/aplicar",
    });
    navigate("/aplicar");
  };

  return (
    <div className="app">
      <HeroSection
        ref={heroRef}
        onWhatsAppClick={() => handleWhatsAppClick("hero")}
      />
      <ProblemSolution />
      <Services />
      <HomeConversionCTA block={conversionBlocks.afterServices} onClick={() => handleWhatsAppClick("after-services")} />
      <LandingOptions />
      <ProductsSection />
      <HomeConversionCTA block={conversionBlocks.afterProducts} onClick={() => handleWhatsAppClick("after-products")} />
      <Benefits ref={benefitsRef} onWhatsAppClick={handleWhatsAppClick} />
      <ForWho />
      <TestimonialsSection
        ref={testimonialsRef}
        onWhatsAppClick={() => handleWhatsAppClick("testimonials")}
      />
      <HomeConversionCTA block={conversionBlocks.afterTestimonials} onClick={() => handleWhatsAppClick("after-testimonials")} />
      <ProcessFAQ />
      <FinalCTA
        ref={testimonialsRef}
        onWhatsAppClick={() => handleWhatsAppClick("testimonials")}
      />

      <Footer onWhatsAppClick={() => handleWhatsAppClick("footer")} />
      <FloatingWhatsApp
        onWhatsAppClick={() => handleWhatsAppClick("floating")}
      />
    </div>
  );
};

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <SEO />
      {!isAdminRoute && <SiteHeader />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/desarrollo" element={<ServicePage type="desarrollo" />} />
        <Route path="/desarrollo/paginas-web-landing-pages" element={<ServicePage type="paginas-web-landing-pages" />} />
        <Route path="/desarrollo/software-a-medida" element={<ServicePage type="software-a-medida" />} />
        <Route path="/desarrollo/tiendas-online-plataformas" element={<ServicePage type="tiendas-online-plataformas" />} />
        <Route path="/desarrollo/automatizaciones" element={<ServicePage type="automatizaciones" />} />
        <Route path="/desarrollo/integraciones" element={<ServicePage type="integraciones" />} />
        <Route path="/desarrollo/mantenimiento-mejoras" element={<ServicePage type="mantenimiento-mejoras" />} />
        <Route path="/desarrollo/dominios" element={<ServicePage type="dominios" />} />
        <Route path="/desarrollo/crm" element={<ServicePage type="crm" />} />
        <Route path="/marketing" element={<ServicePage type="marketing" />} />
        <Route path="/landing-pages" element={<ServicePage type="landing-pages" />} />
        <Route path="/productos" element={<ServicePage type="productos" />} />
        <Route path="/aplicar" element={<ApplicationPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
