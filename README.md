# AI Finance Brief

AI-powered daily market briefs that help investors stay informed in minutes, not hours.

## Features

- **AI Market Summary** - Claude-powered analysis of daily market movements
- **Top Movers Tracking** - See which stocks moved the most and why
- **Sector Performance** - Understand sector rotation and money flow
- **Key Events & Outlook** - Forward-looking analysis of market catalysts
- **Stripe Subscription** - $9/mo subscription via Stripe Checkout
- **Authentication** - NextAuth.js with credential-based sign-in (MVP)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Anthropic Claude API
- **Payments**: Stripe Checkout
- **Auth**: NextAuth.js v5
- **Email**: Resend (production)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/kjhholt-alt/ai-finance-brief.git
   cd ai-finance-brief
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file and fill in your API keys:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

See `.env.example` for all required environment variables.

## Project Structure

```
src/
  app/
    page.tsx              # Landing page with hero, features, pricing
    layout.tsx            # Root layout with nav and footer
    dashboard/page.tsx    # Protected dashboard with market brief
    signin/page.tsx       # Sign-in page
    api/
      waitlist/route.ts   # Waitlist signup endpoint
      brief/route.ts      # AI brief generation endpoint
      checkout/route.ts   # Stripe checkout session
      auth/[...nextauth]/ # NextAuth handlers
  components/
    navigation.tsx        # Responsive navigation bar
    footer.tsx            # Site footer
    waitlist-form.tsx     # Email waitlist form
    auth-provider.tsx     # NextAuth session provider
  lib/
    stripe.ts             # Stripe client
    anthropic.ts          # Anthropic client
  auth.ts                 # NextAuth configuration
  middleware.ts           # Route protection middleware
```

## License

MIT
