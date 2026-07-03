import { useEffect, useRef, useId, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export type ModalSize = 'sm' | 'md' | 'lg';

const MAX_WIDTHS: Record<ModalSize, string> = { sm: '440px', md: '560px', lg: '720px' };

const FOCUSABLE = ['a[href]', 'button:not([disabled])', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])'].join(',');

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: ModalSize;
  children?: ReactNode;
  footer?: ReactNode;
}

export function Modal({ open, onClose, title, description, size = 'md', children, footer }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
    focusable[0]?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const els = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (els.length === 0) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    dialog.addEventListener('keydown', trap);
    return () => dialog.removeEventListener('keydown', trap);
  }, [open]);

  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);

  if (!open || !mounted) return null;

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)', backgroundColor: 'rgba(0,0,0,0.48)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId}
        style={{ width: '100%', maxWidth: MAX_WIDTHS[size], backgroundColor: 'var(--bg-base)', borderRadius: 'var(--radius-xl)', boxShadow: '0 8px 40px rgba(0,0,0,0.16)', display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 64px)', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)', padding: 'var(--space-5) var(--space-6)', borderBottom: 'var(--border-width-base) solid var(--border-subtle)', flexShrink: 0 }}>
          <div>
            <h2 id={titleId} style={{ margin: 0, fontSize: 'var(--heading-lg)', fontWeight: 700, color: 'var(--text-base)', lineHeight: 1.3, fontFamily: 'var(--font-base)' }}>{title}</h2>
            {description && <p style={{ margin: 'var(--space-1) 0 0', fontSize: 'var(--body-sm)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)', lineHeight: 1.5 }}>{description}</p>}
          </div>
          <button onClick={onClose} aria-label="Close dialog"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-subtle)', borderRadius: 'var(--radius-md)', flexShrink: 0, padding: 0, transition: 'background-color 0.15s, color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-faint)'; e.currentTarget.style.color = 'var(--text-base)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--text-subtle)'; }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
        {children && (
          <div style={{ padding: 'var(--space-5) var(--space-6)', overflowY: 'auto', flex: 1, fontFamily: 'var(--font-base)', fontSize: 'var(--body-sm)', color: 'var(--text-subtle)', lineHeight: 1.6 }}>
            {children}
          </div>
        )}
        {footer && (
          <div style={{ padding: 'var(--space-4) var(--space-6)', borderTop: 'var(--border-width-base) solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', flexShrink: 0 }}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
