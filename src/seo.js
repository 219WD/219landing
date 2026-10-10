const SITE_URL = "https://219labs.com.ar";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.svg`;

const base = {
  title: "219Labs | Marketing Digital y Desarrollo de Software",
  description:
    "Creamos páginas web, software a medida, campañas publicitarias y contenido para que tu negocio tenga herramientas reales para crecer.",
};

export const SEO_BY_PATH = {
  "/": {
    ...base,
    path: "/",
  },
  "/desarrollo": {
    title: "Desarrollo y tecnología | 219Labs",
    description:
      "Páginas web, tiendas online, software a medida, automatizaciones, integraciones, dominios y mantenimiento para negocios.",
    path: "/desarrollo",
  },
  "/desarrollo/paginas-web-landing-pages": {
    title: "Páginas web y landing pages | 219Labs",
    description:
      "Creamos páginas web y landing pages con plantillas profesionales personalizables o desarrollo completamente a medida.",
    path: "/desarrollo/paginas-web-landing-pages",
  },
  "/desarrollo/software-a-medida": {
    title: "Software a medida | 219Labs",
    description:
      "Desarrollamos sistemas internos, paneles, herramientas y procesos digitales para la forma real en la que trabaja tu negocio.",
    path: "/desarrollo/software-a-medida",
  },
  "/desarrollo/tiendas-online-plataformas": {
    title: "Tiendas online y plataformas | 219Labs",
    description:
      "Soluciones comerciales para vender online, administrar productos, recibir pedidos y conectar mejor la operación del negocio.",
    path: "/desarrollo/tiendas-online-plataformas",
  },
  "/desarrollo/automatizaciones": {
    title: "Automatizaciones | 219Labs",
    description:
      "Automatizamos consultas, formularios, avisos, datos y tareas repetitivas para que tu equipo trabaje con más orden.",
    path: "/desarrollo/automatizaciones",
  },
  "/desarrollo/integraciones": {
    title: "Integraciones | 219Labs",
    description:
      "Conectamos herramientas, pagos, formularios, analítica, tiendas y sistemas para evitar datos duplicados o dispersos.",
    path: "/desarrollo/integraciones",
  },
  "/desarrollo/mantenimiento-mejoras": {
    title: "Mantenimiento y mejoras | 219Labs",
    description:
      "Acompañamos páginas, sistemas y plataformas con correcciones, mejoras evolutivas, soporte y optimización.",
    path: "/desarrollo/mantenimiento-mejoras",
  },
  "/desarrollo/dominios": {
    title: "Dominios | 219Labs",
    description:
      "Vendemos, configuramos y gestionamos dominios para conectar tu web, correo y herramientas digitales de forma ordenada.",
    path: "/desarrollo/dominios",
  },
  "/desarrollo/crm": {
    title: "CRM para negocios | 219Labs",
    description:
      "Estamos preparando soluciones CRM y podemos relevar tu proceso comercial para ordenar leads, clientes y oportunidades.",
    path: "/desarrollo/crm",
  },
  "/marketing": {
    title: "Marketing y contenido | 219Labs",
    description:
      "Campañas publicitarias, contenido, reels, diseño, gestión de redes y estrategia para que más personas entiendan tu marca.",
    path: "/marketing",
  },
  "/landing-pages": {
    title: "Landing pages | 219Labs",
    description:
      "Landing pages con plantilla o a medida para presentar tu negocio, explicar tu oferta y recibir consultas.",
    path: "/desarrollo/paginas-web-landing-pages",
    robots: "noindex, follow",
  },
  "/productos": {
    title: "Productos digitales | 219Labs",
    description:
      "Plataformas propias de 219Labs, como 219Shops, y productos digitales creados para resolver problemas concretos.",
    path: "/productos",
  },
  "/aplicar": {
    title: "Consultar presupuesto | 219Labs",
    description:
      "Contanos qué necesitás y vemos si 219Labs puede ayudarte con marketing, desarrollo, páginas web, sistemas o dominios.",
    path: "/aplicar",
    robots: "noindex, follow",
  },
};

export const PUBLIC_PATHS = Object.values(SEO_BY_PATH)
  .filter((item) => item.robots !== "noindex, follow")
  .map((item) => item.path);

export function getSeoForPath(pathname) {
  return SEO_BY_PATH[pathname] || {
    title: "Página no encontrada | 219Labs",
    description: "La página que estás buscando no existe o cambió de lugar.",
    path: pathname,
    robots: "noindex, follow",
  };
}

export function absoluteUrl(path) {
  if (!path || path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path}`;
}

export function getDefaultImage() {
  return DEFAULT_IMAGE;
}
