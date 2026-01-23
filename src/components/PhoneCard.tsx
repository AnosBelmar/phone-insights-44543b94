import { Link } from "react-router-dom";
import { Smartphone } from "lucide-react";

interface PhoneCardProps {
  name: string;
  brand: string;
  slug: string;
  price: number;
  imageUrl?: string | null;
  ram?: string | null;
  storage?: string | null;
}

const PhoneCard = ({ name, brand, slug, price, imageUrl, ram, storage }: PhoneCardProps) => {
  return (
    <Link to={`/phone/${slug}`} className="block">
      <article className="card-premium group">
        {/* Image Container */}
        <div className="aspect-square bg-secondary/30 flex items-center justify-center p-6 relative overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Smartphone className="w-20 h-20 mb-2 opacity-40" />
              <span className="text-xs opacity-60">No image</span>
            </div>
          )}
          
          {/* Brand badge */}
          <span className="absolute top-3 left-3 text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded-md backdrop-blur-sm">
            {brand}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
          
          {/* Quick specs */}
          {(ram || storage) && (
            <p className="text-sm text-muted-foreground mb-3">
              {[ram, storage].filter(Boolean).join(" · ")}
            </p>
          )}
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="price-tag">${price.toLocaleString()}</span>
            <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              View Details →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PhoneCard;
