import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import PhoneCard from "@/components/PhoneCard";
import BrandFilter from "@/components/BrandFilter";
import PriceSort, { SortOption } from "@/components/PriceSort";
import { PhoneRecommendations } from "@/components/phone/PhoneRecommendations";
import { SEOHead } from "@/components/SEOHead";
import { Loader2, Smartphone, TrendingUp, Shield, Zap, ChevronDown } from "lucide-react";
import { PhoneSkeleton } from "@/components/phone/PhoneSkeleton";

const BRANDS = ["Samsung", "iPhone", "Xiaomi", "Realme", "Infinix", "Vivo", "OPPO", "Tecno"];
const INITIAL_LOAD = 12;

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [displayCount, setDisplayCount] = useState(INITIAL_LOAD);

  const { data: phones, isLoading } = useQuery({
    queryKey: ["phones"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("phones")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredPhones = useMemo(() => {
    if (!phones) return [];
    let result = phones.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrand ? p.brand === selectedBrand : true;
      return matchesSearch && matchesBrand;
    });

    if (sortOption === "price-low") result = [...result].sort((a, b) => Number(a.current_price) - Number(b.current_price));
    if (sortOption === "price-high") result = [...result].sort((a, b) => Number(b.current_price) - Number(a.current_price));
    if (sortOption === "rating") result = [...result].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    
    return result;
  }, [phones, searchQuery, selectedBrand, sortOption]);

  const stats = useMemo(() => ({
    total: phones?.length || 0,
  }), [phones]);

  const visiblePhones = filteredPhones.slice(0, displayCount);

  return (
    <Layout>
      <SEOHead
        title="Phone Insights | Compare 400+ Mobile Specs, Prices & Reviews"
        description="Find your perfect smartphone with AI-powered reviews and real-time price updates for 400+ devices."
        canonical="https://phone-insights-x.vercel.app/"
      />

      {/* RESTORED: Hero Section with Background Animations */}
      <section className="hero-gradient py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Phone Discovery</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
            Find Your Perfect <span className="text-primary text-glow">Smartphone</span>
          </h1>

          <div className="max-w-2xl mx-auto mb-10">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* RESTORED: Stats Row */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            <div className="flex items-center gap-3 bg-card/50 backdrop-blur-md border border-border rounded-xl px-5 py-3">
              <Smartphone className="w-5 h-5 text-primary" />
              <div className="text-left">
                <span className="text-xl font-bold">{stats.total}+</span>
                <p className="text-xs text-muted-foreground">Phones Listed</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-card/50 backdrop-blur-md border border-border rounded-xl px-5 py-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <div className="text-left">
                <span className="text-xl font-bold">Daily</span>
                <p className="text-xs text-muted-foreground">Price Updates</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-card/50 backdrop-blur-md border border-border rounded-xl px-5 py-3">
              <Shield className="w-5 h-5 text-primary" />
              <div className="text-left">
                <span className="text-xl font-bold">AI</span>
                <p className="text-xs text-muted-foreground">Expert Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="container mx-auto px-4 py-12">
        <PhoneRecommendations />
      </section>

      {/* Brand Filters */}
      <section className="container mx-auto px-4 py-8 border-y border-border/50">
        <BrandFilter 
          brands={BRANDS} 
          selectedBrand={selectedBrand} 
          onBrandSelect={(b) => { setSelectedBrand(b); setDisplayCount(INITIAL_LOAD); }} 
        />
      </section>

      {/* Phone Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold font-display">{selectedBrand || "All"} Smartphones</h2>
            <p className="text-sm text-muted-foreground">Showing {visiblePhones.length} of {filteredPhones.length}</p>
          </div>
          <PriceSort value={sortOption} onChange={setSortOption} />
        </div>

        {isLoading ? (
          <PhoneSkeleton />
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
                  ram={phone.ram}
                  storage={phone.storage}
                />
              ))}
            </div>

            {filteredPhones.length > displayCount && (
              <div className="mt-12 text-center">
                <button 
                  onClick={() => setDisplayCount(prev => prev + 12)}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform inline-flex items-center gap-2"
                >
                  <ChevronDown className="w-5 h-5" /> Show More Phones
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
