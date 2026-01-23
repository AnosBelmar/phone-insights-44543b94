import Layout from "@/components/Layout";
import { Sparkles, Target, Users, Zap } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              About <span className="text-primary">MobileHub</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your trusted source for comprehensive mobile phone comparisons, specifications, and AI-powered reviews to help you make informed purchasing decisions.
            </p>
          </div>

          {/* Mission */}
          <section className="mb-16">
            <div className="bg-card rounded-2xl border border-border p-8 md:p-10">
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                At MobileHub, we believe that choosing the right smartphone shouldn't be overwhelming. With hundreds of new devices launching every year, each with complex specifications and varying price points, making an informed decision can be challenging. That's why we created MobileHub – to simplify the smartphone buying process through comprehensive data, clear comparisons, and intelligent AI-powered insights.
              </p>
            </div>
          </section>

          {/* Features */}
          <section className="mb-16">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">
              What Sets Us Apart
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  AI-Powered Reviews
                </h3>
                <p className="text-muted-foreground text-sm">
                  Our advanced AI analyzes specifications and market data to provide unbiased, comprehensive reviews focusing on real-world value.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  Accurate Specifications
                </h3>
                <p className="text-muted-foreground text-sm">
                  We maintain an up-to-date database of phone specifications, ensuring you always have access to the latest and most accurate information.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  Fast & Intuitive
                </h3>
                <p className="text-muted-foreground text-sm">
                  Our platform is designed for speed and ease of use. Find and compare phones in seconds with our powerful search and filtering tools.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  Community Driven
                </h3>
                <p className="text-muted-foreground text-sm">
                  Built for the community, by tech enthusiasts. We listen to feedback and continuously improve our platform based on user needs.
                </p>
              </div>
            </div>
          </section>

          {/* Team Note */}
          <section className="text-center">
            <div className="verdict-card">
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Built with ❤️ for Tech Enthusiasts
              </h3>
              <p className="text-muted-foreground">
                MobileHub is created by a team passionate about technology and committed to helping you find the perfect device.
              </p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default About;
