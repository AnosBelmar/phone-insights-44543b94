import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { ArrowLeft, Smartphone, Loader2 } from "lucide-react";

const PhoneDetail = () => {
  const { slug } = useParams<{ slug: string }>();

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
                  Rs {currentPrice.toLocaleString()}
                </span>
                {originalPrice && originalPrice > currentPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    Rs {originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {phone.discount && (
                <p className="text-primary font-medium mt-2">
                  You save: {phone.discount}
                </p>
              )}
            </div>

            {/* Info Card */}
            <div className="bg-secondary/30 rounded-xl p-6 border border-border">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Product Information
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Price</span>
                  <span className="font-medium text-foreground">Rs {currentPrice.toLocaleString()}</span>
                </div>
                {originalPrice && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Original Price</span>
                    <span className="font-medium text-foreground">Rs {originalPrice.toLocaleString()}</span>
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
      </div>
    </Layout>
  );
};

export default PhoneDetail;
