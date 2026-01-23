import Layout from "@/components/Layout";

const Privacy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-muted-foreground text-lg mb-8">
              Last updated: January 2024
            </p>

            <div className="space-y-8">
              <section className="bg-card rounded-xl border border-border p-6 md:p-8">
                <h2 className="font-display text-xl font-bold text-foreground mb-4">
                  1. Information We Collect
                </h2>
                <p className="text-muted-foreground mb-4">
                  We collect information you provide directly to us, such as when you contact us through our website. This may include:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Name and email address</li>
                  <li>Messages and feedback you send us</li>
                  <li>Usage data and analytics</li>
                </ul>
              </section>

              <section className="bg-card rounded-xl border border-border p-6 md:p-8">
                <h2 className="font-display text-xl font-bold text-foreground mb-4">
                  2. How We Use Your Information
                </h2>
                <p className="text-muted-foreground mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Respond to your inquiries and provide support</li>
                  <li>Improve our services and user experience</li>
                  <li>Send you updates about our platform (with your consent)</li>
                  <li>Analyze usage patterns to enhance our features</li>
                </ul>
              </section>

              <section className="bg-card rounded-xl border border-border p-6 md:p-8">
                <h2 className="font-display text-xl font-bold text-foreground mb-4">
                  3. Data Security
                </h2>
                <p className="text-muted-foreground">
                  We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section className="bg-card rounded-xl border border-border p-6 md:p-8">
                <h2 className="font-display text-xl font-bold text-foreground mb-4">
                  4. Cookies and Tracking
                </h2>
                <p className="text-muted-foreground">
                  We use cookies and similar tracking technologies to collect usage information about our website. You can control cookie preferences through your browser settings. Essential cookies are required for the website to function properly.
                </p>
              </section>

              <section className="bg-card rounded-xl border border-border p-6 md:p-8">
                <h2 className="font-display text-xl font-bold text-foreground mb-4">
                  5. Third-Party Services
                </h2>
                <p className="text-muted-foreground">
                  We may use third-party services for analytics and functionality. These services have their own privacy policies governing the use of your information. We recommend reviewing their policies to understand how they handle your data.
                </p>
              </section>

              <section className="bg-card rounded-xl border border-border p-6 md:p-8">
                <h2 className="font-display text-xl font-bold text-foreground mb-4">
                  6. Your Rights
                </h2>
                <p className="text-muted-foreground mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Access the personal data we hold about you</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </section>

              <section className="bg-card rounded-xl border border-border p-6 md:p-8">
                <h2 className="font-display text-xl font-bold text-foreground mb-4">
                  7. Contact Us
                </h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy, please contact us at{" "}
                  <a href="mailto:privacy@mobilehub.com" className="text-primary hover:underline">
                    privacy@mobilehub.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
