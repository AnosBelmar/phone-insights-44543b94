import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Loader2, Smartphone, Wand2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const Admin = () => {
  const queryClient = useQueryClient();
  const [generatingSpecs, setGeneratingSpecs] = useState(false);
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

  const phonesWithSpecs = phones?.filter(p => p.processor && p.ram && p.battery) || [];
  const phonesMissingSpecs = phones?.filter(p => !p.processor || !p.ram || !p.battery) || [];

  const generateSpecsForPhone = async (phone: { id: string; name: string }) => {
    const { error } = await supabase.functions.invoke("generate-specs", {
      body: { phoneName: phone.name, phoneId: phone.id },
    });
    if (error) throw error;
  };

  const handleBulkGenerateSpecs = async () => {
    if (phonesMissingSpecs.length === 0) {
      toast.info("All phones already have specifications!");
      return;
    }

    setGeneratingSpecs(true);
    setProgress({ current: 0, total: phonesMissingSpecs.length });
    
    let successCount = 0;
    let failCount = 0;

    // Process in batches of 3 to avoid rate limiting
    const batchSize = 3;
    for (let i = 0; i < phonesMissingSpecs.length; i += batchSize) {
      const batch = phonesMissingSpecs.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (phone) => {
          try {
            await generateSpecsForPhone({ id: phone.id, name: phone.name });
            successCount++;
          } catch (error) {
            console.error(`Failed to generate specs for ${phone.name}:`, error);
            failCount++;
          }
          setProgress(prev => ({ ...prev, current: prev.current + 1 }));
        })
      );

      // Small delay between batches
      if (i + batchSize < phonesMissingSpecs.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setGeneratingSpecs(false);
    queryClient.invalidateQueries({ queryKey: ["phones-admin"] });

    if (successCount > 0) {
      toast.success(`Generated specs for ${successCount} phones!`);
    }
    if (failCount > 0) {
      toast.error(`Failed to generate specs for ${failCount} phones`);
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
              Manage phones in your catalog
            </p>
          </div>

          {/* Stats Grid */}
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

            <div className="bg-card rounded-xl border border-green-500/30 p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-muted-foreground text-sm">With Specs</span>
              </div>
              <p className="font-display text-3xl font-bold text-green-500">
                {phonesWithSpecs.length}
              </p>
            </div>

            <div className="bg-card rounded-xl border border-orange-500/30 p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <span className="text-muted-foreground text-sm">Missing Specs</span>
              </div>
              <p className="font-display text-3xl font-bold text-orange-500">
                {phonesMissingSpecs.length}
              </p>
            </div>
          </div>

          {/* Bulk Generate Specs */}
          <div className="bg-gradient-to-br from-primary/5 via-card to-primary/10 rounded-xl border border-primary/20 p-6 mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">AI Specs Generator</h2>
                <p className="text-xs text-muted-foreground">Powered by GROQ AI</p>
              </div>
            </div>
            
            <p className="text-muted-foreground text-sm mb-4">
              Automatically generate specifications for all phones missing data using AI.
            </p>

            {generatingSpecs && (
              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Generating specs...</span>
                  <span>{progress.current} / {progress.total}</span>
                </div>
                <Progress value={(progress.current / progress.total) * 100} />
              </div>
            )}

            <Button 
              onClick={handleBulkGenerateSpecs}
              disabled={generatingSpecs || phonesMissingSpecs.length === 0}
              className="w-full md:w-auto"
            >
              {generatingSpecs ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Specs...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate All Missing Specs ({phonesMissingSpecs.length})
                </>
              )}
            </Button>
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
            ) : phones?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Smartphone className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
                <p className="text-muted-foreground">No phones in database</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {phones?.map((phone) => {
                  const hasSpecs = phone.processor && phone.ram && phone.battery;
                  return (
                    <div key={phone.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                          {phone.image_url ? (
                            <img src={phone.image_url} alt={phone.name} className="w-full h-full object-cover" />
                          ) : (
                            <Smartphone className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{phone.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Rs {Number(phone.current_price).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {hasSpecs ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Specs
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full">
                            <XCircle className="w-3 h-3" />
                            No Specs
                          </span>
                        )}
                        {phone.rating && (
                          <span className="text-sm text-muted-foreground">
                            ⭐ {Number(phone.rating).toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
