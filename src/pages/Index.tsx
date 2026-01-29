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
import { Loader2, Smartphone, TrendingUp, Shield, Zap } from "lucide-react";

const BRANDS = ["Samsung", "iPhone", "Xiaomi", "Realme", "Infinix", "Vivo", "OPPO", "Tecno"];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("newest");

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

  // Filter and sort phones
  const filteredPhones = useMemo(() => {
    if (!phones) return [];
    
    let result = phones.filter((phone) => {
      const matchesSearch = phone.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrand 
        ? phone.name.toLowerCase().includes(selectedBrand.toLowerCase())
        : true;
      return matchesSearch && matchesBrand;
    });

    // Apply sorting
    switch (sortOption) {
      case "price-low":
        result = [...result].sort((a, b) => Number(a.current_price) - Number(b.current_price));
        break;
      case "price-high":
        result = [...result].sort((a, b) => Number(b.current_price) - Number(a.current_price));
        break;
      case "rating":
        result = [...result].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
        break;
      case "newest":
      default:
        // Already sorted by created_at
        break;
    }

    return result;
  }, [phones, searchQuery, selectedBrand, sortOption]);

  // Stats
  const stats = useMemo(() => {
    if (!phones) return { total: 0, avgPrice: 0, topBrand: "" };
    const total = phones.length;
    const avgPrice = phones.reduce((acc, p) => acc + Number(p.current_price), 0) / total;
    return { total, avgPrice };
  }, [phones]);

  return (
    <Layout>
      <SEOHead
        title="Phone Insights | Compare 400+ Mobile Specs, Prices & Reviews in Pakistan"
        description="Find and compare the best smartphones in Pakistan. Browse 400+ phones with detailed specifications, AI-powered reviews, and current prices. Samsung, iPhone, Xiaomi, Realme & more."
        canonical="https://phoneinsights.pk/"
      />
      {/* Hero Section - Extraordinary Design */}
      <section className="hero-gradient py-20 md:py-28 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Phone Discovery</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Find Your Perfect{" "}
              <span className="relative">
                <span className="text-primary text-glow">Smartphone</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 10C50 2 150 2 298 10" stroke="hsl(158, 64%, 52%)" strokeWidth="3" strokeLinecap="round" className="opacity-60" />
                </svg>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Compare specs, prices & get personalized AI recommendations from {stats.total}+ phones
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-10">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search phones by name, brand, or specs..."
            />
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-border rounded-xl px-5 py-3">
              <Smartphone className="w-5 h-5 text-primary" />
              <div>
                <span className="text-2xl font-bold text-foreground">{stats.total}+</span>
                <p className="text-xs text-muted-foreground">Phones Listed</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-border rounded-xl px-5 py-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <div>
                <span className="text-2xl font-bold text-foreground">Daily</span>
                <p className="text-xs text-muted-foreground">Price Updates</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-border rounded-xl px-5 py-3">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <span className="text-2xl font-bold text-foreground">AI</span>
                <p className="text-xs text-muted-foreground">Powered Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Recommendations Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <PhoneRecommendations />
        </div>
      </section>

      {/* Brand Filters */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-6">
          <h2 className="font-display text-2xl font-bold text-foreground">Browse by Brand</h2>
          <BrandFilter
            brands={BRANDS}
            selectedBrand={selectedBrand}
            onBrandSelect={setSelectedBrand}
          />
        </div>
      </section>

      {/* Phone Grid */}
      <section className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filteredPhones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
              <Smartphone className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No phones found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            {/* Header with count and sort */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  {selectedBrand ? `${selectedBrand} Phones` : 'All Phones'}
                </h2>
                <span className="text-sm text-muted-foreground">
                  Showing {filteredPhones.length} {filteredPhones.length === 1 ? "phone" : "phones"}
                </span>
              </div>
              <PriceSort value={sortOption} onChange={setSortOption} />
            </div>
            
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPhones.map((phone, index) => (
                <div
                  key={phone.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
                >
                  <PhoneCard
                    name={phone.name}
                    slug={phone.slug}
                    currentPrice={Number(phone.current_price)}
                    imageUrl={phone.image_url ?? undefined}
                    rating={phone.rating ? Number(phone.rating) : undefined}
                    ram={phone.ram ?? undefined}
                    storage={phone.storage ?? undefined}
                    battery={phone.battery ?? undefined}
                    processor={phone.processor ?? undefined}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </Layout>
  );
};

export default Index;
