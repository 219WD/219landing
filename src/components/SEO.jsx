import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { absoluteUrl, getDefaultImage, getDefaultImageAlt, getSeoForPath, getSiteUrl } from "../seo";

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function upsertLink(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function upsertJsonLd(id, payload) {
  let element = document.head.querySelector(`script[type="application/ld+json"][data-seo="${id}"]`);
  if (!element) {
    element = document.createElement("script");
    element.type = "application/ld+json";
    element.dataset.seo = id;
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(payload);
}

export default function SEO() {
  const location = useLocation();

  useEffect(() => {
    const seo = getSeoForPath(location.pathname);
    const canonical = absoluteUrl(seo.path);
    const image = seo.image || getDefaultImage();
    const imageAlt = seo.imageAlt || getDefaultImageAlt();
    const siteUrl = getSiteUrl();

    document.title = seo.title;

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: seo.description,
    });
    upsertMeta('meta[name="keywords"]', {
      name: "keywords",
      content: seo.keywords || "",
    });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: seo.robots || "index, follow",
    });
    upsertMeta('meta[name="author"]', {
      name: "author",
      content: "219Labs",
    });
    upsertMeta('meta[name="geo.region"]', {
      name: "geo.region",
      content: "AR-T",
    });
    upsertMeta('meta[name="geo.placename"]', {
      name: "geo.placename",
      content: "San Miguel de Tucumán, Tucumán, Argentina",
    });
    upsertMeta('meta[name="geo.position"]', {
      name: "geo.position",
      content: "-26.8241;-65.2226",
    });
    upsertMeta('meta[name="ICBM"]', {
      name: "ICBM",
      content: "-26.8241, -65.2226",
    });
    upsertLink('link[rel="canonical"]', {
      rel: "canonical",
      href: canonical,
    });
    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonical,
    });
    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: seo.title,
    });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: seo.description,
    });
    upsertMeta('meta[property="og:image"]', {
      property: "og:image",
      content: image,
    });
    upsertMeta('meta[property="og:image:secure_url"]', {
      property: "og:image:secure_url",
      content: image,
    });
    upsertMeta('meta[property="og:image:type"]', {
      property: "og:image:type",
      content: "image/png",
    });
    upsertMeta('meta[property="og:image:width"]', {
      property: "og:image:width",
      content: "1200",
    });
    upsertMeta('meta[property="og:image:height"]', {
      property: "og:image:height",
      content: "630",
    });
    upsertMeta('meta[property="og:image:alt"]', {
      property: "og:image:alt",
      content: imageAlt,
    });
    upsertMeta('meta[property="og:locale"]', {
      property: "og:locale",
      content: "es_AR",
    });
    upsertMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: "219Labs",
    });
    upsertMeta('meta[name="twitter:url"]', {
      name: "twitter:url",
      content: canonical,
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: seo.title,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: seo.description,
    });
    upsertMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: image,
    });
    upsertMeta('meta[name="twitter:image:alt"]', {
      name: "twitter:image:alt",
      content: imageAlt,
    });

    upsertJsonLd("page", {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: seo.title,
      description: seo.description,
      inLanguage: "es-AR",
      isPartOf: {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "219Labs",
        url: siteUrl,
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: image,
        width: 1200,
        height: 630,
      },
    });
  }, [location.pathname]);

  return null;
}
