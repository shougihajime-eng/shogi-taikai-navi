import type { MetadataRoute } from "next";
import { getTournaments, getClasses } from "@/lib/data";

const BASE = "https://shogi-taikai-navi.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tournaments, classes] = await Promise.all([
    getTournaments({ includeFinished: true }),
    getClasses(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/taikai`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/kyoshitsu`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/toroku`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const tournamentPages: MetadataRoute.Sitemap = tournaments.map((t) => ({
    url: `${BASE}/taikai/${t.id}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const classPages: MetadataRoute.Sitemap = classes.map((c) => ({
    url: `${BASE}/kyoshitsu/${c.id}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...tournamentPages, ...classPages];
}
