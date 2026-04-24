// ── Admin Actions: Portfolio file generation & GitHub commit ─────────
import { Buffer } from "node:buffer";

// On Vercel, env vars are injected via the dashboard into process.env.
// Locally with Vite, use --env-file or dotenv in vite.config.
function getEnvVar(key: string): string | undefined {
  return process.env[key];
}

// ── Types ────────────────────────────────────────────────────────────
export interface PortfolioData {
  profile: {
    name: string;
    avatarUrl: string;
    tagline: string;
    statusChecking: string;
    statusReady: string;
  };
  nav: {
    logoUrl: string;
    logoAlt: string;
    links: { label: string; href: string }[];
  };
  meta: {
    title: string;
    description: string;
  };
  socialLinks: { label: string; href: string; icon: string }[];
  github: { username: string };
  experience: {
    company: string;
    companyUrl: string;
    logoUrl: string;
    role: string;
    type: string;
    period: [string, string];
    skills: string[];
  }[];
  education: {
    institution: string;
    url: string;
    logoUrl: string;
    degree: string;
    sub: string;
    period: [string, string];
  }[];
  booksCurrentlyReading: {
    title: string;
    author: string;
    coverUrl: string;
    genre: string;
    language: "english" | "telugu";
    rating?: number;
    review?: string;
  }[];
  booksRead: {
    title: string;
    author: string;
    coverUrl: string;
    genre: string;
    language: "english" | "telugu";
    rating?: number;
    review?: string;
  }[];
  booksMeta: {
    title: string;
    description: string;
    heading: string;
    subheading: string;
  };
  projects: {
    title: string;
    description: string;
    tags: string[];
    url?: string;
    githubUrl?: string;
    imageUrl: string;
  }[];
  projectsMeta: {
    title: string;
    description: string;
    heading: string;
    subheading: string;
  };
  blogs: {
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    tags: string[];
    slug: string;
    coverUrl: string;
  }[];
  blogsMeta: {
    title: string;
    description: string;
    heading: string;
    subheading: string;
  };
  about: string[];
  quote: { text: string; author: string };
  footer: { copyright: string; tagline: string; emoji: string };
}

// ── Read current portfolio data ─────────────────────────────────────
export async function readPortfolioData(): Promise<PortfolioData> {
  const mod = await import("~/data/portfolio");
  return {
    profile: mod.profile,
    nav: mod.nav,
    meta: mod.meta,
    socialLinks: mod.socialLinks,
    github: mod.github,
    experience: mod.experience,
    education: mod.education,
    booksCurrentlyReading: mod.booksCurrentlyReading,
    booksRead: mod.booksRead,
    booksMeta: mod.booksMeta,
    projects: mod.projects,
    projectsMeta: mod.projectsMeta,
    blogs: mod.blogs,
    blogsMeta: mod.blogsMeta,
    about: mod.about,
    quote: mod.quote,
    footer: mod.footer,
  };
}

// ── Escape strings for TypeScript output ────────────────────────────
function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

// ── Generate portfolio.ts content ────────────────────────────────────
export function generatePortfolioFile(data: PortfolioData): string {
  const lines: string[] = [];

  // Profile
  lines.push(`export const profile = {`);
  lines.push(`  name: "${esc(data.profile.name)}",`);
  lines.push(`  avatarUrl: "${esc(data.profile.avatarUrl)}",`);
  lines.push(`  tagline: "${esc(data.profile.tagline)}",`);
  lines.push(`  statusChecking: "${esc(data.profile.statusChecking)}",`);
  lines.push(`  statusReady: "${esc(data.profile.statusReady)}",`);
  lines.push(`};`);
  lines.push(``);

  // Nav
  lines.push(`export const nav = {`);
  lines.push(`  logoUrl: "${esc(data.nav.logoUrl)}",`);
  lines.push(`  logoAlt: "${esc(data.nav.logoAlt)}",`);
  lines.push(`  links: [`);
  for (const link of data.nav.links) {
    lines.push(`    { label: "${esc(link.label)}", href: "${esc(link.href)}" },`);
  }
  lines.push(`  ] as { label: string; href: string }[],`);
  lines.push(`};`);
  lines.push(``);

  // Meta
  lines.push(`export const meta = {`);
  lines.push(`  title: "${esc(data.meta.title)}",`);
  lines.push(`  description:`);
  lines.push(`    "${esc(data.meta.description)}",`);
  lines.push(`};`);

  // Social Links
  lines.push(`export const socialLinks = [`);
  for (const sl of data.socialLinks) {
    if (sl.href.startsWith("mailto:")) {
      lines.push(`  { label: "${esc(sl.label)}", href: "${esc(sl.href)}", icon: "${esc(sl.icon)}" },`);
    } else {
      lines.push(`  { label: "${esc(sl.label)}", href: "${esc(sl.href)}", icon: "${esc(sl.icon)}" },`);
    }
  }
  lines.push(`];`);
  lines.push(``);

  // GitHub
  lines.push(`// ── GitHub ───────────────────────────────────────────────────────────`);
  lines.push(`export const github = {`);
  lines.push(`  username: "${esc(data.github.username)}",`);
  lines.push(`};`);
  lines.push(``);

  // Visitor Count
  lines.push(`// ── Visitor Count ────────────────────────────────────────────────────`);
  lines.push(`let visitorCount = 100;`);
  lines.push(``);
  lines.push(`export function getVisitorCount() {`);
  lines.push(`  return ++visitorCount;`);
  lines.push(`}`);
  lines.push(``);

  // Experience
  lines.push(`export const experience = [`);
  for (const exp of data.experience) {
    lines.push(`  {`);
    lines.push(`    company: "${esc(exp.company)}",`);
    lines.push(`    companyUrl: "${esc(exp.companyUrl)}",`);
    lines.push(`    logoUrl: "${esc(exp.logoUrl)}",`);
    lines.push(`    role: "${esc(exp.role)}",`);
    lines.push(`    type: "${esc(exp.type)}",`);
    lines.push(`    period: ["${esc(exp.period[0])}", "${esc(exp.period[1])}"] as [string, string],`);
    lines.push(`    skills: [${exp.skills.map((s) => `"${esc(s)}"`).join(", ")}],`);
    lines.push(`  },`);
  }
  lines.push(`];`);
  lines.push(``);

  // Education
  lines.push(`export const education = [`);
  for (const edu of data.education) {
    lines.push(`  {`);
    lines.push(`    institution: "${esc(edu.institution)}",`);
    lines.push(`    url: "${esc(edu.url)}",`);
    lines.push(`    logoUrl: "${esc(edu.logoUrl)}",`);
    lines.push(`    degree: "${esc(edu.degree)}",`);
    lines.push(`    sub: "${esc(edu.sub)}",`);
    lines.push(`    period: ["${esc(edu.period[0])}", "${esc(edu.period[1])}"] as [string, string],`);
    lines.push(`  },`);
  }
  lines.push(`];`);
  lines.push(``);

  // Books interface + data
  lines.push(`// ── Books ────────────────────────────────────────────────────────────`);
  lines.push(`export interface Book {`);
  lines.push(`  title: string;`);
  lines.push(`  author: string;`);
  lines.push(`  coverUrl: string;`);
  lines.push(`  genre: string;`);
  lines.push(`  language: "english" | "telugu";`);
  lines.push(`  rating?: number;`);
  lines.push(`  review?: string;`);
  lines.push(`}`);
  lines.push(``);

  const renderBook = (book: PortfolioData["booksRead"][0]) => {
    lines.push(`  {`);
    lines.push(`    title: "${esc(book.title)}",`);
    lines.push(`    author: "${esc(book.author)}",`);
    lines.push(`    coverUrl: "${esc(book.coverUrl)}",`);
    lines.push(`    genre: "${esc(book.genre)}",`);
    lines.push(`    language: "${book.language}",`);
    if (book.rating !== undefined && book.rating !== null) {
      lines.push(`    rating: ${book.rating},`);
    }
    if (book.review) {
      lines.push(`    review: "${esc(book.review)}",`);
    }
    lines.push(`  },`);
  };

  lines.push(`export const booksCurrentlyReading: Book[] = [`);
  for (const book of data.booksCurrentlyReading) renderBook(book);
  lines.push(`];`);
  lines.push(``);

  lines.push(`export const booksRead: Book[] = [`);
  for (const book of data.booksRead) renderBook(book);
  lines.push(`];`);
  lines.push(``);

  lines.push(`export const booksMeta = {`);
  lines.push(`  title: "${esc(data.booksMeta.title)}",`);
  lines.push(`  description:`);
  lines.push(`    "${esc(data.booksMeta.description)}",`);
  lines.push(`  heading: "${esc(data.booksMeta.heading)}",`);
  lines.push(`  subheading:`);
  lines.push(`    "${esc(data.booksMeta.subheading)}",`);
  lines.push(`};`);
  lines.push(``);

  // Projects
  lines.push(`// ── Projects ─────────────────────────────────────────────────────────`);
  lines.push(`export interface Project {`);
  lines.push(`  title: string;`);
  lines.push(`  description: string;`);
  lines.push(`  tags: string[];`);
  lines.push(`  url?: string;`);
  lines.push(`  githubUrl?: string;`);
  lines.push(`  imageUrl: string;`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`export const projects: Project[] = [`);
  for (const proj of data.projects) {
    lines.push(`  {`);
    lines.push(`    title: "${esc(proj.title)}",`);
    lines.push(`    description:`);
    lines.push(`      "${esc(proj.description)}",`);
    lines.push(`    tags: [${proj.tags.map((t) => `"${esc(t)}"`).join(", ")}],`);
    if (proj.url) lines.push(`    url: "${esc(proj.url)}",`);
    if (proj.githubUrl) lines.push(`    githubUrl: "${esc(proj.githubUrl)}",`);
    lines.push(`    imageUrl:`);
    lines.push(`      "${esc(proj.imageUrl)}",`);
    lines.push(`  },`);
  }
  lines.push(`];`);
  lines.push(``);

  lines.push(`export const projectsMeta = {`);
  lines.push(`  title: "${esc(data.projectsMeta.title)}",`);
  lines.push(`  description: "${esc(data.projectsMeta.description)}",`);
  lines.push(`  heading: "${esc(data.projectsMeta.heading)}",`);
  lines.push(`  subheading:`);
  lines.push(`    "${esc(data.projectsMeta.subheading)}",`);
  lines.push(`};`);
  lines.push(``);

  // Blogs
  lines.push(`// ── Blogs ────────────────────────────────────────────────────────────`);
  lines.push(`export interface BlogPost {`);
  lines.push(`  title: string;`);
  lines.push(`  excerpt: string;`);
  lines.push(`  date: string;`);
  lines.push(`  readTime: string;`);
  lines.push(`  tags: string[];`);
  lines.push(`  slug: string;`);
  lines.push(`  coverUrl: string;`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`export const blogs: BlogPost[] = [`);
  for (const blog of data.blogs) {
    lines.push(`  {`);
    lines.push(`    title: "${esc(blog.title)}",`);
    lines.push(`    excerpt:`);
    lines.push(`      "${esc(blog.excerpt)}",`);
    lines.push(`    date: "${esc(blog.date)}",`);
    lines.push(`    readTime: "${esc(blog.readTime)}",`);
    lines.push(`    tags: [${blog.tags.map((t) => `"${esc(t)}"`).join(", ")}],`);
    lines.push(`    slug: "${esc(blog.slug)}",`);
    lines.push(`    coverUrl:`);
    lines.push(`      "${esc(blog.coverUrl)}",`);
    lines.push(`  },`);
  }
  lines.push(`];`);
  lines.push(``);

  lines.push(`export const blogsMeta = {`);
  lines.push(`  title: "${esc(data.blogsMeta.title)}",`);
  lines.push(`  description:`);
  lines.push(`    "${esc(data.blogsMeta.description)}",`);
  lines.push(`  heading: "${esc(data.blogsMeta.heading)}",`);
  lines.push(`  subheading:`);
  lines.push(`    "${esc(data.blogsMeta.subheading)}",`);
  lines.push(`};`);
  lines.push(``);

  // About
  lines.push(`// ── About ────────────────────────────────────────────────────────────`);
  lines.push(`export const about = [`);
  for (const p of data.about) {
    lines.push(`  "${esc(p)}",`);
  }
  lines.push(`];`);
  lines.push(``);

  // Quote
  lines.push(`// ── Quote ────────────────────────────────────────────────────────────`);
  lines.push(`export const quote = {`);
  lines.push(`  text: "${esc(data.quote.text)}",`);
  lines.push(`  author: "${esc(data.quote.author)}",`);
  lines.push(`};`);
  lines.push(``);

  // Footer
  lines.push(`// ── Footer ───────────────────────────────────────────────────────────`);
  lines.push(`export const footer = {`);
  lines.push(`  copyright: \`© \${new Date().getFullYear()} ${esc(data.profile.name)}\`,`);
  lines.push(`  tagline: "${esc(data.footer.tagline)}",`);
  lines.push(`  emoji: "${esc(data.footer.emoji)}",`);
  lines.push(`};`);
  lines.push(``);

  return lines.join("\n");
}

// writePortfolioFile removed — Vercel has a read-only filesystem.
// Admin saves commit directly to GitHub, which triggers a Vercel redeploy.

// ── Commit to GitHub via Contents API ────────────────────────────────
export async function commitToGitHub(
  content: string,
  message: string
): Promise<{ success: boolean; error?: string; commitUrl?: string }> {
  const token = getEnvVar("GITHUB_TOKEN");
  const repo = getEnvVar("GITHUB_REPO");
  const branch = getEnvVar("GITHUB_BRANCH") || "main";

  console.log("[admin] GitHub commit attempt:", { hasToken: !!token, repo, branch });

  if (!token || !repo) {
    console.error("[admin] Missing env vars — GITHUB_TOKEN:", !!token, "GITHUB_REPO:", repo);
    return { success: false, error: "GITHUB_TOKEN or GITHUB_REPO not configured in .env" };
  }

  const filePath = "app/data/portfolio.ts";
  const apiBase = `https://api.github.com/repos/${repo}/contents/${filePath}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };

  try {
    // 1. Get current file SHA
    console.log("[admin] Getting file SHA from GitHub...");
    const getRes = await fetch(`${apiBase}?ref=${branch}`, { headers });
    if (!getRes.ok) {
      const errBody = await getRes.text();
      console.error("[admin] SHA fetch failed:", getRes.status, errBody);
      return { success: false, error: `Failed to get file SHA: ${getRes.status} ${errBody}` };
    }
    const fileData = (await getRes.json()) as { sha: string };
    console.log("[admin] Got SHA:", fileData.sha);

    // 2. Update file with new content (use Buffer for proper base64 encoding)
    const encoded = Buffer.from(content, "utf-8").toString("base64");
    const putRes = await fetch(apiBase, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message,
        content: encoded,
        sha: fileData.sha,
        branch,
      }),
    });

    if (!putRes.ok) {
      const errBody = await putRes.text();
      console.error("[admin] Commit failed:", putRes.status, errBody);
      return { success: false, error: `Failed to commit: ${putRes.status} ${errBody}` };
    }

    const result = (await putRes.json()) as { commit?: { html_url?: string } };
    console.log("[admin] ✓ Committed to GitHub:", result.commit?.html_url);
    return {
      success: true,
      commitUrl: result.commit?.html_url,
    };
  } catch (err) {
    console.error("[admin] GitHub API error:", err);
    return { success: false, error: `GitHub API error: ${String(err)}` };
  }
}

// ── Build a descriptive commit message ───────────────────────────────
export function buildCommitMessage(
  original: PortfolioData,
  updated: PortfolioData
): string {
  const changes: string[] = [];

  // Profile
  if (JSON.stringify(original.profile) !== JSON.stringify(updated.profile)) {
    changes.push("profile");
  }
  // Nav
  if (JSON.stringify(original.nav) !== JSON.stringify(updated.nav)) {
    changes.push("navigation");
  }
  // Meta
  if (JSON.stringify(original.meta) !== JSON.stringify(updated.meta)) {
    changes.push("site meta");
  }
  // Social Links
  if (JSON.stringify(original.socialLinks) !== JSON.stringify(updated.socialLinks)) {
    changes.push("social links");
  }
  // GitHub
  if (JSON.stringify(original.github) !== JSON.stringify(updated.github)) {
    changes.push("github config");
  }
  // Experience
  if (JSON.stringify(original.experience) !== JSON.stringify(updated.experience)) {
    changes.push("experience");
  }
  // Education
  if (JSON.stringify(original.education) !== JSON.stringify(updated.education)) {
    changes.push("education");
  }
  // Books
  if (
    JSON.stringify(original.booksCurrentlyReading) !== JSON.stringify(updated.booksCurrentlyReading) ||
    JSON.stringify(original.booksRead) !== JSON.stringify(updated.booksRead) ||
    JSON.stringify(original.booksMeta) !== JSON.stringify(updated.booksMeta)
  ) {
    changes.push("books");
  }
  // Projects
  if (
    JSON.stringify(original.projects) !== JSON.stringify(updated.projects) ||
    JSON.stringify(original.projectsMeta) !== JSON.stringify(updated.projectsMeta)
  ) {
    changes.push("projects");
  }
  // Blogs
  if (
    JSON.stringify(original.blogs) !== JSON.stringify(updated.blogs) ||
    JSON.stringify(original.blogsMeta) !== JSON.stringify(updated.blogsMeta)
  ) {
    changes.push("blogs");
  }
  // About
  if (JSON.stringify(original.about) !== JSON.stringify(updated.about)) {
    changes.push("about");
  }
  // Quote
  if (JSON.stringify(original.quote) !== JSON.stringify(updated.quote)) {
    changes.push("quote");
  }
  // Footer
  if (JSON.stringify(original.footer) !== JSON.stringify(updated.footer)) {
    changes.push("footer");
  }

  if (changes.length === 0) return "Update portfolio data";
  return `Update ${changes.join(", ")}`;
}
