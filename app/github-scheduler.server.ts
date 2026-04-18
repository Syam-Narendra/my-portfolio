import { writeFile, rename, readFile, unlink } from "node:fs/promises";
import path from "node:path";
import { github } from "~/data/portfolio";
import type { GitHubStats, ContribDay } from "~/components/GitHubGrid";

const CACHE_PATH = path.join(process.cwd(), "github-cache.json");
const TMP_PATH = CACHE_PATH + ".tmp";
const SIX_HOURS = 6 * 60 * 60 * 1000;

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

// Atomic write: write to .tmp then rename so a crash mid-write never corrupts the cache.
async function fetchAndCache(): Promise<void> {
  const data = await fetchGitHubData();
  if (data) {
    await writeFile(TMP_PATH, JSON.stringify({ data, fetchedAt: Date.now() }), "utf-8");
    await rename(TMP_PATH, CACHE_PATH);
    console.log("[github] cache updated at", new Date().toISOString());
  } else {
    unlink(TMP_PATH).catch(() => {});
  }
}

async function cacheAgeMs(): Promise<number> {
  try {
    const raw = await readFile(CACHE_PATH, "utf-8");
    const { fetchedAt } = JSON.parse(raw) as { fetchedAt: number };
    return Date.now() - fetchedAt;
  } catch {
    return Infinity;
  }
}

export async function readGitHubCache(): Promise<GitHubStats | null> {
  try {
    const raw = await readFile(CACHE_PATH, "utf-8");
    const { data } = JSON.parse(raw) as { data: GitHubStats };
    return data ?? null;
  } catch {
    return null;
  }
}

let started = false;

export function startGitHubScheduler(): void {
  if (started) return;
  started = true;

  // Refetch immediately only if cache is missing or stale (>6h old).
  cacheAgeMs().then((age) => {
    if (age >= SIX_HOURS) fetchAndCache().catch(console.error);
  });

  // .unref() lets Node exit cleanly without waiting for the next tick.
  setInterval(() => fetchAndCache().catch(console.error), SIX_HOURS).unref();
  console.log("[github] scheduler started — refreshing every 6 hours");
}
