import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { Search, Settings as SettingsIcon } from "lucide-react";
import {
  Alert, Avatar, Badge, Breadcrumb, Button, Card, Checkbox, Divider, FormField,
  IconButton, Input, InputField, Menu, Modal, Pagination, ProgressBar, Radio, RadioGroup,
  Select, Spinner, Tabs, Toggle, Tooltip,
} from "@/cedar";
import type { TabDef, MenuItem } from "@/cedar";
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

const previewLabelStyle = { fontSize: 'var(--body-sm)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)' } as const;

function NotAvailablePreview() {
  return <span style={previewLabelStyle}>React implementation planned for v3</span>;
}

function ButtonPreview() {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
      <Button variant="filled" color="brand" size="md">Continue</Button>
      <Button variant="outlined" color="brand" size="md">Cancel</Button>
    </div>
  );
}

function InputFieldPreview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', width: '100%', maxWidth: 320 }}>
      <InputField label="Email" placeholder="you@company.com" />
      <InputField label="Email" defaultValue="jane@cedar.design" />
    </div>
  );
}

function FormFieldPreview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', width: '100%', maxWidth: 320 }}>
      <FormField label="Username" helperText="This will be visible to other members">
        <Input placeholder="jane.doe" />
      </FormField>
      <FormField label="Username" errorText="This username is already taken">
        <Input hasError defaultValue="jane.doe" />
      </FormField>
    </div>
  );
}

function CheckboxPreview() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <Checkbox label="Email notifications" checked={a} onChange={setA} />
      <Checkbox label="Email notifications" checked={b} onChange={setB} />
    </div>
  );
}

function RadioPreview() {
  const [value, setValue] = useState('monthly');
  return (
    <RadioGroup
      name="preview-billing"
      value={value}
      onChange={setValue}
      layout="horizontal"
      options={[{ value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' }]}
    />
  );
}

function TogglePreview() {
  const [off, setOff] = useState(false);
  const [on, setOn] = useState(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <Toggle checked={off} onChange={setOff} label="Auto-save" />
      <Toggle checked={on} onChange={setOn} label="Auto-save" />
    </div>
  );
}

const selectDemoOptions = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
];

function SelectPreview() {
  const openWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      openWrapRef.current?.querySelector<HTMLButtonElement>('button[role="combobox"]')?.click();
    }, 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap' }}>
      <div style={{ width: 200 }}>
        <Select options={selectDemoOptions} placeholder="Select a size" />
      </div>
      <div ref={openWrapRef} style={{ width: 200 }}>
        <Select options={selectDemoOptions} value="md" />
      </div>
    </div>
  );
}

function IconButtonPreview() {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
      <IconButton icon={<Search size={18} />} aria-label="Search" variant="ghost" color="neutral" />
      <IconButton icon={<SettingsIcon size={18} />} aria-label="Settings" variant="ghost" color="neutral" />
    </div>
  );
}

function BadgePreview() {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
      <Badge color="error">Error</Badge>
      <Badge color="warning">Warning</Badge>
      <Badge color="success">Success</Badge>
      <Badge color="information">Info</Badge>
    </div>
  );
}

function CardPreview() {
  return (
    <Card style={{ maxWidth: 320 }}>
      <h3 style={{ margin: 0, fontSize: 'var(--body-md)', fontWeight: 600, color: 'var(--text-base)', fontFamily: 'var(--font-base)' }}>Card title</h3>
      <p style={{ marginTop: 'var(--space-2)', marginBottom: 0, fontSize: 'var(--body-sm)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)', lineHeight: 1.5 }}>
        Cards group related content and actions into a single container.
      </p>
    </Card>
  );
}

function AvatarPreview() {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
      <Avatar name="Jane Doe" size="md" />
      <Avatar name="Miguel Alvarez" size="lg" />
    </div>
  );
}

function DividerPreview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: '100%', maxWidth: 320 }}>
      <span style={previewLabelStyle}>Section A</span>
      <Divider />
      <span style={previewLabelStyle}>Section B</span>
    </div>
  );
}

function AlertPreview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: '100%' }}>
      <Alert variant="error">Something went wrong. Please try again.</Alert>
      <Alert variant="warning">This action can't be undone.</Alert>
      <Alert variant="success">Changes saved successfully.</Alert>
      <Alert variant="information">A new version of Cedar is available.</Alert>
    </div>
  );
}

function ToastPreview() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', width: 340, maxWidth: '100%', padding: 'var(--space-4)', backgroundColor: 'var(--bg-base)', border: 'var(--border-width-base) solid var(--border-subtle)', borderLeft: '3px solid var(--status-success)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontFamily: 'var(--font-base)' }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}>
        <path d="M13 4.5L6.5 11L3 7.5" stroke="var(--status-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div>
        <div style={{ fontSize: 'var(--body-sm)', fontWeight: 600, color: 'var(--text-base)', marginBottom: 'var(--space-1)' }}>Changes saved</div>
        <div style={{ fontSize: 'var(--body-sm)', color: 'var(--text-subtle)', lineHeight: 1.5 }}>Your profile has been updated.</div>
      </div>
    </div>
  );
}

function ModalPreview() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="filled" color="brand" onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Delete component?"
        description="This action cannot be undone."
        footer={(
          <>
            <Button variant="ghost" color="neutral" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="filled" color="destructive" onClick={() => setOpen(false)}>Delete</Button>
          </>
        )}
      >
        This will permanently remove the component from the Cedar library.
      </Modal>
    </>
  );
}

function TooltipPreview() {
  return (
    <Tooltip content="Copy to clipboard">
      <Button variant="outlined" color="neutral">Hover me</Button>
    </Tooltip>
  );
}

function TabsPreview() {
  const tabs: TabDef[] = [
    { id: 'overview', label: 'Overview', content: <p style={{ margin: 0, ...previewLabelStyle }}>General information goes here.</p> },
    { id: 'usage', label: 'Usage', content: <p style={{ margin: 0, ...previewLabelStyle }}>Usage guidance goes here.</p> },
    { id: 'specs', label: 'Specs', content: <p style={{ margin: 0, ...previewLabelStyle }}>Prop specs go here.</p> },
  ];
  return <div style={{ width: '100%' }}><Tabs tabs={tabs} /></div>;
}

function BreadcrumbPreview() {
  return <Breadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Settings', href: '#' }, { label: 'Profile' }]} />;
}

function PaginationPreview() {
  const [page, setPage] = useState(2);
  return <Pagination totalPages={5} currentPage={page} onPageChange={setPage} />;
}

function MenuPreview() {
  const items: MenuItem[] = [
    { type: 'item', label: 'Edit', onClick: () => {} },
    { type: 'item', label: 'Duplicate', onClick: () => {} },
    { type: 'divider' },
    { type: 'item', label: 'Delete', destructive: true, onClick: () => {} },
  ];
  return <Menu trigger={<Button variant="outlined" color="neutral">Options</Button>} items={items} placement="bottom-start" />;
}

function ProgressBarPreview() {
  return <div style={{ width: '100%', maxWidth: 320 }}><ProgressBar value={65} size="md" label="Uploading files…" /></div>;
}

function SpinnerPreview() {
  return <Spinner size="md" />;
}

const previewMap: Record<string, ComponentType> = {
  button: ButtonPreview,
  'input-field': InputFieldPreview,
  'form-field': FormFieldPreview,
  checkbox: CheckboxPreview,
  radio: RadioPreview,
  toggle: TogglePreview,
  select: SelectPreview,
  'icon-button': IconButtonPreview,
  badge: BadgePreview,
  chip: NotAvailablePreview,
  card: CardPreview,
  avatar: AvatarPreview,
  divider: DividerPreview,
  'data-grid': NotAvailablePreview,
  alert: AlertPreview,
  toast: ToastPreview,
  modal: ModalPreview,
  tooltip: TooltipPreview,
  tabs: TabsPreview,
  breadcrumb: BreadcrumbPreview,
  pagination: PaginationPreview,
  menu: MenuPreview,
  'progress-bar': ProgressBarPreview,
  spinner: SpinnerPreview,
};

const DOC_BASE = 'https://cedar-ds-documentation.vercel.app';

const docPathMap: Record<string, string> = {
  button: '/components/button',
  'input-field': '/components/input',
  'form-field': '/components/input',
  checkbox: '/components/checkbox',
  radio: '/components/radio',
  toggle: '/components/toggle',
  select: '/components/select',
  'icon-button': '/components/icon-button',
  badge: '/components/badge',
  chip: '/roadmap',
  card: '/components/card',
  avatar: '/components/avatar',
  divider: '/components/divider',
  'data-grid': '/roadmap',
  alert: '/components/alert',
  toast: '/components/toast',
  modal: '/components/modal',
  tooltip: '/components/tooltip',
  tabs: '/components/tabs',
  breadcrumb: '/components/breadcrumb',
  pagination: '/components/pagination',
  menu: '/components/menu',
  'progress-bar': '/components/status',
  spinner: '/components/status',
};

function ComponentDetail() {
  const comp = Route.useLoaderData();
  const PreviewComponent = previewMap[comp.slug] ?? NotAvailablePreview;
  const docHref = DOC_BASE + (docPathMap[comp.slug] ?? '/roadmap');

  const usageContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ padding: 'var(--space-8)', backgroundColor: 'var(--bg-faint)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'wrap', minHeight: 200 }}>
        <PreviewComponent />
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
        <Button variant="outlined" color="brand" onClick={() => window.open(docHref, '_blank', 'noopener,noreferrer')}>
          View documentation
        </Button>
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
}
