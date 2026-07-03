export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0, listStyle: 'none', margin: 0, padding: 0, fontFamily: 'var(--font-base)', fontSize: 'var(--body-sm)' }}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} style={{ display: 'flex', alignItems: 'center' }}>
              {isLast ? (
                <span aria-current="page" style={{ color: 'var(--text-base)', fontWeight: 500 }}>{item.label}</span>
              ) : (
                <a href={item.href ?? '#'} style={{ color: 'var(--text-subtle)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-base)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-subtle)'; }}>
                  {item.label}
                </a>
              )}
              {!isLast && (
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, margin: '0 2px', color: 'var(--border-subtle)' }}>
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
