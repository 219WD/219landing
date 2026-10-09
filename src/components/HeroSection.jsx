import { useState, useCallback } from "react";
import FluidBackground from "./components/FluidBackground";
import HeroHeadline from "./components/HeroHeadline";
import HeroDescriptor from "./components/HeroDescriptor";
import HeroCTA from "./components/HeroCTA";
import HeroPreloader from "./HeroPreloader.jsx";
import { useHeroAnimations } from "./hooks/useHeroAnimations.js";
import "./styles/hero.css";

const ENABLE_HERO_PRELOADER = false;

export default function Hero219Labs({ onWhatsAppClick }) {
  const [ready, setReady] = useState(!ENABLE_HERO_PRELOADER);

  // useCallback para estabilizar la referencia (evita re-renders del preloader)
  const handlePreloaderDone = useCallback(() => setReady(true), []);

  // Las animaciones UI arrancan solo cuando ready === true
  useHeroAnimations(ready);

  return (
    <>
      {ENABLE_HERO_PRELOADER && (
        <HeroPreloader onDone={handlePreloaderDone} />
      )}

      <section
        className={`hero${ready ? "" : " hero--preloading"}`}
        aria-label="Hero 219Labs"
      >
        {/* Fluid ya corre desde el montaje, pero queda tapado por el telón */}
        <FluidBackground />
        <div className="hero__vignette" aria-hidden="true" />

        <div className="hero__grid">
          <div className="hero__spacer" aria-hidden="true" />

          <div className="hero__subtitle-area">
            <HeroDescriptor />
          </div>

          <div className="hero__main-area">
            <HeroHeadline />
            <HeroCTA onWhatsAppClick={onWhatsAppClick} />
          </div>
        </div>
      </section>
    </>
  );
}
