import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface BrandFilterProps {
  selectedBrand: string | null;
  onBrandSelect: (brand: string | null) => void;
}

export const BrandFilter = ({ selectedBrand, onBrandSelect }: BrandFilterProps) => {
  // Fetch unique brands from the database
  const { data: brands, isLoading } = useQuery({
    queryKey: ["unique-brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("phones")
        .select("brand")
        .not("brand", "is", null);
      
      if (error) throw error;
      
      // Get unique brands and sort alphabetically
      const uniqueBrands = Array.from(new Set(data.map((p) => p.brand))).sort();
      return uniqueBrands;
    },
  });

  if (isLoading) return <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />;

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      <Button
        variant={selectedBrand === null ? "default" : "outline"}
        onClick={() => onBrandSelect(null)}
        className="rounded-full"
      >
        All Brands
      </Button>
      {brands?.map((brand) => (
        <Button
          key={brand}
          variant={selectedBrand === brand ? "default" : "outline"}
          onClick={() => onBrandSelect(brand)}
          className="rounded-full"
        >
          {brand}
        </Button>
      ))}
    </div>
  );
};
