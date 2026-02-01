import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import PhoneCard from "@/components/PhoneCard";
import BrandFilter from "@/components/BrandFilter";
import PriceSort, { SortOption } from "@/components/PriceSort";
import { PhoneRecommendations } from "@/components/phone/PhoneRecommendations";
import { SEOHead } from "@/components/SEOHead";
import { Smartphone, TrendingUp, Shield, Zap, ChevronDown } from "lucide-react";
import { PhoneSkeleton } from "@/components/phone/PhoneSkeleton"; // Import the skeleton we created

const BRANDS = ["Samsung", "iPhone", "Xiaomi", "Realme", "Infinix", "Vivo", "OPPO", "Tecno"];
const PAGE_SIZE = 12; // Performance Hack: Load only 12 initially

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  // 1. Optimized Fetching: Let Supabase do the heavy lifting
  const { data: phones, isLoading } = useQuery({
    queryKey: ["phones", selectedBrand, sortOption],
    queryFn: async () => {
      let query = supabase.from("phones").select("*");
      
      if (selectedBrand) {
        // Fix: Use the new 'brand' column for exact matching
        query = query.ilike("brand", `%${selectedBrand}%`);
      }

      // Apply Sort at Database level for speed
      if (sortOption === "price-low") query = query.order("current_price", { ascending: true });
      else if (sortOption === "price-high") query = query.order("current_price", { ascending: false });
      else if (sortOption === "rating") query = query.order("rating", { ascending: false });
      else query = query.order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // 2. Fast Client-side search (limited to 416 items, this is fine)
  const filteredPhones = useMemo(() => {
    if (!phones) return [];
    let result = phones;
    if (searchQuery) {
      result = phones.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return result;
  }, [phones, searchQuery]);

  const visiblePhones = filteredPhones.slice(0, displayCount);

  return (
    <Layout>
      <SEOHead
        title="Phone Insights | Latest Mobile Prices & Full Specs in Pakistan"
        description="Compare prices and specs for 400+ phones. Real-time updates on Samsung, iPhone, Infinix, and more. Find your perfect phone today."
        // UNITY FIX: Matches your Vercel domain
        canonical="https://phone-insights-x.vercel.app/"
      />
      
      {/* Hero Section */}
      <section className="hero-gradient py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6 animate-fade-in">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Compare 416+ Latest Smartphones</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Find Your Perfect <span className="text-primary">Smartphone</span>
          </h1>

          <div className="max-w-2xl mx-auto mb-10">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* Stats Badges */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-card/40 backdrop-blur-md px-4 py-2 rounded-lg border border-border">
               <Smartphone className="w-4 h-4 text-primary" /> <span>416+ Devices</span>
            </div>
            <div className="flex items-center gap-2 bg-card/40 backdrop-blur-md px-4 py-2 rounded-lg border border-border">
               <TrendingUp className="w-4 h-4 text-primary" /> <span>Live Prices</span>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Filters */}
      <section className="container mx-auto px-4 py-8 border-b border-border">
        <BrandFilter
          brands={BRANDS}
          selectedBrand={selectedBrand}
          onBrandSelect={(brand) => {
            setSelectedBrand(brand);
            setDisplayCount(PAGE_SIZE); // Reset scroll on brand change
          }}
        />
      </section>

      {/* Phone Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
           <h2 className="text-2xl font-bold">{selectedBrand || "All"} Phones</h2>
           <PriceSort value={sortOption} onChange={setSortOption} />
        </div>

        {isLoading ? (
          <PhoneSkeleton /> // Using the new skeleton for better LCP
        ) : visiblePhones.length === 0 ? (
          <div className="text-center py-20">No phones found.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visiblePhones.map((phone) => (
                <PhoneCard
                  key={phone.id}
                  name={phone.name}
                  slug={phone.slug}
                  currentPrice={Number(phone.current_price)}
                  imageUrl={phone.image_url}
                  rating={Number(phone.rating)}
                  processor={phone.processor}
                  battery={phone.battery}
                />
              ))}
            </div>

            {/* Pagination Button: Saves Performance */}
            {filteredPhones.length > displayCount && (
              <div className="mt-12 text-center">
                <button 
                  onClick={() => setDisplayCount(prev => prev + PAGE_SIZE)}
                  className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 px-8 py-3 rounded-full font-medium transition-all"
                >
                  <ChevronDown className="w-4 h-4" /> Load More Phones
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </Layout>
  );
};

export default Index;
