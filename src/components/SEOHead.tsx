import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: "website" | "product";
  phone?: {
    name: string;
    price: number;
    image?: string;
    rating?: number;
    brand?: string;
  };
}

export const SEOHead = ({
  title,
  description,
  canonical,
  // Fix: Default to your site's own OG image
  image = "https://phone-insights-x.vercel.app/og-image.png",
  type = "website",
  phone,
}: SEOHeadProps) => {
  useEffect(() => {
    document.title = title;

    const updateMeta = (selector: string, attr: string, value: string, isProperty = false) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement(isProperty ? "meta" : selector.split('[')[0]);
        if (isProperty) el.setAttribute("property", attr);
        else if (selector.includes('name')) el.setAttribute("name", attr);
        else if (selector.includes('rel')) el.setAttribute("rel", attr);
        document.head.appendChild(el);
      }
      if (el instanceof HTMLMetaElement) el.content = value;
      if (el instanceof HTMLLinkElement) el.href = value;
    };

    updateMeta('meta[name="description"]', "description", description);
    updateMeta('meta[property="og:title"]', "og:title", title, true);
    updateMeta('meta[property="og:description"]', "og:description", description, true);
    updateMeta('meta[property="og:type"]', "og:type", type, true);
    updateMeta('meta[property="og:image"]', "og:image", image, true);
    
    // Fix: Updated to your actual Vercel URL
    const siteUrl = "https://phone-insights-x.vercel.app";
    const currentUrl = canonical || siteUrl;
    updateMeta('link[rel="canonical"]', "canonical", currentUrl);
    updateMeta('meta[property="og:url"]', "og:url", currentUrl, true);

    // Schema Logic
    let script = document.querySelector('#json-ld-schema') as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = "json-ld-schema";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    const schemaData = phone ? {
      "@context": "https://schema.org",
      "@type": "Product",
      name: phone.name,
      description: description,
      image: phone.image || image,
      brand: { "@type": "Brand", name: phone.brand || phone.name.split(" ")[0] },
      offers: {
        "@type": "Offer",
        priceCurrency: "PKR",
        price: phone.price,
        availability: "https://schema.org/InStock",
        url: currentUrl
      },
      ...(phone.rating && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: phone.rating,
          reviewCount: 85 // Fixed number is better for performance than Math.random
        }
      })
    } : {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Phone Insights",
      url: siteUrl,
      description: "Compare 416+ mobile specs and prices in Pakistan",
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };

    script.textContent = JSON.stringify(schemaData);

  }, [title, description, canonical, image, type, phone]);

  return null;
};
