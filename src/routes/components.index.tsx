import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpDown, Search } from "lucide-react";
import { Input, Select, Badge, ProgressBar, Pagination } from "@/cedar";
import type { BadgeColor } from "@/cedar";
import { components, categories, type ComponentStatus } from "@/lib/cedar-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/components/")({
  head: () => ({
    meta: [
      { title: "Components — Cedar Ops" },
      { name: "description", content: "Browse all Cedar components, their adoption, status, and variants." },
    ],
  }),
  component: ComponentsPage,
});

type SortKey = "name" | "category" | "status" | "adoption" | "variants" | "updated";
const PAGE_SIZE = 10;

function statusBadge(s: ComponentStatus): { color: BadgeColor } {
  if (s === "Stable") return { color: "success" };
  if (s === "Beta") return { color: "warning" };
  return { color: "error" };
}

function ComponentsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = components.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
    if (cat !== "all") list = list.filter((c) => c.category === cat);
    list = [...list].sort((a, b) => {
      let av: string | number = a[sortKey === "updated" ? "updatedDays" : sortKey] as string | number;
      let bv: string | number = b[sortKey === "updated" ? "updatedDays" : sortKey] as string | number;
      if (sortKey === "variants") {
        av = typeof a.variants === "number" ? a.variants : -1;
        bv = typeof b.variants === "number" ? b.variants : -1;
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [query, cat, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }

  const thStyle = { padding: '12px 16px', textAlign: 'left' as const, fontSize: 'var(--size-xs)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)', whiteSpace: 'nowrap' as const };

  const Th = ({ k, children, className }: { k: SortKey; children: React.ReactNode; className?: string }) => (
    <th className={className} style={thStyle}>
      <button
        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-base)', fontSize: 'var(--size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: sortKey === k ? 'var(--text-base)' : 'var(--text-subtle)', padding: 0 }}
        onClick={() => toggleSort(k)}>
        {children}
        <ArrowUpDown style={{ width: 12, height: 12, color: sortKey === k ? 'var(--action-primary)' : 'var(--text-subtle)' }} />
      </button>
    </th>
  );

  const categoryOptions = [
    { value: "all", label: "All categories" },
    ...categories.map((c) => ({ value: c, label: c })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ fontSize: 'var(--title-md)', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-base)', fontFamily: 'var(--font-base)', margin: 0 }}>Components</h1>
        <p style={{ marginTop: 'var(--space-1)', fontSize: 'var(--body-sm)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)' }}>{components.length} components in the Cedar library.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div style={{ position: 'relative', flex: 1, maxWidth: 384 }}>
          <Input
            placeholder="Search components…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            leadingIcon={<Search size={16} />}
          />
        </div>
        <div style={{ width: 192 }}>
          <Select
            value={cat}
            onChange={(v) => { setCat(v); setPage(1); }}
            options={categoryOptions}
            placeholder="All categories"
          />
        </div>
      </div>

      <div style={{ overflow: 'hidden', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-base)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-faint)' }}>
            <tr>
              <Th k="name">Component</Th>
              <Th k="category">Category</Th>
              <Th k="status">Status</Th>
              <Th k="adoption">Adoption</Th>
              <Th k="variants">Variants</Th>
              <Th k="updated">Updated</Th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c) => (
              <tr
                key={c.slug}
                style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'background-color 0.1s' }}
                onClick={() => navigate({ to: "/components/$slug", params: { slug: c.slug } })}
                onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'var(--bg-faint)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = ''; }}
              >
                <td style={{ padding: '12px 16px', fontSize: 'var(--body-sm)', fontWeight: 500, color: 'var(--text-base)', fontFamily: 'var(--font-base)' }}>{c.name}</td>
                <td style={{ padding: '12px 16px', fontSize: 'var(--body-sm)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)' }}>{c.category}</td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge {...statusBadge(c.status)} badgeStyle="subtle">{c.status}</Badge>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <div style={{ width: 96, flexShrink: 0 }}>
                      <ProgressBar value={c.adoption} size="sm" />
                    </div>
                    <span style={{ fontSize: 'var(--size-xs)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)', tabularNums: true } as React.CSSProperties}>{c.adoption}%</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 'var(--body-sm)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)' }}>{c.variants}</td>
                <td style={{ padding: '12px 16px', fontSize: 'var(--body-sm)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)' }}>{c.updated}</td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '48px 16px', textAlign: 'center', fontSize: 'var(--body-sm)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)' }}>
                  No components match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 'var(--body-sm)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)' }}>
          Showing {paged.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{(currentPage - 1) * PAGE_SIZE + paged.length} of {filtered.length}
        </span>
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setPage} />
      </div>
    </div>
  );
}
