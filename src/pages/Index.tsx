import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import PhoneCard from "@/components/PhoneCard";
import BrandFilter from "@/components/BrandFilter";
import PriceSort, { SortOption } from "@/components/PriceSort";
import { PhoneRecommendations } from "@/components/phone/PhoneRecommendations";
import { SEOHead } from "@/components/SEOHead";
import { Smartphone, TrendingUp, Zap, ChevronDown } from "lucide-react";

const BRANDS = ["Samsung", "iPhone", "Xiaomi", "Realme", "Infinix", "Vivo", "OPPO", "Tecno"];
const PAGE_SIZE = 12;

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  const { data: phones, isLoading } = useQuery({
    queryKey: ["phones", selectedBrand, sortOption, searchQuery],
    queryFn: async () => {
      let query = supabase.from("phones").select("*");
      if (selectedBrand) query = query.ilike("brand", `%${selectedBrand}%`);
      if (searchQuery) query = query.ilike("name", `%${searchQuery}%`);
      
      if (sortOption === "price-low") query = query.order("current_price", { ascending: true });
      else if (sortOption === "price-high") query = query.order("current_price", { ascending: false });
      else if (sortOption === "rating") query = query.order("rating", { ascending: false });
      else query = query.order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const visiblePhones = phones?.slice(0, displayCount) || [];

  return (
    <Layout>
      <SEOHead
        title="Phone Insights | Mobile Prices & Specs in Pakistan"
        description="Compare 416+ mobile specs and prices instantly. AI-powered reviews for Samsung, iPhone, and more."
        canonical="https://phone-insights-x.vercel.app/"
      />

      <section className="py-16 bg-gradient-to-b from-primary/5 to-transparent relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">Compare 416+ Smartphones</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Find Your Perfect <span className="text-primary">Smartphone</span>
          </h1>

          <div className="max-w-xl mx-auto mb-8">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          <div className="flex justify-center gap-4 text-xs font-medium opacity-70">
            <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> {phones?.length || 0} Phones</span>
            <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Live Prices</span>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <PhoneRecommendations />
        </div>

        <BrandFilter 
          brands={BRANDS} 
          selectedBrand={selectedBrand} 
          onBrandSelect={(b) => { setSelectedBrand(b); setDisplayCount(PAGE_SIZE); }} 
        />
        
        <div className="flex justify-between items-center my-8">
          <h2 className="text-xl font-bold">{selectedBrand || "All"} Phones</h2>
          <PriceSort value={sortOption} onChange={setSortOption} />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {[...Array(8)].map((_, i) => <div key={i} className="h-64 bg-muted rounded-xl" />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {visiblePhones.map((phone, index) => (
                <PhoneCard key={phone.id} {...phone} priority={index < 4} />
              ))}
            </div>

            {phones && phones.length > displayCount && (
              <div className="mt-12 text-center">
                <Button 
                  onClick={() => setDisplayCount(prev => prev + PAGE_SIZE)}
                  variant="secondary"
                  className="rounded-full px-8"
                >
                  <ChevronDown className="w-4 h-4 mr-2" /> Load More
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </Layout>
  );
};

export default Index;
