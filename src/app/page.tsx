import Link from "next/link";
import { WaitlistForm } from "@/components/waitlist-form";

const features = [
  {
    title: "AI Market Summary",
    description:
      "Claude-powered analysis distills the market movements into clear, actionable insights you can read in under 2 minutes.",
    iconPath:
      "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5",
  },
  {
    title: "Top Movers Tracking",
    description:
      "Instantly see which stocks moved the most and why. No more digging through multiple sources to understand market shifts.",
    iconPath:
      "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941",
  },
  {
    title: "Sector Performance",
    description:
      "Understand sector rotation and where money is flowing. Stay ahead of trends with AI-detected patterns across industries.",
    iconPath:
      "M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z",
  },
  {
    title: "Key Events & Outlook",
    description:
      "Never miss an earnings report, Fed announcement, or market-moving event. Get forward-looking analysis on what matters next.",
    iconPath:
      "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5",
  },
];

const pricingItems = [
  "Daily AI-generated market briefs",
  "Top movers with AI analysis",
  "Sector performance tracking",
  "Key events & forward outlook",
  "Generate briefs on demand",
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/50 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              Powered by Claude AI
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
              AI-Powered Daily{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-200">
                Market Briefs
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Stop spending hours reading financial news. Get a concise,
              AI-generated market summary with top movers, sector analysis, and
              key events — every single day.
            </p>
            <div className="flex flex-col items-center gap-4">
              <WaitlistForm />
              <p className="text-gray-500 text-sm">
                Join 500+ investors on the waitlist. No spam, ever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need to stay informed
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our AI reads thousands of data points and synthesizes them into a
              brief you can digest in minutes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-brand-500/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 mb-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={feature.iconPath}
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-gray-400">
              One plan. Full access. Cancel anytime.
            </p>
          </div>
          <div className="max-w-sm mx-auto">
            <div className="rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 p-8">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-300 mb-2">
                  Pro Plan
                </h3>
                <div className="flex items-baseline justify-center gap-1 mb-1">
                  <span className="text-5xl font-bold text-white">$9</span>
                  <span className="text-gray-400">/mo</span>
                </div>
                <p className="text-gray-500 text-sm mb-8">
                  Billed monthly. Cancel anytime.
                </p>
                <ul className="space-y-3 text-left mb-8">
                  {pricingItems.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-brand-400 mt-0.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/api/checkout"
                  className="block w-full py-3 px-6 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-lg transition-colors text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
