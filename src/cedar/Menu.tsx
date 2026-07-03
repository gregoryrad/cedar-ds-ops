import React, { useState, useRef, useEffect, useId, type ReactNode } from 'react';

export type MenuPlacement = 'bottom-start' | 'bottom-end';

export type MenuItem =
  | { type: 'item'; label: string; icon?: ReactNode; shortcut?: string; destructive?: boolean; disabled?: boolean; onClick?: () => void }
  | { type: 'divider' }
  | { type: 'label'; text: string };

export interface MenuProps {
  trigger: ReactNode;
  items: MenuItem[];
  placement?: MenuPlacement;
}

const ITEM_STYLE: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 'var(--space-2)', width: '100%',
  padding: '7px var(--space-3)', border: 'none', background: 'none', cursor: 'pointer',
  fontFamily: 'var(--font-base)', fontSize: 'var(--body-sm)', textAlign: 'left',
  borderRadius: 'var(--radius-sm)', transition: 'background-color 0.1s', textDecoration: 'none',
};

export function Menu({ trigger, items, placement = 'bottom-end' }: MenuProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => { if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (!open || !menuRef.current) return;
    const menu = menuRef.current;
    const focusables = () => Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])'));
    focusables()[0]?.focus();
    const handler = (e: KeyboardEvent) => {
      const its = focusables();
      const idx = its.indexOf(document.activeElement as HTMLElement);
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); its[(idx + 1) % its.length]?.focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); its[(idx - 1 + its.length) % its.length]?.focus(); }
      else if (e.key === 'Home') { e.preventDefault(); its[0]?.focus(); }
      else if (e.key === 'End') { e.preventDefault(); its[its.length - 1]?.focus(); }
    };
    menu.addEventListener('keydown', handler);
    return () => menu.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-flex' }}>
      <div onClick={() => setOpen(o => !o)} aria-haspopup="menu" aria-expanded={open} aria-controls={open ? id : undefined} style={{ display: 'inline-flex', cursor: 'pointer' }}>
        {trigger}
      </div>
      {open && (
        <div ref={menuRef} id={id} role="menu" aria-orientation="vertical"
          style={{ position: 'absolute', top: 'calc(100% + var(--space-1))', ...(placement === 'bottom-end' ? { right: 0 } : { left: 0 }), zIndex: 900, minWidth: 200, backgroundColor: 'var(--bg-base)', border: 'var(--border-width-base) solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', padding: 'var(--space-1)', display: 'flex', flexDirection: 'column' }}>
          {items.map((item, i) => {
            if (item.type === 'divider') return <div key={i} role="separator" style={{ height: 'var(--border-width-base)', backgroundColor: 'var(--border-subtle)', margin: 'var(--space-1) 0' }} />;
            if (item.type === 'label') return <div key={i} style={{ padding: '4px var(--space-3)', fontSize: 'var(--size-xs)', fontFamily: 'var(--font-base)', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.text}</div>;
            const color = item.disabled ? 'var(--text-disabled)' : item.destructive ? 'var(--status-error)' : 'var(--text-base)';
            return (
              <button key={i} role="menuitem" aria-disabled={item.disabled} onClick={() => { if (!item.disabled) { item.onClick?.(); setOpen(false); } }}
                style={{ ...ITEM_STYLE, color, cursor: item.disabled ? 'not-allowed' : 'pointer' }}
                onMouseEnter={e => { if (!item.disabled) e.currentTarget.style.backgroundColor = 'var(--bg-faint)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; }}
                onFocus={e => { if (!item.disabled) e.currentTarget.style.backgroundColor = 'var(--bg-faint)'; }}
                onBlur={e => { e.currentTarget.style.backgroundColor = ''; }}>
                {item.icon && <span aria-hidden="true" style={{ flexShrink: 0, color: item.disabled ? 'var(--text-disabled)' : item.destructive ? 'var(--status-error)' : 'var(--text-subtle)' }}>{item.icon}</span>}
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.shortcut && <kbd style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--size-xs)', color: 'var(--text-subtle)', marginLeft: 'var(--space-4)' }}>{item.shortcut}</kbd>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
