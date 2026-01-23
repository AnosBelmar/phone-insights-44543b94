import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import SpecsTable from "@/components/SpecsTable";
import AIVerdict from "@/components/AIVerdict";
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

  const specs = [
    { label: "Brand", value: phone.brand },
    { label: "Display", value: phone.display },
    { label: "Processor", value: phone.processor },
    { label: "RAM", value: phone.ram },
    { label: "Storage", value: phone.storage },
    { label: "Camera", value: phone.camera },
    { label: "Battery", value: phone.battery },
  ];

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
          <div className="bg-card rounded-2xl border border-border p-8 flex items-center justify-center aspect-square">
            {phone.image_url ? (
              <img
                src={phone.image_url}
                alt={phone.name}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <Smartphone className="w-32 h-32 mb-4 opacity-40" />
                <span className="text-sm opacity-60">No image available</span>
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <p className="text-primary font-medium mb-2">{phone.brand}</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {phone.name}
              </h1>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">
                  ${Number(phone.price).toLocaleString()}
                </span>
                <span className="text-muted-foreground text-sm">USD</span>
              </div>
            </div>

            {/* Specs Table */}
            <SpecsTable specs={specs} />
          </div>
        </div>

        {/* AI Verdict - Full width below */}
        <div className="mt-10">
          <AIVerdict verdict={phone.ai_verdict} />
        </div>
      </div>
    </Layout>
  );
};

export default PhoneDetail;
