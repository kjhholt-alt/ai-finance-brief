import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service - AI Finance Brief",
  description: "Terms of Service for AI Finance Brief",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: February 11, 2026</p>
        </div>
      </div>

      <Card className="glass border-white/[0.06] bg-white/[0.02]">
        <CardContent className="p-8 prose prose-invert prose-sm max-w-none">
          <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using AI Finance Brief (&quot;the Service&quot;), you agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">2. Description of Service</h2>
              <p>
                AI Finance Brief provides AI-generated daily market summaries for informational purposes only.
                The Service uses artificial intelligence to analyze market data and generate concise market briefs.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">3. Not Financial Advice</h2>
              <p>
                The content provided by AI Finance Brief is for informational and educational purposes only.
                It does not constitute financial advice, investment recommendations, or any form of professional
                financial guidance. You should consult with a qualified financial advisor before making any
                investment decisions. We are not responsible for any financial losses incurred based on information
                provided by the Service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">4. AI-Generated Content</h2>
              <p>
                Our market briefs are generated using artificial intelligence. While we strive for accuracy,
                AI-generated content may contain errors, omissions, or inaccuracies. Market data is sourced from
                third-party providers and may be delayed or incomplete. You acknowledge that AI-generated content
                should not be relied upon as the sole basis for financial decisions.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">5. User Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all
                activities that occur under your account. You agree to notify us immediately of any unauthorized
                use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">6. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Redistribute, resell, or commercially exploit the briefs without permission</li>
                <li>Use automated systems to scrape or collect data from the Service</li>
                <li>Attempt to interfere with or disrupt the Service</li>
                <li>Use the Service for any unlawful purpose</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">7. Beta Service</h2>
              <p>
                The Service is currently in beta. Features, pricing, and availability may change without notice.
                During beta, the Service is provided free of charge and &quot;as is&quot; without warranty of any kind.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, AI Finance Brief and its operators shall not be liable
                for any indirect, incidental, special, consequential, or punitive damages, including but not
                limited to loss of profits, data, or other intangible losses resulting from your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">9. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of significant
                changes via email or through the Service. Continued use of the Service after changes constitutes
                acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">10. Contact</h2>
              <p>
                For questions about these terms, please contact us through the waitlist email or the Service dashboard.
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
