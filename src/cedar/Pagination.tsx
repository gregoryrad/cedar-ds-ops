import React from 'react';

export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

function getRange(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  const items: (number | 'ellipsis')[] = [1];
  if (left > 2) items.push('ellipsis');
  for (let i = left; i <= right; i++) items.push(i);
  if (right < total - 1) items.push('ellipsis');
  items.push(total);
  return items;
}

const BTN_BASE: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: 36, height: 36, border: 'var(--border-width-base) solid transparent',
  borderRadius: 'var(--radius-md)', background: 'none', fontFamily: 'var(--font-base)',
  fontSize: 'var(--body-sm)', cursor: 'pointer',
  transition: 'background-color 0.15s, color 0.15s, border-color 0.15s',
  flexShrink: 0, lineHeight: 1,
};

export function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  const items = getRange(currentPage, totalPages);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  function NavButton({ dir }: { dir: 'prev' | 'next' }) {
    const enabled = dir === 'prev' ? canPrev : canNext;
    const target = dir === 'prev' ? currentPage - 1 : currentPage + 1;
    return (
      <button onClick={() => enabled && onPageChange(target)} disabled={!enabled}
        aria-label={dir === 'prev' ? 'Previous page' : 'Next page'}
        style={{ ...BTN_BASE, color: enabled ? 'var(--text-subtle)' : 'var(--text-disabled)', cursor: enabled ? 'pointer' : 'not-allowed' }}
        onMouseEnter={e => { if (enabled) { e.currentTarget.style.backgroundColor = 'var(--bg-faint)'; e.currentTarget.style.color = 'var(--text-base)'; }}}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = enabled ? 'var(--text-subtle)' : 'var(--text-disabled)'; }}>
        {dir === 'prev' ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </button>
    );
  }

  return (
    <nav aria-label="Pagination">
      <ol style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', listStyle: 'none', margin: 0, padding: 0 }}>
        <li><NavButton dir="prev" /></li>
        {items.map((item, i) =>
          item === 'ellipsis' ? (
            <li key={`e-${i}`} aria-hidden="true">
              <span style={{ ...BTN_BASE, color: 'var(--text-subtle)', cursor: 'default' }}>…</span>
            </li>
          ) : (
            <li key={item}>
              <button onClick={() => onPageChange(item)} aria-label={`Page ${item}`} aria-current={item === currentPage ? 'page' : undefined}
                style={{ ...BTN_BASE, backgroundColor: item === currentPage ? 'var(--action-primary)' : 'transparent', color: item === currentPage ? 'var(--action-on-primary)' : 'var(--text-subtle)', fontWeight: item === currentPage ? 600 : 400, cursor: item === currentPage ? 'default' : 'pointer' }}
                onMouseEnter={e => { if (item !== currentPage) { e.currentTarget.style.backgroundColor = 'var(--bg-faint)'; e.currentTarget.style.color = 'var(--text-base)'; }}}
                onMouseLeave={e => { if (item !== currentPage) { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--text-subtle)'; }}}>
                {item}
              </button>
            </li>
          )
        )}
        <li><NavButton dir="next" /></li>
      </ol>
    </nav>
  );
}
