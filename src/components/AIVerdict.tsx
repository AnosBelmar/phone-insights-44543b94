import { Sparkles } from "lucide-react";

interface AIVerdictProps {
  verdict: string | null | undefined;
}

const AIVerdict = ({ verdict }: AIVerdictProps) => {
  if (!verdict) {
    return (
      <div className="verdict-card">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold text-lg text-foreground">
            Buyer's Verdict
          </h3>
        </div>
        <p className="text-muted-foreground italic">
          AI review coming soon. Check back later for our in-depth analysis of this device.
        </p>
      </div>
    );
  }

  return (
    <div className="verdict-card">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-display font-semibold text-lg text-foreground">
          Buyer's Verdict
        </h3>
        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
          AI-Generated
        </span>
      </div>
      <div className="prose prose-invert prose-sm max-w-none">
        <div className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
          {verdict}
        </div>
      </div>
    </div>
  );
};

export default AIVerdict;
