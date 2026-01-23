import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import BrandFilter from "@/components/BrandFilter";
import PhoneCard from "@/components/PhoneCard";
import { Loader2, Smartphone } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

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

  // Get unique brands
  const brands = useMemo(() => {
    if (!phones) return [];
    const uniqueBrands = [...new Set(phones.map((p) => p.brand))];
    return uniqueBrands.sort();
  }, [phones]);

  // Filter phones
  const filteredPhones = useMemo(() => {
    if (!phones) return [];
    return phones.filter((phone) => {
      const matchesSearch = phone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        phone.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = !selectedBrand || phone.brand === selectedBrand;
      return matchesSearch && matchesBrand;
    });
  }, [phones, searchQuery, selectedBrand]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Find Your Perfect <span className="text-primary text-glow">Phone</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Compare prices, specs, and AI-powered reviews for the latest smartphones
            </p>
          </div>
          
          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search phones by name or brand..."
          />
        </div>
      </section>

      {/* Brand Filter */}
      <section className="container mx-auto px-4 -mt-4">
        <BrandFilter
          brands={brands}
          selectedBrand={selectedBrand}
          onSelect={setSelectedBrand}
        />
      </section>

      {/* Phone Grid */}
      <section className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filteredPhones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Smartphone className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No phones found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-foreground">
                {selectedBrand ? `${selectedBrand} Phones` : "All Phones"}
              </h2>
              <span className="text-sm text-muted-foreground">
                {filteredPhones.length} {filteredPhones.length === 1 ? "phone" : "phones"}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPhones.map((phone, index) => (
                <div
                  key={phone.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <PhoneCard
                    name={phone.name}
                    brand={phone.brand}
                    slug={phone.slug}
                    price={Number(phone.price)}
                    imageUrl={phone.image_url}
                    ram={phone.ram}
                    storage={phone.storage}
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
