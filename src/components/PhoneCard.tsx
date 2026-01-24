import { Link } from "react-router-dom";
import { Smartphone } from "lucide-react";
import { useCurrency, formatPrice } from "@/hooks/useCurrency";

interface PhoneCardProps {
  name: string;
  slug: string;
  currentPrice: number;
  originalPrice?: number | null;
  discount?: string | null;
  rating?: number | null;
  imageUrl?: string | null;
}

const PhoneCard = ({ name, slug, currentPrice, originalPrice, discount, rating, imageUrl }: PhoneCardProps) => {
  const { symbol, rate } = useCurrency();

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
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`flex flex-col items-center justify-center text-muted-foreground ${imageUrl ? 'hidden' : ''}`}>
            <Smartphone className="w-20 h-20 mb-2 opacity-40" />
            <span className="text-xs opacity-60">No image</span>
          </div>
          <div className="mt-4 border-t border-gray-700 pt-4">
          
          {/* Discount badge */}
          {discount && (
            <span className="absolute top-3 left-3 text-xs font-bold text-white bg-primary px-2 py-1 rounded-md">
              {discount}
            </span>
          )}
          
          {/* Rating badge */}
          {rating && (
            <span className="absolute top-3 right-3 text-xs font-medium text-foreground bg-background/80 px-2 py-1 rounded-md backdrop-blur-sm flex items-center gap-1">
              ⭐ {rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors">
            {name}
          </h3>
          
          {/* Price */}
         {/* --- Copy From Here --- */}
<div className="mt-4 pt-4 border-t border-gray-800">
  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
    
    {/* Display Spec */}
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <span className="text-blue-500">📱</span>
      <span className="truncate">{phone.display || 'Standard Display'}</span>
    </div>

    {/* Battery Spec */}
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <span className="text-green-500">🔋</span>
      <span className="truncate">{phone.battery || 'Long-lasting'}</span>
    </div>

    {/* Camera Spec */}
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <span className="text-purple-500">📸</span>
      <span className="truncate">{phone.camera || 'High Def'}</span>
    </div>

    {/* Storage/RAM Spec */}
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <span className="text-yellow-500">💾</span>
      <span className="truncate">{phone.storage} / {phone.ram}</span>
    </div>

  </div>
</div>
{/* --- End Copy --- */}
          <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity mt-2 block">
            View Details →
          </span>
        </div>
      </article>
    </Link>
  );
};

export default PhoneCard;
