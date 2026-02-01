import { useState, useCallback, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { 
  Sparkles, Loader2, Target, Smartphone, ArrowRight,
  Gamepad2, Camera, BatteryFull, Briefcase, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCurrency, formatPrice } from "@/hooks/useCurrency";

// ... (Interface remains the same)

export const PhoneRecommendations = () => {
  const [budget, setBudget] = useState("");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const { symbol, rate } = useCurrency();

  const { mutate, data, isPending, error } = useMutation({
    mutationKey: ['recommend-phones'], // Adding a key helps React Query track state better
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("recommend-phones", {
        body: { budget: Number(budget), preferences: selectedPreferences },
      });
      if (error || data?.error) throw new Error(error?.message || data?.error);
      return data;
    },
  });

  // Performance Fix: Use useCallback so the toggle doesn't trigger 
  // re-renders of the entire list on every click
  const togglePreference = useCallback((id: string) => {
    setSelectedPreferences(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (budget && Number(budget) > 0) mutate();
  };

  // Performance Fix: Memoize the results list so it doesn't re-calculate 
  // styles/layout unless the data actually changes
  const renderedRecommendations = useMemo(() => {
    if (!data?.recommendations) return null;
    return data.recommendations.map((rec: Recommendation, index: number) => (
      <Link key={rec.phone_id} to={`/phone/${rec.phone.slug}`} className="block group">
        <div className="flex gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/40 transition-all">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">#{index + 1}</span>
          </div>
          
          <div className="flex-shrink-0 w-16 h-16 bg-secondary/20 rounded-lg overflow-hidden">
            {rec.phone.image_url ? (
              <img 
                src={rec.phone.image_url} 
                alt={rec.phone.name}
                loading="lazy" // Critical for Performance
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <Smartphone className="w-8 h-8 text-muted-foreground/30 m-auto mt-4" />
            )}
          </div>

          <div className="flex-grow min-w-0">
            <h4 className="font-semibold text-foreground group-hover:text-primary truncate">
              {rec.phone.name}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{rec.reason}</p>
          </div>

          <div className="flex-shrink-0 text-right">
            <p className="font-bold text-primary text-sm">
              {formatPrice(rec.phone.current_price, symbol, rate)}
            </p>
            <div className="flex items-center gap-1 mt-1 justify-end text-[10px] text-muted-foreground">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              {rec.matchScore}%
            </div>
          </div>
        </div>
      </Link>
    ));
  }, [data, symbol, rate]);

  return (
    <section className="bg-gradient-to-br from-primary/5 to-card rounded-2xl border border-primary/10 p-4 md:p-8">
      {/* ... Form UI (Keep as is, it's fine) ... */}
      
      {isPending && (
        <div className="py-12 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm animate-pulse">Consulting AI experts...</p>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {renderedRecommendations}
      </div>
    </section>
  );
};
