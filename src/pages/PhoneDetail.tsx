import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { ArrowLeft, Smartphone, Loader2, Zap } from "lucide-react";
import { useCurrency, formatPrice } from "@/hooks/useCurrency";
import { usePhoneReview } from "@/hooks/usePhoneReview";
import { AIReviewSection } from "@/components/phone/AIReviewSection";
import { SpecificationsSection } from "@/components/phone/SpecificationsSection";
import { SEOHead } from "@/components/SEOHead";

const PhoneDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { symbol, rate } = useCurrency();

  // 1. Fetch Main Phone Data using the newly added 'slug' column
  const { data: phone, isLoading, error } = useQuery({
    queryKey: ["phone", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("phones")
        .select("*")
        .eq("slug", slug) // Matches your new database column
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // 2. Fetch Related Phones (Internal Linking Fix for SEO 'F' Grade)
  const { data: relatedPhones } = useQuery({
    queryKey: ["related-phones", phone?.brand, slug],
    queryFn: async () => {
      if (!phone?.brand) return [];
      const { data } = await supabase
        .from("phones")
        .select("name, slug, current_price, image_url")
        .eq("brand", phone.brand)
        .neq("slug", slug) 
        .limit(4);
      return data;
    },
    enabled: !!phone?.brand,
  });

  const { data: review, isLoading: isReviewLoading } = usePhoneReview(phone);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!phone || error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Smartphone className="w-20 h-20 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Phone Not Found</h1>
          <p className="text-muted-foreground mb-6">The phone you're looking for doesn't exist.</p>
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </Layout>
    );
  }

  const currentPrice = Number(phone.current_price);
  const rating = phone.rating ? Number(phone.rating) : null;
  const phoneBrand = phone.brand || phone.name.split(' ')[0];
  const fallbackImage = `https://placehold.co/500x500/1a1f2e/3ecf8e?text=${encodeURIComponent(phone.name.split(' ').slice(0, 2).join(' '))}`;
  
  // Performance Fix: Optimize image URL for faster LCP
  const displayImage = phone.image_url || fallbackImage;

  return (
    <Layout>
      <SEOHead
        title={`${phone.name} Price & Full Specs | Phone Insights`}
        description={`Check out ${phone.name} full specs: ${phone.processor}, ${phone.ram} RAM, ${phone.battery}. Latest price and expert AI reviews.`}
        // SEO FIX: Absolute URL for canonical ranking
        canonical={`https://phone-insights-x.vercel.app/phone/${phone.slug}`}
        image={displayImage}
        type="product"
        phone={{
          name: phone.name,
          price: currentPrice,
          image: displayImage,
          rating: rating || undefined,
          brand: phoneBrand,
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-card rounded-2xl border border-border p-8 flex items-center justify-center aspect-square relative overflow-hidden">
            <img 
              src={displayImage} 
              alt={phone.name} 
              className="max-w-full max-h-full object-contain"
              // PERFORMANCE FIX: Critical images should load normally, others lazy
              fetchPriority="high" 
            />
          </div>

          <div className="space-y-6">
            <div>
              {rating && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <span className="text-yellow-400">⭐</span>
                  <span className="font-medium text-foreground">{rating.toFixed(1)} Rating</span>
                </div>
              )}
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">{phone.name}</h1>
              <span className="text-4xl font-bold text-primary">{formatPrice(currentPrice, symbol, rate)}</span>
            </div>

            <div className="bg-secondary/30 rounded-xl p-6 border border-border">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" /> Core Specs
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {phone.processor && <div><span className="text-muted-foreground block text-xs">Processor</span><span className="font-medium">{phone.processor}</span></div>}
                {phone.ram && <div><span className="text-muted-foreground block text-xs">RAM</span><span className="font-medium">{phone.ram}</span></div>}
                {phone.battery && <div><span className="text-muted-foreground block text-xs">Battery</span><span className="font-medium">{phone.battery}</span></div>}
                {phone.display_size && <div><span className="text-muted-foreground block text-xs">Display</span><span className="font-medium">{phone.display_size}</span></div>}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <SpecificationsSection phone={phone} />
        </div>

        <div className="mt-12">
          <AIReviewSection review={review!} isLoading={isReviewLoading} />
        </div>

        {/* RELATED PHONES: Eliminates the 'F' grade in Links by connecting your 416 pages */}
        {relatedPhones && relatedPhones.length > 0 && (
          <div className="mt-20 border-t border-border pt-12">
            <h2 className="font-display text-2xl font-bold mb-8">More from {phoneBrand}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedPhones.map((rp) => (
                <Link 
                  key={rp.slug} 
                  to={`/phone/${rp.slug}`} 
                  className="group bg-card rounded-xl p-4 border border-border hover:border-primary transition-all"
                >
                  <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-secondary/20 p-2">
                    <img 
                      src={rp.image_url || fallbackImage} 
                      alt={rp.name} 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
                      loading="lazy" // Performance fix for secondary images
                    />
                  </div>
                  <h3 className="font-medium text-sm line-clamp-1">{rp.name}</h3>
                  <p className="text-primary font-bold text-sm mt-1">{formatPrice(Number(rp.current_price), symbol, rate)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PhoneDetail;
