import React, { useRef, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
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
import ApplicationPage from "./ApplicationPage";
import ServicePage from "./ServicePage";
import { useScrollAnimation } from "./hooks/useScrollAnimation";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import "./App.css";

const LandingPage = () => {
  const heroRef = useRef(null);
  const benefitsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const navigate = useNavigate();

  // Log inicial
  useEffect(() => {
    console.log("🚀 App montada - 219Labs Landing Page");
    console.log("📱 User Agent:", navigator.userAgent);
    console.log("📐 Viewport:", window.innerWidth, "x", window.innerHeight);
  }, []);

  // Aplicar animaciones de scroll
  useScrollAnimation([heroRef, benefitsRef, testimonialsRef]);

  // Aplicar smooth scroll
  useSmoothScroll();

  // Envia las llamadas a accion al filtro de aplicacion.
  const handleWhatsAppClick = (section) => {
    console.log(`📱 Aplicacion click desde: ${section}`);
    navigate("/aplicar");

    // Google Analytics event (si está configurado)
    if (typeof window.gtag === "function") {
      window.gtag("event", "cta_click", {
        event_category: "engagement",
        event_label: section,
        method: "application",
      });
    }

    // Facebook Pixel event (si está configurado)
    if (typeof window.fbq === "function") {
      window.fbq("track", "Contact", {
        content_name: section,
        content_category: "application_click",
      });
    }
  };

  return (
    <div className="app">
      <HeroSection
        ref={heroRef}
        onWhatsAppClick={() => handleWhatsAppClick("hero")}
      />
      <ProblemSolution />
      <Services />
      <LandingOptions />
      <ProductsSection />
      <Benefits ref={benefitsRef} onWhatsAppClick={handleWhatsAppClick} />
      <ForWho />
      <TestimonialsSection
        ref={testimonialsRef}
        onWhatsAppClick={() => handleWhatsAppClick("testimonials")}
      />
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
  return (
    <>
      <SiteHeader />
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
      </Routes>
    </>
  );
};

export default App;
