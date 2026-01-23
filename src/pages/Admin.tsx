import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Sparkles, Loader2, CheckCircle, AlertCircle, Smartphone } from "lucide-react";

const Admin = () => {
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const { data: phones, isLoading } = useQuery({
    queryKey: ["phones-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("phones")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const phonesWithoutReview = phones?.filter((p) => !p.ai_verdict) ?? [];
  const phonesWithReview = phones?.filter((p) => p.ai_verdict) ?? [];

  const generateReviews = async () => {
    if (phonesWithoutReview.length === 0) {
      toast.info("All phones already have reviews!");
      return;
    }

    setIsGenerating(true);
    setProgress({ current: 0, total: phonesWithoutReview.length });

    try {
      for (let i = 0; i < phonesWithoutReview.length; i++) {
        const phone = phonesWithoutReview[i];
        setProgress({ current: i + 1, total: phonesWithoutReview.length });

        try {
          const response = await supabase.functions.invoke("generate-review", {
            body: {
              phoneId: phone.id,
              phoneName: phone.name,
              brand: phone.brand,
              price: phone.price,
              ram: phone.ram,
              storage: phone.storage,
              processor: phone.processor,
              battery: phone.battery,
              camera: phone.camera,
              display: phone.display,
            },
          });

          if (response.error) {
            console.error("Error generating review for", phone.name, response.error);
            toast.error(`Failed to generate review for ${phone.name}`);
          } else {
            toast.success(`Generated review for ${phone.name}`);
          }
        } catch (err) {
          console.error("Error generating review for", phone.name, err);
        }
      }

      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ["phones-admin"] });
      queryClient.invalidateQueries({ queryKey: ["phones"] });
      toast.success("Finished generating all reviews!");
    } catch (error) {
      console.error("Error in generateReviews:", error);
      toast.error("An error occurred while generating reviews");
    } finally {
      setIsGenerating(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage phones and generate AI reviews
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-2">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">Total Phones</span>
              </div>
              <p className="font-display text-3xl font-bold text-foreground">
                {phones?.length ?? 0}
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground text-sm">With Reviews</span>
              </div>
              <p className="font-display text-3xl font-bold text-primary">
                {phonesWithReview.length}
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <span className="text-muted-foreground text-sm">Missing Reviews</span>
              </div>
              <p className="font-display text-3xl font-bold text-orange-500">
                {phonesWithoutReview.length}
              </p>
            </div>
          </div>

          {/* Generate Reviews Button */}
          <div className="bg-card rounded-xl border border-border p-6 mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                  Generate AI Reviews
                </h3>
                <p className="text-muted-foreground text-sm">
                  Use AI to generate helpful reviews with Pros/Cons for phones that don't have one yet.
                </p>
              </div>
              <Button
                onClick={generateReviews}
                disabled={isGenerating || phonesWithoutReview.length === 0}
                className="btn-admin flex items-center gap-2 shrink-0"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating ({progress.current}/{progress.total})
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Reviews ({phonesWithoutReview.length})
                  </>
                )}
              </Button>
            </div>

            {/* Progress bar */}
            {isGenerating && progress.total > 0 && (
              <div className="mt-4">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Phone List */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-display font-semibold text-foreground">All Phones</h3>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : (
              <div className="divide-y divide-border">
                {phones?.map((phone) => (
                  <div key={phone.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <Smartphone className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{phone.name}</p>
                        <p className="text-sm text-muted-foreground">{phone.brand} · ${Number(phone.price).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {phone.ai_verdict ? (
                        <span className="flex items-center gap-1 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Has Review
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs bg-orange-500/20 text-orange-500 px-2 py-1 rounded-full">
                          <AlertCircle className="w-3 h-3" />
                          No Review
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
