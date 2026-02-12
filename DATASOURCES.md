# Data Sources

## Currently Active

### Alpha Vantage (Free Tier)
- **Endpoint**: `https://www.alphavantage.co/query`
- **Rate Limit**: 25 requests/day, 5 requests/minute
- **Used For**:
  - `GLOBAL_QUOTE` — SPY, QQQ, DIA daily price + change
  - `TOP_GAINERS_LOSERS` — top 5 gainers and losers
- **API Key**: Set `ALPHA_VANTAGE_API_KEY` in `.env.local`
- **Docs**: https://www.alphavantage.co/documentation/

### Claude API (Anthropic)
- **Used For**: Generating the daily brief from market data
- **Model**: claude-sonnet-4-5-20250514
- **Cost**: ~$0.01-0.03 per brief generation
- **API Key**: Set `ANTHROPIC_API_KEY` in `.env.local`

## Mock Data (Fallbacks)
When APIs are rate-limited or unavailable, the system falls back to realistic mock data for:
- Pre-market futures (S&P, Nasdaq, Dow futures)
- Commodities (Crude Oil, Gold)
- Bond yields (10Y, 2Y Treasury)

## Planned Upgrades
| Source | Data | Cost | Priority |
|--------|------|------|----------|
| Yahoo Finance (unofficial) | Real-time quotes, futures | Free | High |
| VIX/CBOE | Fear & Greed / Volatility Index | Free | High |
| Earnings Whispers API | Earnings calendar | Free tier | Medium |
| FRED (Federal Reserve) | Economic indicators | Free | Medium |
| CoinGecko | BTC/ETH prices | Free | Low |
