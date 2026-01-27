import { Link } from "react-router-dom";
import { Smartphone, Star } from "lucide-react";
import { useCurrency, formatPrice } from "@/hooks/useCurrency";

interface PhoneCardProps {
  name: string;
  slug: string;
  currentPrice: number;
  imageUrl?: string;
  rating?: number;
  ram?: string;
  storage?: string;
  battery?: string;
}

const PhoneCard = (phone: PhoneCardProps) => {
  const { symbol, rate } = useCurrency();

  return (
    <Link to={`/phone/${phone.slug}`} className="block h-full group">
      <article className="card-premium h-full flex flex-col bg-card border border-border hover:border-primary/40 transition-all duration-300 overflow-hidden rounded-xl">
        
        {/* Image Section */}
        <div className="aspect-[4/3] bg-secondary/30 flex items-center justify-center p-6 relative">
          {phone.imageUrl ? (
            <img
              src={phone.imageUrl}
              alt={phone.name}
              loading="lazy"
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`flex flex-col items-center justify-center text-muted-foreground ${phone.imageUrl ? 'hidden' : ''}`}>
            <Smartphone className="w-16 h-16 opacity-30" />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {phone.name}
          </h3>
          
          {/* Quick Specs */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {phone.ram && (
              <span className="text-xs bg-secondary/50 text-muted-foreground px-2 py-0.5 rounded">
                {phone.ram}
              </span>
            )}
            {phone.storage && (
              <span className="text-xs bg-secondary/50 text-muted-foreground px-2 py-0.5 rounded">
                {phone.storage}
              </span>
            )}
            {phone.battery && (
              <span className="text-xs bg-secondary/50 text-muted-foreground px-2 py-0.5 rounded">
                {phone.battery}
              </span>
            )}
          </div>
          
          {/* Rating */}
          {phone.rating && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-foreground">{phone.rating.toFixed(1)}</span>
            </div>
          )}
          
          {/* Price */}
          <div className="mt-auto">
            <span className="text-lg font-bold text-primary">
              {formatPrice(phone.currentPrice, symbol, rate)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PhoneCard;