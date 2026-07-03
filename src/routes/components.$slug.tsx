import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Badge, Tabs, Tooltip, Button, Alert, ProgressBar } from "@/cedar";
import type { TabDef } from "@/cedar";
import { getComponent, mockProps, mockChangelog } from "@/lib/cedar-data";

export const Route = createFileRoute("/components/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Cedar Ops` },
      { name: "description", content: `Usage, specs, and changelog for the Cedar component.` },
    ],
  }),
  loader: ({ params }) => {
    const comp = getComponent(params.slug);
    if (!comp) throw notFound();
    return comp;
  },
  component: ComponentDetail,
});

function statusColor(s: string): "success" | "warning" | "error" {
  if (s === "Stable") return "success";
  if (s === "Beta") return "warning";
  return "error";
}

function ComponentDetail() {
  const comp = Route.useLoaderData();

  const usageContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ padding: 'var(--space-8)', backgroundColor: 'var(--bg-faint)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <span style={{ fontSize: 'var(--body-sm)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)' }}>
          Component preview placeholder
        </span>
      </div>
      <div>
        <h3 style={{ fontSize: 'var(--body-sm)', fontWeight: 600, color: 'var(--text-base)', fontFamily: 'var(--font-base)', marginBottom: 'var(--space-3)', marginTop: 0 }}>Usage guidelines</h3>
        <p style={{ fontSize: 'var(--body-sm)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)', lineHeight: 1.6, margin: 0 }}>
          Use <strong>{comp.name}</strong> when you need a consistent, accessible UI element that adheres to Cedar's design language. It supports multiple variants and integrates with the token system for theming.
        </p>
        <ul style={{ marginTop: 'var(--space-4)', paddingLeft: 'var(--space-5)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)', fontSize: 'var(--body-sm)', lineHeight: 1.8 }}>
          <li>Prefer using semantic size tokens (<code>sm</code>, <code>md</code>, <code>lg</code>) over pixel values</li>
          <li>Always provide an accessible label where required</li>
          <li>Use the variant that fits the hierarchy of your page</li>
        </ul>
      </div>
      <div>
        <h3 style={{ fontSize: 'var(--body-sm)', fontWeight: 600, color: 'var(--text-base)', fontFamily: 'var(--font-base)', marginBottom: 'var(--space-3)', marginTop: 0 }}>Adoption</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ flex: 1 }}>
            <ProgressBar value={comp.adoption} size="md" />
          </div>
          <span style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--body-sm)', fontWeight: 600, color: 'var(--text-base)', whiteSpace: 'nowrap' }}>{comp.adoption}% adopted</span>
        </div>
        <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--size-xs)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)', margin: 'var(--space-2) 0 0 0' }}>Across all tracked products</p>
      </div>
    </div>
  );

  const specsContent = (
    <div style={{ overflow: 'hidden', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-base)' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-faint)', borderBottom: '1px solid var(--border-subtle)' }}>
            <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 'var(--size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-subtle)' }}>Prop</th>
            <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 'var(--size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-subtle)' }}>Type</th>
            <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 'var(--size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-subtle)' }}>Default</th>
            <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 'var(--size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-subtle)' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {mockProps.map((p, i) => (
            <tr key={p.name} style={{ borderBottom: i < mockProps.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <td style={{ padding: '12px 16px' }}>
                <Tooltip content={`The ${p.name} prop for ${comp.name}`}>
                  <code style={{ fontSize: 'var(--size-xs)', fontFamily: 'var(--font-mono)', backgroundColor: 'var(--bg-faint)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', color: 'var(--action-primary)', cursor: 'default' }}>{p.name}</code>
                </Tooltip>
              </td>
              <td style={{ padding: '12px 16px' }}>
                <code style={{ fontSize: 'var(--size-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-subtle)' }}>{p.type}</code>
              </td>
              <td style={{ padding: '12px 16px', fontSize: 'var(--size-xs)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)' }}>{p.default}</td>
              <td style={{ padding: '12px 16px', fontSize: 'var(--body-sm)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)' }}>{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const changelogContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {mockChangelog.map((entry, i) => (
        <div key={entry.version}>
          <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', backgroundColor: entry.breaking ? 'var(--status-error-bg)' : 'var(--bg-faint)', border: `1px solid ${entry.breaking ? 'var(--status-error)' : 'var(--border-subtle)'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--body-sm)', fontWeight: 600, color: 'var(--text-base)' }}>v{entry.version}</span>
              {entry.breaking && <Badge color="error" badgeStyle="subtle" size="sm">Breaking</Badge>}
              <span style={{ fontSize: 'var(--size-xs)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)', marginLeft: 'auto' }}>{entry.date}</span>
            </div>
            <p style={{ fontSize: 'var(--body-sm)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)', margin: 0, lineHeight: 1.5 }}>{entry.description}</p>
          </div>
          {entry.breaking && i === 0 && (
            <div style={{ marginTop: 'var(--space-2)' }}>
              <Alert variant="error">
                This version contains breaking changes. Review the migration guide before upgrading.
              </Alert>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const tabs: TabDef[] = [
    { id: 'usage', label: 'Usage', content: usageContent },
    { id: 'specs', label: 'Specs', content: specsContent },
    { id: 'changelog', label: 'Changelog', content: changelogContent },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <nav aria-label="Breadcrumb">
        <ol style={{ display: 'flex', alignItems: 'center', gap: 0, listStyle: 'none', margin: 0, padding: 0, fontFamily: 'var(--font-base)', fontSize: 'var(--body-sm)' }}>
          <li style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/components" style={{ color: 'var(--text-subtle)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-base)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-subtle)'; }}>
              Components
            </Link>
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, margin: '0 2px', color: 'var(--border-subtle)' }}>
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </li>
          <li style={{ display: 'flex', alignItems: 'center' }}>
            <span aria-current="page" style={{ color: 'var(--text-base)', fontWeight: 500 }}>{comp.name}</span>
          </li>
        </ol>
      </nav>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <h1 style={{ fontSize: 'var(--title-md)', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-base)', fontFamily: 'var(--font-base)', margin: 0 }}>{comp.name}</h1>
            <Badge color={statusColor(comp.status)} badgeStyle="subtle">{comp.status}</Badge>
          </div>
          <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--body-sm)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)', margin: 'var(--space-2) 0 0 0' }}>
            {comp.category} · {typeof comp.variants === 'number' ? `${comp.variants} variants` : comp.variants} · Updated {comp.updated}
          </p>
        </div>
        <Button variant="outlined" color="brand" onClick={() => window.open('https://cedar.example.com/components/' + comp.slug, '_blank')}>
          View in Figma
        </Button>
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
}
