import { useState, useCallback } from "react";
import FluidBackground from "./components/FluidBackground";
import Logo219 from "./components/Logo219";
import HeroNav from "./components/HeroNav";
import HeroHeadline from "./components/HeroHeadline";
import HeroDescriptor from "./components/HeroDescriptor";
import HeroCTA from "./components/HeroCTA";
import HeroPreloader from "./HeroPreloader.jsx";
import { useHeroAnimations } from "./hooks/useHeroAnimations.js";
import { COPY } from "./constants/theme";
import "./styles/hero.css";

export default function Hero219Labs() {
  const [ready, setReady] = useState(false);

  // useCallback para estabilizar la referencia (evita re-renders del preloader)
  const handlePreloaderDone = useCallback(() => setReady(true), []);

  // Las animaciones UI arrancan solo cuando ready === true
  useHeroAnimations(ready);

  return (
    <>
      {/* Telón — se monta encima de todo y sube solo */}
      <HeroPreloader onDone={handlePreloaderDone} />

      <section
        className={`hero${ready ? "" : " hero--preloading"}`}
        aria-label="Hero 219Labs"
      >
        {/* Fluid ya corre desde el montaje, pero queda tapado por el telón */}
        <FluidBackground />
        <div className="hero__vignette" aria-hidden="true" />

        <div className="hero__grid">
          <div className="hero__logo-area">
            <Logo219 />
            <div className="hero__logo-labels" aria-hidden="true">
              <span>{COPY.metaLeft}</span>
              <span>{COPY.metaRight}</span>
            </div>
          </div>

          <HeroNav />

          <div className="hero__spacer" aria-hidden="true" />

          <div className="hero__subtitle-area">
            <HeroDescriptor />
          </div>

          <div className="hero__main-area">
            <HeroHeadline />
            <HeroCTA />
          </div>
        </div>
      </section>
    </>
  );
}
