import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";
import Logo219 from "./components/Logo219";
import { COPY } from "./constants/theme";
import "./site-header.css";

const NAV_ITEMS = [
  { label: "Desarrollo", to: "/desarrollo" },
  { label: "Marketing", to: "/marketing" },
  { label: "Productos", to: "/productos" },
];

function AnimatedText({ label, className }) {
  return (
    <span className={className} aria-label={label}>
      {Array.from(label).map((letter, index) => (
        <span
          className={`${className}__char`}
          style={{ "--i": index }}
          aria-hidden="true"
          key={`${letter}-${index}`}
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </span>
  );
}

export default function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const lastFocusedRef = useRef(null);
  const linkRefs = useRef([]);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isCompactPage = location.pathname === "/aplicar";
  const isCompact = isScrolled || isCompactPage;
  const isActivePath = (to) => (
    to === "/"
      ? location.pathname === "/"
      : location.pathname === to || location.pathname.startsWith(`${to}/`)
  );
  const menuItems = useMemo(
    () => [
      ...NAV_ITEMS,
      isHome
        ? { label: "Contacto", href: "#contacto" }
        : { label: "Contacto", to: "/aplicar" },
    ],
    [isHome],
  );
  const desktopItems = useMemo(
    () => [
      ...NAV_ITEMS,
      isHome
        ? { label: "Contacto", href: "#contacto" }
        : { label: "Contacto", to: "/aplicar" },
    ],
    [isHome],
  );

  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > 48);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [location.pathname]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const ctx = gsap.context(() => {
      gsap.set(overlayRef.current, { autoAlpha: 1, pointerEvents: "auto" });
      gsap.set(panelRef.current, { yPercent: -105 });
      gsap.set(closeRef.current, { autoAlpha: 0, y: -10, rotate: -8 });
      gsap.set(linkRefs.current, { autoAlpha: 0, y: 34, scale: 0.96 });

      gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: () => closeRef.current?.focus(),
      })
        .to(panelRef.current, {
          yPercent: 0,
          duration: 0.62,
        })
        .to(closeRef.current, {
          autoAlpha: 1,
          y: 0,
          rotate: 0,
          duration: 0.24,
          ease: "power3.out",
        }, "-=0.28")
        .to(linkRefs.current, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.46,
          stagger: 0.075,
        }, "-=0.16");
    }, overlayRef);

    return () => ctx.revert();
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMenu();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = [
        closeRef.current,
        ...linkRefs.current,
      ].filter(Boolean);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  const openMenu = () => {
    lastFocusedRef.current = document.activeElement;
    linkRefs.current = [];
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    if (!isMenuOpen) return;

    gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        setIsMenuOpen(false);
        requestAnimationFrame(() => {
          lastFocusedRef.current?.focus?.();
        });
      },
    })
      .to(linkRefs.current.slice().reverse(), {
        autoAlpha: 0,
        y: -18,
        scale: 0.98,
        duration: 0.22,
        stagger: 0.035,
      })
      .to(closeRef.current, {
        autoAlpha: 0,
        y: -10,
        rotate: 8,
        duration: 0.18,
      }, "-=0.12")
      .to(panelRef.current, {
        yPercent: -105,
        duration: 0.48,
        ease: "power4.inOut",
      }, "-=0.04")
      .set(overlayRef.current, {
        autoAlpha: 0,
        pointerEvents: "none",
      });
  };

  const registerMenuLink = (element) => {
    if (element && !linkRefs.current.includes(element)) {
      linkRefs.current.push(element);
    }
  };

  return (
    <header className={`site-header${isCompact ? " site-header--compact" : ""}`}>
      <div className="site-header__inner">
        <Link to="/" className="site-header__brand" aria-label="Ir al inicio de 219Labs">
          <Logo219 />
          <div className="site-header__labels" aria-hidden="true">
            <span>{COPY.metaLeft}</span>
            <span>{COPY.metaRight}</span>
          </div>
        </Link>

        <nav className="site-header__nav hero-nav" aria-label="Navegación principal">
          <ul className="site-header__list hero-nav__list">
            {desktopItems.map((item, index) => (
              <li key={item.to || item.href}>
                {item.href ? (
                  <a href={item.href} className="site-header__link hero-nav__link">
                    <span className="site-header__link-index">0{index + 1}</span>
                    <AnimatedText label={item.label} className="site-header__text" />
                  </a>
                ) : (
                  <Link
                    to={item.to}
                    className="site-header__link hero-nav__link"
                    aria-current={isActivePath(item.to) ? "page" : undefined}
                  >
                    <span className="site-header__link-index">0{index + 1}</span>
                    <AnimatedText label={item.label} className="site-header__text" />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <button
          className={`site-header__burger${isMenuOpen ? " is-open" : ""}`}
          type="button"
          aria-label="Abrir menú"
          aria-expanded={isMenuOpen}
          onClick={openMenu}
        >
          <span />
          <span />
        </button>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu" ref={overlayRef} aria-modal="true" role="dialog">
          <div className="mobile-menu__panel" ref={panelRef}>
            <button
              className="mobile-menu__close"
              ref={closeRef}
              type="button"
              aria-label="Cerrar menú"
              onClick={closeMenu}
            >
              <span />
              <span />
            </button>

            <div className="mobile-menu__logo" aria-label="219Labs">
              <Logo219 />
            </div>

            <nav className="mobile-menu__nav" aria-label="Menú mobile">
              {menuItems.map((item, index) => (
                item.href ? (
                  <a
                    key={item.label}
                    ref={registerMenuLink}
                    href={item.href}
                    className="mobile-menu__link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mobile-menu__index">0{index + 1}</span>
                    <AnimatedText label={item.label} className="mobile-menu__text" />
                  </a>
                ) : (
                  <Link
                    key={item.to}
                    ref={registerMenuLink}
                    to={item.to}
                    className="mobile-menu__link"
                    aria-current={isActivePath(item.to) ? "page" : undefined}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mobile-menu__index">0{index + 1}</span>
                    <AnimatedText label={item.label} className="mobile-menu__text" />
                  </Link>
                )
              ))}
            </nav>

            <p className="mobile-menu__note">
              Marketing, desarrollo y tecnología para que tu negocio tenga herramientas reales para crecer.
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
