import { useEffect } from "react";

interface SEOOptions {
  title: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

const SITE_NAME = "StayVida";
const DEFAULT_DESCRIPTION =
  "StayVida — your one-stop platform for booking hotels and planning events across India. Find the perfect stay or venue today.";
const DEFAULT_OG_IMAGE = "https://stayvida.in/og-image.jpg";

/**
 * Sets the <title>, meta description, meta keywords, and Open Graph / Twitter
 * card tags for the current page. Call this once at the top of every page component.
 */
function usePageSEO({ title, description, keywords, ogImage }: SEOOptions) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const metaDesc = description ?? DEFAULT_DESCRIPTION;
    const metaOg = ogImage ?? DEFAULT_OG_IMAGE;

    // <title>
    document.title = fullTitle;

    // Helper to upsert a <meta> tag
    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        const [key, val] = selector.replace("meta[", "").replace("]", "").split("=");
        el.setAttribute(key.trim(), val.replace(/"/g, "").trim());
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', "content", metaDesc);
    if (keywords) setMeta('meta[name="keywords"]', "content", keywords);

    // Open Graph
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", metaDesc);
    setMeta('meta[property="og:image"]', "content", metaOg);
    setMeta('meta[property="og:type"]', "content", "website");

    // Twitter Card
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:description"]', "content", metaDesc);
    setMeta('meta[name="twitter:image"]', "content", metaOg);
  }, [title, description, keywords, ogImage]);
}

export default usePageSEO;
