import { Link } from "react-router-dom";
import { Smartphone, Battery, Camera, Cpu, Monitor } from "lucide-react";
import { useCurrency, formatPrice } from "@/hooks/useCurrency";

interface PhoneCardProps {
  name: string;
  slug: string;
  currentPrice: number;
  originalPrice?: number | null;
  discount?: string | null;
  rating?: number | null;
  imageUrl?: string | null;
  // Added the new "Attentive" spec properties
  display?: string | null;
  battery?: string | null;
  camera?: string | null;
  storage?: string | null;
  ram?: string | null;
}

const PhoneCard = ({ 
  name, 
  slug, 
  currentPrice, 
  originalPrice, 
  discount, 
  rating, 
  imageUrl,
  display,
  battery,
  camera,
  storage,
  ram 
}: PhoneCardProps) => {
  const { symbol, rate } = useCurrency();

  return (
    <Link to={`/phone/${slug}`} className="block transition-all duration-300">
      <article className="card-premium group h-full flex flex-col overflow-hidden border border-border hover:border-primary/50">
        
        {/* Image Container */}
        <div className="aspect-square bg-secondary/30 flex items-center justify-center p-6 relative overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              loading="lazy" // Improves "Smoothness" by not blocking main thread
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          
          <div className={`flex flex-col items-center justify-center text-muted-foreground ${imageUrl ? 'hidden' : ''}`}>
            <Smartphone className="w-16 h-16 mb-2 opacity-20" />
            <span className="text-[10px] uppercase tracking-widest opacity-40">No Image</span>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {discount && (
              <span className="text-[10px] font-bold text-white bg-primary px-2 py-1 rounded shadow-lg uppercase">
                {discount} OFF
              </span>
            )}
          </div>
          
          {rating && (
            <span className="absolute top-2 right-2 text-[10px] font-bold text-foreground bg-background/90 backdrop-blur-md px-2 py-1 rounded shadow-sm flex items-center gap-1 border border-border">
              ⭐ {rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-display font-bold text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {name}
          </h3>

          {/* Price Section */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-primary">
              {formatPrice(currentPrice, symbol, rate)}
            </span>
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through opacity-70">
                {formatPrice(originalPrice, symbol, rate)}
              </span>
            )}
          </div>

          {/* --- Attentive Specs Grid --- */}
          <div className="mt-auto pt-4 border-t border-border/50">
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              
              {/* Display */}
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Monitor className="w-3 h-3 text-blue-500" />
                <span className="truncate">{display || 'FHD+ Display'}</span>
              </div>

              {/* Battery */}
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Battery className="w-3 h-3 text-green-500" />
                <span className="truncate">{battery || '5000mAh'}</span>
              </div>

              {/* Camera */}
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Camera className="w-3 h-3 text-purple-500" />
                <span className="truncate">{camera || 'AI Camera'}</span>
              </div>

              {/* Memory */}
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Cpu className="w-3 h-3 text-yellow-500" />
                <span className="truncate">{storage}/{ram}</span>
              </div>

            </div>
          </div>

          <span className="text-[11px] text-primary font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-all duration-300 mt-4 translate-x-[-10px] group-hover:translate-x-0 block">
            View Specifications →
          </span>
        </div>
      </article>
    </Link>
  );
};

export default PhoneCard;
