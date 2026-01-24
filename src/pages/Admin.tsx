import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Loader2, Smartphone } from "lucide-react";

const Admin = () => {
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

          {/* Stats */}
          <div className="bg-card rounded-xl border border-border p-6 mb-10">
            <div className="flex items-center gap-3 mb-2">
              <Smartphone className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground text-sm">Total Phones</span>
            </div>
            <p className="font-display text-3xl font-bold text-foreground">
              {phones?.length ?? 0}
            </p>
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
                {phones?.map((phone) => (
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
                          {phone.discount && (
                            <span className="ml-2 text-primary">{phone.discount}</span>
                          )}
                        </p>
                      </div>
                    </div>
                    {phone.rating && (
                      <span className="text-sm text-muted-foreground">
                        ⭐ {Number(phone.rating).toFixed(1)}
                      </span>
                    )}
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
