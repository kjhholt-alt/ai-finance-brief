# UTM Campaign Links — AI Finance Brief Launch

Base URL: `https://ai-finance-brief.vercel.app`

## Paid Channels

### Google Ads
```
Landing page:  /sample?utm_source=google&utm_medium=cpc&utm_campaign=launch_feb26&utm_term={keyword}
Dashboard:     /dashboard?utm_source=google&utm_medium=cpc&utm_campaign=launch_feb26&utm_term={keyword}
```
Google Ads auto-tags with `gclid` — but add UTMs as backup for Vercel Analytics.

### Reddit Ads
```
Ad Variant A:  /sample?utm_source=reddit&utm_medium=paid&utm_campaign=launch_feb26&utm_content=problem_solution
Ad Variant B:  /sample?utm_source=reddit&utm_medium=paid&utm_campaign=launch_feb26&utm_content=bloomberg_angle
Ad Variant C:  /sample?utm_source=reddit&utm_medium=paid&utm_campaign=launch_feb26&utm_content=specificity
```

### Twitter/X Ads
```
Ad Variant A:  /sample?utm_source=twitter&utm_medium=paid&utm_campaign=launch_feb26&utm_content=builder_story
Ad Variant B:  /sample?utm_source=twitter&utm_medium=paid&utm_campaign=launch_feb26&utm_content=routine_replacement
Ad Variant C:  /sample?utm_source=twitter&utm_medium=paid&utm_campaign=launch_feb26&utm_content=screenshot
```

### Newsletter Sponsorships
```
Template:      /sample?utm_source={newsletter-name}&utm_medium=sponsor&utm_campaign=launch_feb26
```

## Organic / Free Channels

### Reddit Organic
```
r/SideProject:     /sample?utm_source=reddit&utm_medium=organic&utm_campaign=r_sideproject
r/stocks:          /sample?utm_source=reddit&utm_medium=organic&utm_campaign=r_stocks
r/investing:       /sample?utm_source=reddit&utm_medium=organic&utm_campaign=r_investing
r/algotrading:     /sample?utm_source=reddit&utm_medium=organic&utm_campaign=r_algotrading
r/startups:        /sample?utm_source=reddit&utm_medium=organic&utm_campaign=r_startups
r/EntrepreneurRA:  /sample?utm_source=reddit&utm_medium=organic&utm_campaign=r_entrepreneurridealong
```

### Twitter/X Organic
```
Daily post:    /sample?utm_source=twitter&utm_medium=organic&utm_campaign=daily_post
Thread:        /sample?utm_source=twitter&utm_medium=organic&utm_campaign=thread
Bio link:      /?utm_source=twitter&utm_medium=organic&utm_campaign=bio
```

### Product Hunt
```
Listing:       /sample?utm_source=producthunt&utm_medium=referral&utm_campaign=launch
```

### Hacker News
```
Show HN:       /sample?utm_source=hackernews&utm_medium=referral&utm_campaign=show_hn
```

### LinkedIn
```
Post:          /sample?utm_source=linkedin&utm_medium=organic&utm_campaign=launch_post
```

### Direct / Email Signature
```
Email sig:     /?utm_source=email&utm_medium=signature&utm_campaign=personal
Cold outreach: /sample?utm_source=email&utm_medium=outreach&utm_campaign=launch_feb26
```

## Sector Page Deep Links (for targeted ads)

When targeting specific investor interests, link directly to sector pages:

```
Tech investors:    /briefs/technology?utm_source={source}&utm_medium={medium}&utm_campaign=sector_tech
Healthcare:        /briefs/healthcare?utm_source={source}&utm_medium={medium}&utm_campaign=sector_health
Crypto:            /briefs/crypto?utm_source={source}&utm_medium={medium}&utm_campaign=sector_crypto
AI/ML:             /briefs/ai-machine-learning?utm_source={source}&utm_medium={medium}&utm_campaign=sector_ai
Dividends:         /briefs/dividends-income?utm_source={source}&utm_medium={medium}&utm_campaign=sector_dividends
Energy:            /briefs/energy?utm_source={source}&utm_medium={medium}&utm_campaign=sector_energy
```

## How UTM Tracking Works

1. User clicks a UTM-tagged link
2. `UTMTracker` component (in root layout) captures params on first page load
3. Params stored in localStorage under key `afb_utm`
4. On conversion (sign-up, upgrade), include UTM data in the event
5. Analyze in Vercel Analytics by filtering on query parameters

## Vercel Analytics UTM Viewing

Vercel Analytics automatically captures UTM parameters. View them at:
- Dashboard > Analytics > Referrers (shows utm_source)
- Dashboard > Analytics > Top Pages (shows which landing pages convert)

For deeper analysis, add Plausible Analytics ($9/mo) which has native UTM breakdown dashboards.
