import { Link } from "react-router-dom";
import { formatPrice } from "@/hooks/useCurrency";
import { useCurrency } from "@/hooks/useCurrency";

interface PhoneCardProps {
  name: string;
  slug: string;
  current_price: number;
  image_url?: string;
  rating?: number;
  priority?: boolean;
}

const PhoneCard = ({ name, slug, current_price, image_url, rating, priority }: PhoneCardProps) => {
  const { symbol, rate } = useCurrency();
  
  return (
    <Link 
      to={`/phone/${slug}`}
      className="group bg-card border border-border rounded-xl p-3 md:p-4 hover:border-primary transition-all flex flex-col h-full"
    >
      <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-secondary/20 relative">
        <img 
          src={image_url || "/placeholder.png"} 
          alt={name} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
          // PERFORMANCE: Use 'eager' for priority images, 'lazy' for the rest
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      </div>
      <h3 className="font-bold text-sm md:text-base line-clamp-1 mb-1">{name}</h3>
      <div className="mt-auto">
        <p className="text-primary font-bold">{formatPrice(current_price, symbol, rate)}</p>
        {rating && <p className="text-[10px] text-muted-foreground mt-1">⭐ {rating.toFixed(1)}</p>}
      </div>
    </Link>
  );
};

export default PhoneCard;
