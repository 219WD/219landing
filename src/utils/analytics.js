export function trackEvent(name, params = {}) {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }

  if (typeof window.fbq === "function") {
    if (name === "whatsapp_click") {
      window.fbq("track", "Contact", params);
    } else {
      window.fbq("trackCustom", name, params);
    }
  }
}
