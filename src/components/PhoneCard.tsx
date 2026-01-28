import { Link } from "react-router-dom";
import { Smartphone, Star, Zap, Cpu, Battery } from "lucide-react";
import { useCurrency, formatPrice } from "@/hooks/useCurrency";
import { useState } from "react";

interface PhoneCardProps {
  name: string;
  slug: string;
  currentPrice: number;
  imageUrl?: string;
  rating?: number;
  ram?: string;
  storage?: string;
  battery?: string;
  processor?: string;
}

const PhoneCard = (phone: PhoneCardProps) => {
  const { symbol, rate } = useCurrency();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Generate a fallback image URL using a placeholder service
  const fallbackImage = `https://placehold.co/400x400/1a1f2e/3ecf8e?text=${encodeURIComponent(phone.name.split(' ').slice(0, 2).join(' '))}`;

  return (
    <Link to={`/phone/${phone.slug}`} className="block h-full group perspective-1000">
      <article className="card-premium h-full flex flex-col bg-card border border-border hover:border-primary/40 transition-all duration-500 overflow-hidden rounded-2xl relative transform-gpu hover:scale-[1.02] hover:-rotate-y-1">
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Image Section */}
        <div className="aspect-[4/3] bg-gradient-to-br from-secondary/50 to-secondary/20 flex items-center justify-center p-6 relative overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(158,64%,52%,0.1),transparent_50%)]" />
          </div>
          
          {!imageError && phone.imageUrl ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              )}
              <img
                src={phone.imageUrl}
                alt={phone.name}
                loading="lazy"
                className={`w-full h-full object-contain transition-all duration-500 group-hover:scale-110 relative z-10 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </>
          ) : (
            <img
              src={fallbackImage}
              alt={phone.name}
              loading="lazy"
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 relative z-10"
            />
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-grow relative">
          <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3 font-display">
            {phone.name}
          </h3>
          
          {/* Quick Specs with icons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {phone.ram && (
              <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">
                <Zap className="w-3 h-3" />
                {phone.ram}
              </span>
            )}
            {phone.storage && (
              <span className="inline-flex items-center gap-1 text-xs bg-secondary/70 text-muted-foreground px-2.5 py-1 rounded-full">
                <Cpu className="w-3 h-3" />
                {phone.storage}
              </span>
            )}
            {phone.battery && (
              <span className="inline-flex items-center gap-1 text-xs bg-secondary/70 text-muted-foreground px-2.5 py-1 rounded-full">
                <Battery className="w-3 h-3" />
                {phone.battery}
              </span>
            )}
          </div>
          
          {/* Rating */}
          {phone.rating && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-3.5 h-3.5 ${star <= Math.round(phone.rating!) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} 
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-foreground">{phone.rating.toFixed(1)}</span>
            </div>
          )}
          
          {/* Price with animated underline */}
          <div className="mt-auto pt-3 border-t border-border/50">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              {formatPrice(phone.currentPrice, symbol, rate)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PhoneCard;