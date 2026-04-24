// Reusable admin form components
import type { ReactNode } from "react";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      {children}
    </div>
  );
}

export function TextInput({
  value, onChange, placeholder,
}: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />;
}

export function TextArea({
  value, onChange, placeholder, rows,
}: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} />;
}

export function TagEditor({
  tags, onChange,
}: { tags: string[]; onChange: (tags: string[]) => void }) {
  const addTag = (input: HTMLInputElement) => {
    const v = input.value.trim();
    if (v && !tags.includes(v)) {
      onChange([...tags, v]);
      input.value = "";
    }
  };
  return (
    <div>
      <div className="admin-tags">
        {tags.map((t, i) => (
          <span key={i} className="admin-tag">
            {t}
            <button type="button" onClick={() => onChange(tags.filter((_, j) => j !== i))}>×</button>
          </span>
        ))}
      </div>
      <div className="admin-tag-input">
        <input
          type="text"
          placeholder="Add tag + Enter"
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); addTag(e.currentTarget); }
          }}
        />
        <button
          type="button"
          className="admin-btn admin-btn-outline admin-btn-sm"
          onClick={(e) => {
            const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
            addTag(input);
          }}
        >+</button>
      </div>
    </div>
  );
}

export function ItemCard({
  title, onRemove, children,
}: { title: string; onRemove: () => void; children: ReactNode }) {
  return (
    <div className="admin-item">
      <div className="admin-item-head">
        <h3>{title}</h3>
        <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={onRemove}>
          Remove
        </button>
      </div>
      {children}
    </div>
  );
}

// Tab sidebar icons (SVG paths)
export const tabIcons: Record<string, ReactNode> = {
  profile: <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  experience: <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  education: <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 6 3 6 3s3 0 6-3v-5"/></svg>,
  projects: <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>,
  books: <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  blogs: <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  about: <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  settings: <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
};
