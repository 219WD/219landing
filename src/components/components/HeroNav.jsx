import { NAV_LINKS } from '../constants/theme';

export default function HeroNav() {
  return (
    <nav className="hero-nav" aria-label="Navegación principal">
      <ul className="hero-nav__list">
        {NAV_LINKS.map(({ label, href }) => (
          <li key={href}>
            <a href={href} className="hero-nav__link">{label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}