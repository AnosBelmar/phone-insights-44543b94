import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { ArrowLeft, Smartphone, Loader2 } from "lucide-react";
import { useCurrency, formatPrice } from "@/hooks/useCurrency";
import { usePhoneReview } from "@/hooks/usePhoneReview";
import { AIReviewSection } from "@/components/phone/AIReviewSection";
import { SpecificationsSection } from "@/components/phone/SpecificationsSection";
import { SEOHead } from "@/components/SEOHead";

const PhoneDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { symbol, rate } = useCurrency();

  const { data: phone, isLoading, error } = useQuery({
    queryKey: ["phone", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("phones")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
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
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Phone Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The phone you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all phones
          </Link>
        </div>
      </Layout>
    );
  }

  const currentPrice = Number(phone.current_price);
  const rating = phone.rating ? Number(phone.rating) : null;

  // Generate a fallback image URL
  const phoneBrand = phone.name.split(' ')[0];
  const fallbackImage = `https://placehold.co/500x500/1a1f2e/3ecf8e?text=${encodeURIComponent(phone.name.split(' ').slice(0, 2).join(' '))}`;
  const displayImage = phone.image_url || fallbackImage;

  return (
    <Layout>
      <SEOHead
        title={`${phone.name} - Price, Specs & Review | Phone Insights`}
        description={`${phone.name} specs: ${phone.processor || 'Powerful processor'}, ${phone.ram || 'Ample RAM'}, ${phone.battery || 'Long-lasting battery'}. Price in Pakistan: Rs. ${currentPrice.toLocaleString()}. Read full review and compare with other phones.`}
        canonical={`https://phoneinsights.pk/phone/${phone.slug}`}
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
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all phones
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Image */}
          <div className="bg-card rounded-2xl border border-border p-8 flex items-center justify-center aspect-square relative overflow-hidden">
            <img
              src={displayImage}
              alt={phone.name}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
            />
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              {rating && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <span className="text-yellow-400">⭐</span>
                  <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
                  <span>Rating</span>
                </div>
              )}
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {phone.name}
              </h1>
              <span className="text-4xl font-bold text-primary">
                {formatPrice(currentPrice, symbol, rate)}
              </span>
            </div>

            {/* Quick Specs Card */}
            <div className="bg-secondary/30 rounded-xl p-6 border border-border">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Quick Specs
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {phone.processor && (
                  <div>
                    <span className="text-muted-foreground block">Processor</span>
                    <span className="font-medium text-foreground">{phone.processor}</span>
                  </div>
                )}
                {phone.ram && (
                  <div>
                    <span className="text-muted-foreground block">RAM</span>
                    <span className="font-medium text-foreground">{phone.ram}</span>
                  </div>
                )}
                {phone.storage && (
                  <div>
                    <span className="text-muted-foreground block">Storage</span>
                    <span className="font-medium text-foreground">{phone.storage}</span>
                  </div>
                )}
                {phone.battery && (
                  <div>
                    <span className="text-muted-foreground block">Battery</span>
                    <span className="font-medium text-foreground">{phone.battery}</span>
                  </div>
                )}
                {phone.display_size && (
                  <div>
                    <span className="text-muted-foreground block">Display</span>
                    <span className="font-medium text-foreground">{phone.display_size}</span>
                  </div>
                )}
                {phone.main_camera && (
                  <div>
                    <span className="text-muted-foreground block">Camera</span>
                    <span className="font-medium text-foreground">{phone.main_camera.split('+')[0]}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Full Specifications Table */}
        <div className="mt-12">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">
            Full Specifications
          </h2>
          <SpecificationsSection phone={phone} />
        </div>

        {/* AI Review Section */}
        <div className="mt-12">
          <AIReviewSection review={review!} isLoading={isReviewLoading} />
        </div>
      </div>
    </Layout>
  );
};

export default PhoneDetail;
