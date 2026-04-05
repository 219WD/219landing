import FluidBackground   from './components/FluidBackground';
import Logo219           from './components/Logo219';
import HeroNav           from './components/HeroNav';
import HeroHeadline      from './components/HeroHeadline';
import HeroDescriptor    from './components/HeroDescriptor';
import HeroCTA           from './components/HeroCTA';
import { useHeroAnimations } from './hooks/useHeroAnimations.js';
import { COPY }          from './constants/theme';
import './styles/hero.css';

export default function Hero219Labs() {
  useHeroAnimations();

  return (
    <section className="hero" aria-label="Hero 219Labs">

      <FluidBackground />
      <div className="hero__vignette" aria-hidden="true" />

      <div className="hero__grid">

        {/* TOP-LEFT: logo */}
        <div className="hero__logo-area">
          <Logo219 />
          <div className="hero__logo-labels" aria-hidden="true">
            <span>{COPY.metaLeft}</span>
            <span>{COPY.metaRight}</span>
          </div>
        </div>

        {/* TOP-RIGHT: nav */}
        <HeroNav />

        {/* ROW-2 spacer */}
        <div className="hero__spacer" aria-hidden="true" />

        {/* BOTTOM-LEFT: subtitle */}
        <div className="hero__subtitle-area">
          <HeroDescriptor />
        </div>

        {/* BOTTOM-RIGHT: headline + CTA */}
        <div className="hero__main-area">
          <HeroHeadline />
          <HeroCTA />
        </div>

      </div>
    </section>
  );
}