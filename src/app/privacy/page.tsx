import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - AI Finance Brief",
  description: "Privacy Policy for AI Finance Brief",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: February 11, 2026</p>
        </div>
      </div>

      <Card className="glass border-white/[0.06] bg-white/[0.02]">
        <CardContent className="p-8">
          <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">1. Information We Collect</h2>
              <p className="mb-3">We collect the following information:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong className="text-foreground">Email address</strong> — used for account creation, authentication, and brief delivery</li>
                <li><strong className="text-foreground">User preferences</strong> — investor type, sector interests, watchlist tickers, timezone</li>
                <li><strong className="text-foreground">Brief ratings</strong> — optional feedback you provide on daily briefs</li>
                <li><strong className="text-foreground">Usage data</strong> — when you access the Service and which features you use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>To provide and personalize your daily market briefs</li>
                <li>To deliver briefs via email (if opted in)</li>
                <li>To improve the quality and relevance of our AI-generated content</li>
                <li>To communicate about Service updates and changes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">3. Data Storage</h2>
              <p>
                Your data is stored securely on our servers. During the beta period, user data is stored
                in JSON files on the server. We plan to migrate to a secure database solution before
                the production launch. We do not sell, trade, or rent your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">4. Third-Party Services</h2>
              <p className="mb-3">We use the following third-party services:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong className="text-foreground">Anthropic (Claude AI)</strong> — for generating market briefs. Your personal data is not sent to the AI model.</li>
                <li><strong className="text-foreground">Alpha Vantage</strong> — for market data. No personal data is shared.</li>
                <li><strong className="text-foreground">Resend</strong> — for email delivery. Your email address is shared for delivery purposes.</li>
                <li><strong className="text-foreground">Vercel</strong> — for hosting. Standard server logs may include IP addresses.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">5. Cookies</h2>
              <p>
                We use essential cookies for authentication and session management. We do not use
                tracking cookies or third-party advertising cookies.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">6. Data Retention</h2>
              <p>
                We retain your account data for as long as your account is active. You may request
                deletion of your account and associated data at any time by contacting us. Brief
                archives are retained to allow you to access past market summaries.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">7. Your Rights</h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your account and data</li>
                <li>Opt out of email communications at any time</li>
                <li>Export your data in a portable format</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">8. Security</h2>
              <p>
                We implement reasonable security measures to protect your personal information.
                However, no method of transmission over the Internet is 100% secure. We cannot
                guarantee absolute security of your data.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">9. Children&apos;s Privacy</h2>
              <p>
                The Service is not intended for users under the age of 18. We do not knowingly
                collect personal information from children.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any
                changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">11. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us through the
                Service dashboard or via the waitlist email.
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
