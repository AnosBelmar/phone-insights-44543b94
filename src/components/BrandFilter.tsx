import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface BrandFilterProps {
  brands: string[];
  selectedBrand: string | null;
  onBrandSelect: (brand: string | null) => void;
}

const BrandFilter = ({ brands, selectedBrand, onBrandSelect }: BrandFilterProps) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={() => onBrandSelect(null)}
        className={cn(
          "brand-chip flex items-center gap-2 group",
          selectedBrand === null && "active"
        )}
      >
        <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
        All Brands
      </button>
      {brands.map((brand) => (
        <button
          key={brand}
          onClick={() => onBrandSelect(brand)}
          className={cn(
            "brand-chip",
            selectedBrand === brand && "active"
          )}
        >
          {brand}
        </button>
      ))}
    </div>
  );
};

export default BrandFilter;
