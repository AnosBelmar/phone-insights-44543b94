import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { 
  ArrowLeft, Smartphone, Loader2, Cpu, HardDrive, 
  Battery, Camera, Monitor, Layers, Wifi, Scale, Ruler 
} from "lucide-react";
import { useCurrency, formatPrice } from "@/hooks/useCurrency";
import { usePhoneReview } from "@/hooks/usePhoneReview";
import { AIReviewSection } from "@/components/phone/AIReviewSection";
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
  const originalPrice = phone.original_price ? Number(phone.original_price) : null;
  const rating = phone.rating ? Number(phone.rating) : null;

  // Spec items for the table
  const specs = [
    { icon: Cpu, label: "Processor", value: phone.processor },
    { icon: HardDrive, label: "RAM", value: phone.ram },
    { icon: Layers, label: "Storage", value: phone.storage },
    { icon: Battery, label: "Battery", value: phone.battery },
    { icon: Camera, label: "Main Camera", value: phone.main_camera },
    { icon: Camera, label: "Selfie Camera", value: phone.selfie_camera },
    { icon: Monitor, label: "Display Size", value: phone.display_size },
    { icon: Monitor, label: "Display Type", value: phone.display_type },
    { icon: Layers, label: "Operating System", value: phone.os },
    { icon: Wifi, label: "Network", value: phone.network },
    { icon: Scale, label: "Weight", value: phone.weight },
    { icon: Ruler, label: "Dimensions", value: phone.dimensions },
  ];

  const hasSpecs = specs.some(spec => spec.value);

  return (
    <Layout>
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
          <div className="bg-card rounded-2xl border border-border p-8 flex items-center justify-center aspect-square relative">
            {phone.image_url ? (
              <img
                src={phone.image_url}
                alt={phone.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`flex flex-col items-center justify-center text-muted-foreground ${phone.image_url ? 'hidden' : ''}`}>
              <Smartphone className="w-32 h-32 mb-4 opacity-40" />
              <span className="text-sm opacity-60">No image available</span>
            </div>
            
            {/* Discount badge */}
            {phone.discount && (
              <span className="absolute top-4 left-4 text-sm font-bold text-white bg-primary px-3 py-1.5 rounded-lg">
                {phone.discount}
              </span>
            )}
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
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(currentPrice, symbol, rate)}
                </span>
                {originalPrice && originalPrice > currentPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(originalPrice, symbol, rate)}
                  </span>
                )}
              </div>
              {phone.discount && (
                <p className="text-primary font-medium mt-2">
                  You save: {phone.discount}
                </p>
              )}
            </div>

            {/* Price Info Card */}
            <div className="bg-secondary/30 rounded-xl p-6 border border-border">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Price Information
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Price</span>
                  <span className="font-medium text-foreground">{formatPrice(currentPrice, symbol, rate)}</span>
                </div>
                {originalPrice && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Original Price</span>
                    <span className="font-medium text-foreground">{formatPrice(originalPrice, symbol, rate)}</span>
                  </div>
                )}
                {phone.discount && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium text-primary">{phone.discount}</span>
                  </div>
                )}
                {rating && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-medium text-foreground">⭐ {rating.toFixed(1)}</span>
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
          
          {hasSpecs ? (
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {specs.map((spec, index) => {
                  const IconComponent = spec.icon;
                  return (
                    <div
                      key={spec.label}
                      className={`flex items-center gap-4 p-5 border-b border-border/50 last:border-b-0 md:odd:border-r ${
                        index >= specs.length - 2 ? 'md:border-b-0' : ''
                      }`}
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                          {spec.label}
                        </p>
                        <p className="text-foreground font-medium truncate">
                          {spec.value || "—"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <Smartphone className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground">
                Detailed specifications are not available for this phone yet.
              </p>
              <p className="text-sm text-muted-foreground/70 mt-2">
                Check back later for updates.
              </p>
            </div>
          )}
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