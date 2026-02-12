import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/components/auth-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "AI Finance Brief - AI-Powered Daily Market Briefs",
    template: "%s | AI Finance Brief",
  },
  description:
    "Get AI-powered daily market summaries, top movers, sector analysis, and actionable insights delivered every morning before market open.",
  keywords: [
    "AI market brief",
    "daily market summary",
    "stock market analysis",
    "AI finance",
    "market intelligence",
    "trading brief",
    "market news",
    "sector analysis",
  ],
  authors: [{ name: "AI Finance Brief" }],
  openGraph: {
    title: "AI Finance Brief - Your AI Market Analyst, Every Morning",
    description:
      "AI reads 50+ sources, analyzes market movements, and delivers a concise 2-minute brief before the opening bell.",
    type: "website",
    locale: "en_US",
    siteName: "AI Finance Brief",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Finance Brief - Your AI Market Analyst, Every Morning",
    description:
      "AI reads 50+ sources, analyzes market movements, and delivers a concise 2-minute brief before the opening bell.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>
        <AuthProvider>
          <div className="relative min-h-screen flex flex-col">
            {/* Background gradient effects */}
            <div className="fixed inset-0 -z-10">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
              <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-600/8 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl" />
            </div>
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
