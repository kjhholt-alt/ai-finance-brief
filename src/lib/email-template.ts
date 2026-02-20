interface TopMover {
  ticker: string;
  name: string;
  change: string;
  analysis: string;
}

interface SectorData {
  sector: string;
  performance: string;
  insight: string;
}

interface BriefData {
  date: string;
  summary: string;
  topMovers: TopMover[];
  sectorPerformance: SectorData[];
  thingToWatch?: string;
  outlook: string;
}

export function generateBriefEmailHtml(brief: BriefData, manageUrl?: string): string {
  const moverRows = brief.topMovers
    .map((m) => {
      const color = m.change.startsWith("+") ? "#10b981" : "#ef4444";
      return `
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #1e293b;">
            <span style="font-family: monospace; font-weight: 700; color: #e2e8f0;">${m.ticker}</span>
            <span style="color: #94a3b8; margin-left: 8px;">${m.name}</span>
          </td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #1e293b; text-align: right;">
            <span style="color: ${color}; font-weight: 600; font-family: monospace;">${m.change}</span>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 4px 16px 12px; color: #94a3b8; font-size: 13px;">
            ${m.analysis}
          </td>
        </tr>`;
    })
    .join("");

  const sectorItems = brief.sectorPerformance
    .map((s) => {
      const color = s.performance.startsWith("+") ? "#10b981" : "#ef4444";
      return `
        <div style="display: inline-block; width: 30%; min-width: 150px; padding: 12px; margin: 4px; background: #1e293b; border-radius: 8px;">
          <div style="color: #e2e8f0; font-size: 14px; font-weight: 500;">${s.sector}</div>
          <div style="color: ${color}; font-family: monospace; font-weight: 600; margin-top: 4px;">${s.performance}</div>
        </div>`;
    })
    .join("");

  const thingToWatchSection = brief.thingToWatch
    ? `
      <div style="background: linear-gradient(135deg, #78350f22, #92400e11); border: 1px solid #f59e0b33; border-radius: 12px; padding: 20px; margin-top: 24px;">
        <h2 style="color: #fbbf24; font-size: 16px; margin: 0 0 8px;">&#9888; Thing to Watch Today</h2>
        <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6; margin: 0;">${brief.thingToWatch}</p>
      </div>`
    : "";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 32px 16px;">

    <!-- Header -->
    <div style="text-align: center; padding: 24px 0; border-bottom: 1px solid #1e293b;">
      <h1 style="color: #818cf8; font-size: 20px; margin: 0;">&#x1F4CA; AI Finance Brief</h1>
      <p style="color: #64748b; font-size: 13px; margin: 8px 0 0;">${brief.date} &middot; Daily Market Digest</p>
    </div>

    <!-- Market Summary -->
    <div style="padding: 24px 0;">
      <h2 style="color: #e2e8f0; font-size: 16px; margin: 0 0 12px;">Market Summary</h2>
      <p style="color: #cbd5e1; font-size: 14px; line-height: 1.7; margin: 0;">${brief.summary}</p>
    </div>

    <!-- Top Movers -->
    <div style="background: #1e293b44; border: 1px solid #334155; border-radius: 12px; overflow: hidden; margin-top: 8px;">
      <div style="padding: 16px; border-bottom: 1px solid #334155;">
        <h2 style="color: #e2e8f0; font-size: 16px; margin: 0;">&#x1F4C8; Top Movers</h2>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        ${moverRows}
      </table>
    </div>

    <!-- Sector Performance -->
    <div style="padding: 24px 0;">
      <h2 style="color: #e2e8f0; font-size: 16px; margin: 0 0 12px;">Sector Performance</h2>
      <div style="text-align: center;">
        ${sectorItems}
      </div>
    </div>

    ${thingToWatchSection}

    <!-- Outlook -->
    <div style="background: linear-gradient(135deg, #312e8122, #4338ca11); border: 1px solid #6366f133; border-radius: 12px; padding: 20px; margin-top: 24px;">
      <h2 style="color: #a5b4fc; font-size: 16px; margin: 0 0 8px;">&#x1F52D; Forward Outlook</h2>
      <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6; margin: 0;">${brief.outlook}</p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 32px 0 16px; border-top: 1px solid #1e293b; margin-top: 32px;">
      <p style="color: #64748b; font-size: 12px; margin: 0;">
        AI Finance Brief &middot; AI-powered market intelligence
      </p>
      <p style="color: #475569; font-size: 11px; margin: 8px 0 0;">
        You're receiving this because you signed up at AI Finance Brief.
      </p>${manageUrl ? `
      <p style="margin: 12px 0 0;">
        <a href="${manageUrl}" style="color: #6366f1; font-size: 11px; text-decoration: underline;">Manage Subscriptions</a>
      </p>` : ""}
    </div>
  </div>
</body>
</html>`;
}
