import { PhoneReview } from "@/hooks/usePhoneReview";
import { 
  Sparkles, ThumbsUp, ThumbsDown, Target, Zap, 
  Camera, Battery, MonitorSmartphone, Star, DollarSign
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AIReviewSectionProps {
  review: PhoneReview;
  isLoading: boolean;
}

const ScoreBar = ({ label, score, icon: Icon }: { label: string; score: number; icon: React.ElementType }) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    if (score >= 50) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        <span className="text-sm font-bold text-foreground">{score}/100</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${getScoreColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-primary/20 rounded-lg" />
      <div className="h-6 bg-secondary rounded w-48" />
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-secondary rounded w-full" />
      <div className="h-4 bg-secondary rounded w-3/4" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-secondary rounded" />
      ))}
    </div>
  </div>
);

export const AIReviewSection = ({ review, isLoading }: AIReviewSectionProps) => {
  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-8">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!review) return null;

  return (
    <div className="space-y-8">
      {/* AI Summary Card */}
      <div className="bg-gradient-to-br from-primary/5 via-card to-primary/10 rounded-2xl border border-primary/20 p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">AI Review</h2>
            <p className="text-xs text-muted-foreground">Powered by GROQ AI</p>
          </div>
        </div>
        <p className="text-foreground leading-relaxed text-lg">{review.summary}</p>
      </div>

      {/* Scores Grid */}
      <div className="bg-card rounded-2xl border border-border p-8">
        <h3 className="font-display text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          Performance Scores
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ScoreBar label="Performance" score={review.performanceScore} icon={Zap} />
          <ScoreBar label="Camera" score={review.cameraScore} icon={Camera} />
          <ScoreBar label="Battery" score={review.batteryScore} icon={Battery} />
          <ScoreBar label="Display" score={review.displayScore} icon={MonitorSmartphone} />
          <ScoreBar label="Value for Money" score={review.valueScore} icon={DollarSign} />
        </div>
      </div>

      {/* Pros and Cons - Redesigned */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pros */}
        <div className="bg-card rounded-2xl border border-green-500/30 overflow-hidden">
          <div className="bg-green-500/10 px-6 py-4 border-b border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <ThumbsUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">Pros</h3>
            </div>
          </div>
          <div className="p-6">
            <ul className="space-y-4">
              {review.pros.map((pro, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                    <span className="text-green-500 text-sm font-bold">✓</span>
                  </div>
                  <span className="text-foreground leading-relaxed">{pro}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cons */}
        <div className="bg-card rounded-2xl border border-red-500/30 overflow-hidden">
          <div className="bg-red-500/10 px-6 py-4 border-b border-red-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <ThumbsDown className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">Cons</h3>
            </div>
          </div>
          <div className="p-6">
            <ul className="space-y-4">
              {review.cons.map((con, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5">
                    <span className="text-red-500 text-sm font-bold">✗</span>
                  </div>
                  <span className="text-foreground leading-relaxed">{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="bg-card rounded-2xl border border-border p-8">
        <h3 className="font-display text-lg font-bold text-foreground mb-6">Key Highlights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {review.highlights.map((highlight, index) => (
            <div key={index} className="bg-secondary/30 rounded-xl p-4 border border-border/50">
              <h4 className="font-semibold text-foreground mb-1">{highlight.title}</h4>
              <p className="text-sm text-muted-foreground">{highlight.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Best For & Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best For */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-display text-lg font-bold text-foreground mb-4">Best For</h3>
          <div className="flex flex-wrap gap-2">
            {review.bestFor.map((use, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium capitalize"
              >
                {use}
              </span>
            ))}
          </div>
        </div>

        {/* Comparison */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-display text-lg font-bold text-foreground mb-4">Market Comparison</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{review.comparison}</p>
        </div>
      </div>

      {/* Verdict */}
      <div className="bg-gradient-to-br from-primary/10 via-card to-accent/10 rounded-2xl border border-primary/30 p-8">
        <h3 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Final Verdict
        </h3>
        <p className="text-foreground text-lg leading-relaxed">{review.verdict}</p>
      </div>
    </div>
  );
};
