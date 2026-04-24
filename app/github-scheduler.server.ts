import { github } from "~/data/portfolio";
import type { GitHubStats, ContribDay } from "~/components/GitHubGrid";

// ── In-memory cache (Vercel has a read-only filesystem) ──────────────
// On serverless, this persists for the lifetime of the function instance.
// Each cold start will fetch fresh data; warm invocations reuse the cache.
const SIX_HOURS = 6 * 60 * 60 * 1000;

let cachedData: GitHubStats | null = null;
let cachedAt = 0;

async function fetchGitHubData(): Promise<GitHubStats | null> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${github.username}?y=last`
    );
    if (!res.ok) return null;
    const data = await res.json();

    const contributions: ContribDay[] = (data.contributions || []).map(
      (c: { date: string; count: number; level: number }) => ({
        date: c.date,
        count: c.count,
        level: c.level,
      })
    );

    const weeks: ContribDay[][] = [];
    for (let i = 0; i < contributions.length; i += 7) {
      weeks.push(contributions.slice(i, i + 7));
    }

    return {
      totalContributions:
        data.total?.lastYear ??
        contributions.reduce((s: number, c: ContribDay) => s + c.count, 0),
      weeks: weeks.slice(-52),
    };
  } catch {
    return null;
  }
}

async function fetchAndCache(): Promise<void> {
  const data = await fetchGitHubData();
  if (data) {
    cachedData = data;
    cachedAt = Date.now();
    console.log("[github] in-memory cache updated at", new Date().toISOString());
  }
}

export async function readGitHubCache(): Promise<GitHubStats | null> {
  // If cache is fresh (< 6 hours old), return it
  if (cachedData && Date.now() - cachedAt < SIX_HOURS) {
    return cachedData;
  }

  // Otherwise fetch fresh data
  await fetchAndCache();
  return cachedData;
}

// startGitHubScheduler is kept as a no-op for backward compatibility
// (entry.server.tsx calls it). On serverless, setInterval doesn't persist
// across invocations, so we fetch on-demand in readGitHubCache instead.
let started = false;

export function startGitHubScheduler(): void {
  if (started) return;
  started = true;
  console.log("[github] scheduler initialized (on-demand fetching for serverless)");

  // Eagerly populate the cache on the first cold start
  fetchAndCache().catch(console.error);
}
