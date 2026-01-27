import { useState } from "react";
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

interface Recommendation {
  phone_id: string;
  rank: number;
  matchScore: number;
  reason: string;
  bestFor: string[];
  phone: {
    id: string;
    name: string;
    slug: string;
    current_price: number;
    image_url?: string;
    ram?: string;
    storage?: string;
    battery?: string;
    processor?: string;
  };
}

const preferenceOptions = [
  { id: "gaming", label: "Gaming", icon: Gamepad2 },
  { id: "photography", label: "Photography", icon: Camera },
  { id: "battery", label: "Long Battery", icon: BatteryFull },
  { id: "work", label: "Work/Productivity", icon: Briefcase },
];

export const PhoneRecommendations = () => {
  const [budget, setBudget] = useState("");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const { symbol, rate } = useCurrency();

  const { mutate, data, isPending, error } = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("recommend-phones", {
        body: { 
          budget: Number(budget), 
          preferences: selectedPreferences 
        },
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      return data;
    },
  });

  const togglePreference = (id: string) => {
    setSelectedPreferences(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (budget && Number(budget) > 0) {
      mutate();
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 via-card to-primary/10 rounded-2xl border border-primary/20 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">AI Phone Finder</h2>
          <p className="text-xs text-muted-foreground">Powered by GROQ AI</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Budget Input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Your Budget (PKR)
          </label>
          <Input
            type="number"
            placeholder="e.g., 50000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="bg-background"
            min="1000"
          />
        </div>

        {/* Preferences */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            What matters most to you? (optional)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {preferenceOptions.map((pref) => {
              const Icon = pref.icon;
              const isSelected = selectedPreferences.includes(pref.id);
              return (
                <button
                  key={pref.id}
                  type="button"
                  onClick={() => togglePreference(pref.id)}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{pref.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={!budget || Number(budget) <= 0 || isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Finding Best Phones...
            </>
          ) : (
            <>
              <Target className="w-4 h-4 mr-2" />
              Find My Perfect Phone
            </>
          )}
        </Button>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error.message}</p>
        </div>
      )}

      {/* Results */}
      {data && data.recommendations && (
        <div className="mt-8 space-y-6">
          {/* Summary */}
          {data.summary && (
            <div className="p-4 bg-secondary/30 rounded-lg">
              <p className="text-sm text-foreground">{data.summary}</p>
            </div>
          )}

          {/* Recommendations List */}
          {data.recommendations.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-display font-semibold text-foreground">
                Top Recommendations
              </h3>
              {data.recommendations.map((rec: Recommendation, index: number) => (
                <Link 
                  key={rec.phone_id} 
                  to={`/phone/${rec.phone.slug}`}
                  className="block"
                >
                  <div className="flex gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/40 transition-all group">
                    {/* Rank */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    </div>

                    {/* Image */}
                    <div className="flex-shrink-0 w-16 h-16 bg-secondary/30 rounded-lg flex items-center justify-center">
                      {rec.phone.image_url ? (
                        <img 
                          src={rec.phone.image_url} 
                          alt={rec.phone.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Smartphone className="w-8 h-8 text-muted-foreground opacity-30" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-grow min-w-0">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {rec.phone.name}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {rec.reason}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {rec.bestFor.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs capitalize">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Price & Score */}
                    <div className="flex-shrink-0 text-right">
                      <p className="font-bold text-primary">
                        {formatPrice(rec.phone.current_price, symbol, rate)}
                      </p>
                      <div className="flex items-center gap-1 mt-1 justify-end">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-muted-foreground">
                          {rec.matchScore}% match
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground mt-2 ml-auto group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Smartphone className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
              <p className="text-muted-foreground">
                No phones found in your budget range. Try adjusting your budget.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
