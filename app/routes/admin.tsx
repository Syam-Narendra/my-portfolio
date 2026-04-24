import { useState, useEffect } from "react";
import type { MetaFunction } from "react-router";
import { redirect, useLoaderData, useActionData, Form, useNavigation } from "react-router";
import type { Route } from "./+types/admin";
import { requireAdmin, destroySessionCookie } from "./auth.server";
import {
  readPortfolioData,
  generatePortfolioFile,
  writePortfolioFile,
  commitToGitHub,
  buildCommitMessage,
  type PortfolioData,
} from "./admin-actions.server";
import { Field, TextInput, TextArea, TagEditor, ItemCard, tabIcons } from "~/components/AdminFields";
import "~/admin.css";

export const meta: MetaFunction = () => [
  { title: "Admin Dashboard" },
  { name: "robots", content: "noindex, nofollow" },
];

export async function loader({ request }: Route.LoaderArgs) {
  requireAdmin(request);
  const data = await readPortfolioData();
  return { data };
}

export async function action({ request }: Route.ActionArgs) {
  requireAdmin(request);

  const form = await request.formData();
  const intent = form.get("intent");

  if (intent === "logout") {
    return redirect("/admin/login", {
      headers: { "Set-Cookie": destroySessionCookie() },
    });
  }

  if (intent === "save") {
    const rawData = form.get("portfolioData");
    if (!rawData || typeof rawData !== "string") {
      console.error("[admin] No portfolioData in form");
      return { error: "No data received" };
    }

    try {
      const original = await readPortfolioData();
      const updated: PortfolioData = JSON.parse(rawData);
      const content = generatePortfolioFile(updated);
      const message = buildCommitMessage(original, updated);

      console.log("[admin] Writing portfolio.ts locally...");
      await writePortfolioFile(content);
      console.log("[admin] ✓ Local write done");

      console.log("[admin] Pushing to GitHub...");
      const ghResult = await commitToGitHub(content, message);
      if (!ghResult.success) {
        console.warn("[admin] GitHub push failed:", ghResult.error);
        return { success: true, warning: `Saved locally but GitHub commit failed: ${ghResult.error}` };
      }

      console.log("[admin] ✓ All done. Commit:", ghResult.commitUrl);
      return { success: true, message: `Saved & committed: "${message}"`, commitUrl: ghResult.commitUrl };
    } catch (err) {
      console.error("[admin] Save error:", err);
      return { error: `Save failed: ${String(err)}` };
    }
  }

  return { error: "Unknown action" };
}

type Tab = "profile" | "experience" | "education" | "projects" | "books" | "blogs" | "about" | "settings";
const TABS: { key: Tab; label: string }[] = [
  { key: "profile", label: "Profile" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "projects", label: "Projects" },
  { key: "books", label: "Books" },
  { key: "blogs", label: "Blogs" },
  { key: "about", label: "About & Quote" },
  { key: "settings", label: "Settings" },
];

export default function Admin() {
  const { data: initialData } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [data, setData] = useState<PortfolioData>(initialData);
  const [tab, setTab] = useState<Tab>("profile");
  const [toast, setToast] = useState<{ type: "success" | "error" | "warning"; msg: string } | null>(null);
  const [dirty, setDirty] = useState(false);
  const navigation = useNavigation();
  const saving = navigation.state === "submitting";

  function update<K extends keyof PortfolioData>(key: K, val: PortfolioData[K]) {
    setData((d) => ({ ...d, [key]: val }));
    setDirty(true);
  }

  function showToast(type: "success" | "error" | "warning", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 6000);
  }

  // React to action results
  useEffect(() => {
    if (!actionData) return;
    if ("error" in actionData && actionData.error) {
      showToast("error", actionData.error);
    } else if ("warning" in actionData && actionData.warning) {
      showToast("warning", String(actionData.warning));
      setDirty(false);
    } else if ("success" in actionData && actionData.success) {
      showToast("success", (actionData as { message?: string }).message || "Saved successfully!");
      setDirty(false);
    }
  }, [actionData]);

  return (
    <div className="admin-wrap">
      {/* Top Bar */}
      <header className="admin-top">
        <h1>
          <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="#6366f1" strokeWidth={2}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <span>Portfolio Admin</span>
        </h1>
        <Form method="post">
          <input type="hidden" name="intent" value="logout" />
          <button type="submit" className="admin-logout">Sign Out</button>
        </Form>
      </header>

      <div className="admin-body">
        {/* Sidebar */}
        <nav className="admin-sidebar">
          {TABS.map((t) => (
            <button key={t.key} className={tab === t.key ? "active" : ""} onClick={() => setTab(t.key)}>
              {tabIcons[t.key]}
              {t.label}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <div className="admin-main">
          {tab === "profile" && <ProfileTab data={data} update={update} />}
          {tab === "experience" && <ExperienceTab data={data} update={update} />}
          {tab === "education" && <EducationTab data={data} update={update} />}
          {tab === "projects" && <ProjectsTab data={data} update={update} />}
          {tab === "books" && <BooksTab data={data} update={update} />}
          {tab === "blogs" && <BlogsTab data={data} update={update} />}
          {tab === "about" && <AboutTab data={data} update={update} />}
          {tab === "settings" && <SettingsTab data={data} update={update} />}
        </div>
      </div>

      {/* Save Bar */}
      {dirty && (
        <Form
          method="post"
          className="admin-save-bar"
        >
          <input type="hidden" name="intent" value="save" />
          <input type="hidden" name="portfolioData" value={JSON.stringify(data)} />
          <span style={{ fontSize: 13, color: "#a1a1aa", marginRight: 8 }}>You have unsaved changes</span>
          <button type="button" className="admin-btn admin-btn-outline" onClick={() => { setData(initialData); setDirty(false); }}>
            Discard
          </button>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save & Push to GitHub"}
          </button>
        </Form>
      )}

      {/* Toast */}
      {toast && (
        <div className={`admin-toast admin-toast-${toast.type === "warning" ? "error" : toast.type}`}>
          {toast.type === "success" ? "✓" : "⚠"} {toast.msg}
        </div>
      )}
    </div>
  );
}

// ── Tab Components ──────────────────────────────────────────────────

type TabProps = {
  data: PortfolioData;
  update: <K extends keyof PortfolioData>(key: K, val: PortfolioData[K]) => void;
};

function ProfileTab({ data, update }: TabProps) {
  const p = data.profile;
  const set = (k: keyof typeof p, v: string) => update("profile", { ...p, [k]: v });
  return (
    <>
      <div className="admin-card">
        <h2>{tabIcons.profile} Profile</h2>
        <div className="admin-row">
          <Field label="Name"><TextInput value={p.name} onChange={(v) => set("name", v)} /></Field>
          <Field label="Tagline"><TextInput value={p.tagline} onChange={(v) => set("tagline", v)} /></Field>
        </div>
        <Field label="Avatar URL"><TextInput value={p.avatarUrl} onChange={(v) => set("avatarUrl", v)} /></Field>
        <div className="admin-row">
          <Field label="Status Checking"><TextInput value={p.statusChecking} onChange={(v) => set("statusChecking", v)} /></Field>
          <Field label="Status Ready"><TextInput value={p.statusReady} onChange={(v) => set("statusReady", v)} /></Field>
        </div>
      </div>

      <div className="admin-card">
        <h2>{tabIcons.settings} Site Meta</h2>
        <Field label="Title"><TextInput value={data.meta.title} onChange={(v) => update("meta", { ...data.meta, title: v })} /></Field>
        <Field label="Description"><TextArea value={data.meta.description} onChange={(v) => update("meta", { ...data.meta, description: v })} /></Field>
      </div>

      <div className="admin-card">
        <h2>Social Links</h2>
        {data.socialLinks.map((sl, i) => (
          <ItemCard key={i} title={sl.label || `Link ${i + 1}`} onRemove={() => update("socialLinks", data.socialLinks.filter((_, j) => j !== i))}>
            <div className="admin-row-3">
              <Field label="Label"><TextInput value={sl.label} onChange={(v) => { const arr = [...data.socialLinks]; arr[i] = { ...sl, label: v }; update("socialLinks", arr); }} /></Field>
              <Field label="Icon"><TextInput value={sl.icon} onChange={(v) => { const arr = [...data.socialLinks]; arr[i] = { ...sl, icon: v }; update("socialLinks", arr); }} /></Field>
              <Field label="URL"><TextInput value={sl.href} onChange={(v) => { const arr = [...data.socialLinks]; arr[i] = { ...sl, href: v }; update("socialLinks", arr); }} /></Field>
            </div>
          </ItemCard>
        ))}
        <button type="button" className="admin-btn admin-btn-outline" onClick={() => update("socialLinks", [...data.socialLinks, { label: "", href: "", icon: "" }])}>
          + Add Social Link
        </button>
      </div>

      <div className="admin-card">
        <h2>Navigation</h2>
        <div className="admin-row">
          <Field label="Logo URL"><TextInput value={data.nav.logoUrl} onChange={(v) => update("nav", { ...data.nav, logoUrl: v })} /></Field>
          <Field label="Logo Alt"><TextInput value={data.nav.logoAlt} onChange={(v) => update("nav", { ...data.nav, logoAlt: v })} /></Field>
        </div>
        {data.nav.links.map((link, i) => (
          <div key={i} className="admin-row" style={{ marginBottom: 8 }}>
            <Field label={`Link ${i + 1} Label`}>
              <TextInput value={link.label} onChange={(v) => { const arr = [...data.nav.links]; arr[i] = { ...link, label: v }; update("nav", { ...data.nav, links: arr }); }} />
            </Field>
            <Field label={`Link ${i + 1} Href`}>
              <div style={{ display: "flex", gap: 6 }}>
                <TextInput value={link.href} onChange={(v) => { const arr = [...data.nav.links]; arr[i] = { ...link, href: v }; update("nav", { ...data.nav, links: arr }); }} />
                <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => { const arr = data.nav.links.filter((_, j) => j !== i); update("nav", { ...data.nav, links: arr }); }}>×</button>
              </div>
            </Field>
          </div>
        ))}
        <button type="button" className="admin-btn admin-btn-outline" onClick={() => update("nav", { ...data.nav, links: [...data.nav.links, { label: "", href: "" }] })}>
          + Add Nav Link
        </button>
      </div>
    </>
  );
}

function ExperienceTab({ data, update }: TabProps) {
  const exps = data.experience;
  const setExp = (i: number, k: string, v: unknown) => {
    const arr = [...exps];
    arr[i] = { ...arr[i], [k]: v };
    update("experience", arr);
  };
  return (
    <div className="admin-card">
      <h2>{tabIcons.experience} Experience</h2>
      {exps.map((exp, i) => (
        <ItemCard key={i} title={exp.company || `Entry ${i + 1}`} onRemove={() => update("experience", exps.filter((_, j) => j !== i))}>
          <div className="admin-row">
            <Field label="Company"><TextInput value={exp.company} onChange={(v) => setExp(i, "company", v)} /></Field>
            <Field label="Role"><TextInput value={exp.role} onChange={(v) => setExp(i, "role", v)} /></Field>
          </div>
          <div className="admin-row-3">
            <Field label="Company URL"><TextInput value={exp.companyUrl} onChange={(v) => setExp(i, "companyUrl", v)} /></Field>
            <Field label="Logo URL"><TextInput value={exp.logoUrl} onChange={(v) => setExp(i, "logoUrl", v)} /></Field>
            <Field label="Type"><TextInput value={exp.type} onChange={(v) => setExp(i, "type", v)} /></Field>
          </div>
          <div className="admin-row">
            <Field label="Period Start"><TextInput value={exp.period[0]} onChange={(v) => setExp(i, "period", [v, exp.period[1]])} /></Field>
            <Field label="Period End"><TextInput value={exp.period[1]} onChange={(v) => setExp(i, "period", [exp.period[0], v])} /></Field>
          </div>
          <Field label="Skills"><TagEditor tags={exp.skills} onChange={(v) => setExp(i, "skills", v)} /></Field>
        </ItemCard>
      ))}
      <button type="button" className="admin-btn admin-btn-outline" onClick={() => update("experience", [...exps, { company: "", companyUrl: "", logoUrl: "", role: "", type: "Full-time", period: ["", ""] as [string, string], skills: [] }])}>
        + Add Experience
      </button>
    </div>
  );
}

function EducationTab({ data, update }: TabProps) {
  const edus = data.education;
  const setEdu = (i: number, k: string, v: unknown) => {
    const arr = [...edus];
    arr[i] = { ...arr[i], [k]: v };
    update("education", arr);
  };
  return (
    <div className="admin-card">
      <h2>{tabIcons.education} Education</h2>
      {edus.map((edu, i) => (
        <ItemCard key={i} title={edu.institution || `Entry ${i + 1}`} onRemove={() => update("education", edus.filter((_, j) => j !== i))}>
          <Field label="Institution"><TextInput value={edu.institution} onChange={(v) => setEdu(i, "institution", v)} /></Field>
          <div className="admin-row">
            <Field label="URL"><TextInput value={edu.url} onChange={(v) => setEdu(i, "url", v)} /></Field>
            <Field label="Logo URL"><TextInput value={edu.logoUrl} onChange={(v) => setEdu(i, "logoUrl", v)} /></Field>
          </div>
          <div className="admin-row">
            <Field label="Degree"><TextInput value={edu.degree} onChange={(v) => setEdu(i, "degree", v)} /></Field>
            <Field label="Subject"><TextInput value={edu.sub} onChange={(v) => setEdu(i, "sub", v)} /></Field>
          </div>
          <div className="admin-row">
            <Field label="Period Start"><TextInput value={edu.period[0]} onChange={(v) => setEdu(i, "period", [v, edu.period[1]])} /></Field>
            <Field label="Period End"><TextInput value={edu.period[1]} onChange={(v) => setEdu(i, "period", [edu.period[0], v])} /></Field>
          </div>
        </ItemCard>
      ))}
      <button type="button" className="admin-btn admin-btn-outline" onClick={() => update("education", [...edus, { institution: "", url: "", logoUrl: "", degree: "", sub: "", period: ["", ""] as [string, string] }])}>
        + Add Education
      </button>
    </div>
  );
}

function ProjectsTab({ data, update }: TabProps) {
  const projs = data.projects;
  const setProj = (i: number, k: string, v: unknown) => {
    const arr = [...projs];
    arr[i] = { ...arr[i], [k]: v };
    update("projects", arr);
  };
  return (
    <>
      <div className="admin-card">
        <h2>{tabIcons.projects} Projects</h2>
        {projs.map((proj, i) => (
          <ItemCard key={i} title={proj.title || `Project ${i + 1}`} onRemove={() => update("projects", projs.filter((_, j) => j !== i))}>
            <div className="admin-row">
              <Field label="Title"><TextInput value={proj.title} onChange={(v) => setProj(i, "title", v)} /></Field>
              <Field label="Image URL"><TextInput value={proj.imageUrl} onChange={(v) => setProj(i, "imageUrl", v)} /></Field>
            </div>
            <Field label="Description"><TextArea value={proj.description} onChange={(v) => setProj(i, "description", v)} /></Field>
            <div className="admin-row">
              <Field label="Live URL"><TextInput value={proj.url || ""} onChange={(v) => setProj(i, "url", v || undefined)} /></Field>
              <Field label="GitHub URL"><TextInput value={proj.githubUrl || ""} onChange={(v) => setProj(i, "githubUrl", v || undefined)} /></Field>
            </div>
            <Field label="Tags"><TagEditor tags={proj.tags} onChange={(v) => setProj(i, "tags", v)} /></Field>
          </ItemCard>
        ))}
        <button type="button" className="admin-btn admin-btn-outline" onClick={() => update("projects", [...projs, { title: "", description: "", tags: [], imageUrl: "" }])}>
          + Add Project
        </button>
      </div>

      <div className="admin-card">
        <h2>Projects Page Meta</h2>
        <div className="admin-row">
          <Field label="Title"><TextInput value={data.projectsMeta.title} onChange={(v) => update("projectsMeta", { ...data.projectsMeta, title: v })} /></Field>
          <Field label="Heading"><TextInput value={data.projectsMeta.heading} onChange={(v) => update("projectsMeta", { ...data.projectsMeta, heading: v })} /></Field>
        </div>
        <Field label="Description"><TextArea value={data.projectsMeta.description} onChange={(v) => update("projectsMeta", { ...data.projectsMeta, description: v })} /></Field>
        <Field label="Subheading"><TextArea value={data.projectsMeta.subheading} onChange={(v) => update("projectsMeta", { ...data.projectsMeta, subheading: v })} /></Field>
      </div>
    </>
  );
}

function BooksTab({ data, update }: TabProps) {
  const renderBookList = (
    key: "booksCurrentlyReading" | "booksRead",
    label: string,
    books: PortfolioData["booksRead"]
  ) => {
    const setBook = (i: number, k: string, v: unknown) => {
      const arr = [...books];
      arr[i] = { ...arr[i], [k]: v };
      update(key, arr);
    };
    return (
      <div className="admin-card">
        <h2>{tabIcons.books} {label}</h2>
        {books.map((book, i) => (
          <ItemCard key={i} title={book.title || `Book ${i + 1}`} onRemove={() => update(key, books.filter((_, j) => j !== i))}>
            <div className="admin-row">
              <Field label="Title"><TextInput value={book.title} onChange={(v) => setBook(i, "title", v)} /></Field>
              <Field label="Author"><TextInput value={book.author} onChange={(v) => setBook(i, "author", v)} /></Field>
            </div>
            <div className="admin-row-3">
              <Field label="Cover URL"><TextInput value={book.coverUrl} onChange={(v) => setBook(i, "coverUrl", v)} /></Field>
              <Field label="Genre"><TextInput value={book.genre} onChange={(v) => setBook(i, "genre", v)} /></Field>
              <Field label="Language">
                <select value={book.language} onChange={(e) => setBook(i, "language", e.target.value)}>
                  <option value="english">English</option>
                  <option value="telugu">Telugu</option>
                </select>
              </Field>
            </div>
            {key === "booksRead" && (
              <>
                <Field label="Rating (1-5)">
                  <input type="number" min={1} max={5} value={book.rating ?? ""} onChange={(e) => setBook(i, "rating", e.target.value ? Number(e.target.value) : undefined)} />
                </Field>
                <Field label="Review"><TextArea value={book.review || ""} onChange={(v) => setBook(i, "review", v)} rows={3} /></Field>
              </>
            )}
          </ItemCard>
        ))}
        <button type="button" className="admin-btn admin-btn-outline" onClick={() => update(key, [...books, { title: "", author: "", coverUrl: "", genre: "", language: "english" as const }])}>
          + Add Book
        </button>
      </div>
    );
  };

  return (
    <>
      {renderBookList("booksCurrentlyReading", "Currently Reading", data.booksCurrentlyReading)}
      {renderBookList("booksRead", "Books Read", data.booksRead)}
      <div className="admin-card">
        <h2>Books Page Meta</h2>
        <div className="admin-row">
          <Field label="Title"><TextInput value={data.booksMeta.title} onChange={(v) => update("booksMeta", { ...data.booksMeta, title: v })} /></Field>
          <Field label="Heading"><TextInput value={data.booksMeta.heading} onChange={(v) => update("booksMeta", { ...data.booksMeta, heading: v })} /></Field>
        </div>
        <Field label="Description"><TextArea value={data.booksMeta.description} onChange={(v) => update("booksMeta", { ...data.booksMeta, description: v })} /></Field>
        <Field label="Subheading"><TextArea value={data.booksMeta.subheading} onChange={(v) => update("booksMeta", { ...data.booksMeta, subheading: v })} /></Field>
      </div>
    </>
  );
}

function BlogsTab({ data, update }: TabProps) {
  const blogs = data.blogs;
  const setBlog = (i: number, k: string, v: unknown) => {
    const arr = [...blogs];
    arr[i] = { ...arr[i], [k]: v };
    update("blogs", arr);
  };
  return (
    <>
      <div className="admin-card">
        <h2>{tabIcons.blogs} Blog Posts</h2>
        {blogs.map((blog, i) => (
          <ItemCard key={i} title={blog.title || `Post ${i + 1}`} onRemove={() => update("blogs", blogs.filter((_, j) => j !== i))}>
            <Field label="Title"><TextInput value={blog.title} onChange={(v) => setBlog(i, "title", v)} /></Field>
            <Field label="Excerpt"><TextArea value={blog.excerpt} onChange={(v) => setBlog(i, "excerpt", v)} /></Field>
            <div className="admin-row-3">
              <Field label="Date"><TextInput value={blog.date} onChange={(v) => setBlog(i, "date", v)} placeholder="YYYY-MM-DD" /></Field>
              <Field label="Read Time"><TextInput value={blog.readTime} onChange={(v) => setBlog(i, "readTime", v)} placeholder="8 min read" /></Field>
              <Field label="Slug"><TextInput value={blog.slug} onChange={(v) => setBlog(i, "slug", v)} /></Field>
            </div>
            <Field label="Cover URL"><TextInput value={blog.coverUrl} onChange={(v) => setBlog(i, "coverUrl", v)} /></Field>
            <Field label="Tags"><TagEditor tags={blog.tags} onChange={(v) => setBlog(i, "tags", v)} /></Field>
          </ItemCard>
        ))}
        <button type="button" className="admin-btn admin-btn-outline" onClick={() => update("blogs", [...blogs, { title: "", excerpt: "", date: new Date().toISOString().split("T")[0], readTime: "", tags: [], slug: "", coverUrl: "" }])}>
          + Add Blog Post
        </button>
      </div>

      <div className="admin-card">
        <h2>Blog Page Meta</h2>
        <div className="admin-row">
          <Field label="Title"><TextInput value={data.blogsMeta.title} onChange={(v) => update("blogsMeta", { ...data.blogsMeta, title: v })} /></Field>
          <Field label="Heading"><TextInput value={data.blogsMeta.heading} onChange={(v) => update("blogsMeta", { ...data.blogsMeta, heading: v })} /></Field>
        </div>
        <Field label="Description"><TextArea value={data.blogsMeta.description} onChange={(v) => update("blogsMeta", { ...data.blogsMeta, description: v })} /></Field>
        <Field label="Subheading"><TextArea value={data.blogsMeta.subheading} onChange={(v) => update("blogsMeta", { ...data.blogsMeta, subheading: v })} /></Field>
      </div>
    </>
  );
}

function AboutTab({ data, update }: TabProps) {
  return (
    <>
      <div className="admin-card">
        <h2>{tabIcons.about} About Paragraphs</h2>
        {data.about.map((para, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <label style={{ fontSize: 12, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: ".04em" }}>Paragraph {i + 1}</label>
              <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => update("about", data.about.filter((_, j) => j !== i))}>Remove</button>
            </div>
            <TextArea value={para} onChange={(v) => { const arr = [...data.about]; arr[i] = v; update("about", arr); }} rows={3} />
          </div>
        ))}
        <button type="button" className="admin-btn admin-btn-outline" onClick={() => update("about", [...data.about, ""])}>
          + Add Paragraph
        </button>
      </div>

      <div className="admin-card">
        <h2>Quote</h2>
        <Field label="Quote Text"><TextArea value={data.quote.text} onChange={(v) => update("quote", { ...data.quote, text: v })} rows={3} /></Field>
        <Field label="Author"><TextInput value={data.quote.author} onChange={(v) => update("quote", { ...data.quote, author: v })} /></Field>
      </div>
    </>
  );
}

function SettingsTab({ data, update }: TabProps) {
  return (
    <>
      <div className="admin-card">
        <h2>{tabIcons.settings} Footer</h2>
        <Field label="Tagline"><TextInput value={data.footer.tagline} onChange={(v) => update("footer", { ...data.footer, tagline: v })} /></Field>
        <Field label="Emoji"><TextInput value={data.footer.emoji} onChange={(v) => update("footer", { ...data.footer, emoji: v })} /></Field>
      </div>

      <div className="admin-card">
        <h2>GitHub</h2>
        <Field label="GitHub Username"><TextInput value={data.github.username} onChange={(v) => update("github", { ...data.github, username: v })} /></Field>
      </div>
    </>
  );
}
