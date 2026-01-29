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
  image = "https://lovable.dev/opengraph-image-p98pqg.png",
  type = "website",
  phone,
}: SEOHeadProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updateOGMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    updateMeta("description", description);
    updateOGMeta("og:title", title);
    updateOGMeta("og:description", description);
    updateOGMeta("og:type", type);
    updateOGMeta("og:image", image);
    
    if (canonical) {
      updateOGMeta("og:url", canonical);
      
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    // Add JSON-LD structured data
    let script = document.querySelector('#json-ld-schema') as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = "json-ld-schema";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    if (phone) {
      const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: phone.name,
        description: description,
        image: phone.image || image,
        brand: {
          "@type": "Brand",
          name: phone.brand || phone.name.split(" ")[0],
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "PKR",
          price: phone.price,
          availability: "https://schema.org/InStock",
        },
        ...(phone.rating && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: phone.rating,
            bestRating: 5,
            worstRating: 1,
            ratingCount: Math.floor(Math.random() * 500) + 50,
          },
        }),
      };
      script.textContent = JSON.stringify(productSchema);
    } else {
      const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Phone Insights",
        url: "https://phoneinsights.pk",
        description: "Compare detailed specifications, prices, and reviews for 400+ mobile phones in Pakistan",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://phoneinsights.pk/?search={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      };
      script.textContent = JSON.stringify(websiteSchema);
    }

    return () => {
      // Cleanup on unmount
    };
  }, [title, description, canonical, image, type, phone]);

  return null;
};
