const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: { name: string; value: string; inline?: boolean }[];
  timestamp?: string;
}

export async function sendDiscordAlert(
  content: string,
  embed?: DiscordEmbed
): Promise<void> {
  if (!DISCORD_WEBHOOK_URL) {
    console.warn("DISCORD_WEBHOOK_URL not set, skipping alert");
    return;
  }

  try {
    const body: Record<string, unknown> = { content };
    if (embed) {
      body.embeds = [embed];
    }

    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("Failed to send Discord alert:", err);
  }
}

export async function notifyNewSubscriber(
  email: string,
  totalCount: number
): Promise<void> {
  await sendDiscordAlert("", {
    title: "New Subscriber",
    description: `**${email}** just joined the waitlist`,
    color: 0x6366f1, // indigo
    fields: [
      {
        name: "Total Subscribers",
        value: `${totalCount}`,
        inline: true,
      },
    ],
    timestamp: new Date().toISOString(),
  });
}
