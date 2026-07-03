import { useState, useCallback, useEffect, createContext, useContext, type ReactNode } from 'react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'information' | 'neutral';

export interface ToastConfig {
  id?: string;
  title?: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToastItem {
  id: string;
  title?: string;
  message: string;
  variant: ToastVariant;
  duration: number;
  action?: { label: string; onClick: () => void };
}

const VARIANT_STYLES: Record<ToastVariant, { accent: string }> = {
  success:     { accent: 'var(--status-success)' },
  error:       { accent: 'var(--status-error)' },
  warning:     { accent: 'var(--status-warning)' },
  information: { accent: 'var(--status-information)' },
  neutral:     { accent: 'var(--border-base)' },
};

function ToastIcon({ variant }: { variant: ToastVariant }) {
  const color = VARIANT_STYLES[variant].accent;
  const icons: Record<ToastVariant, ReactNode> = {
    success: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M13 4.5L6.5 11L3 7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    error: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M11 5L5 11M5 5l6 6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
    warning: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 6.5v2.5M8 11h.01M1.5 13L8 2l6.5 11H1.5z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    information: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.5"/><path d="M8 7.5v3M8 5.5h.01" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
    neutral: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2.5a4.5 4.5 0 0 1 4.5 4.5v2l1 2h-11l1-2V7A4.5 4.5 0 0 1 8 2.5zM6.5 13a1.5 1.5 0 0 0 3 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  };
  return <>{icons[variant]}</>;
}

function SingleToast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const style = VARIANT_STYLES[item.variant];

  useEffect(() => {
    if (!item.duration) return;
    const t = setTimeout(() => onDismiss(item.id), item.duration);
    return () => clearTimeout(t);
  }, [item.id, item.duration, onDismiss]);

  return (
    <div role="alert" aria-live="assertive" aria-atomic="true"
      style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', width: '360px', padding: 'var(--space-4)', backgroundColor: 'var(--bg-base)', border: 'var(--border-width-base) solid var(--border-subtle)', borderLeft: `3px solid ${style.accent}`, borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontFamily: 'var(--font-base)' }}>
      <div style={{ flexShrink: 0, marginTop: '1px' }}><ToastIcon variant={item.variant} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {item.title && <div style={{ fontSize: 'var(--body-sm)', fontWeight: 600, color: 'var(--text-base)', marginBottom: item.message ? 'var(--space-1)' : 0 }}>{item.title}</div>}
        <div style={{ fontSize: 'var(--body-sm)', color: 'var(--text-subtle)', lineHeight: 1.5 }}>{item.message}</div>
        {item.action && (
          <button onClick={item.action.onClick} style={{ marginTop: 'var(--space-2)', padding: 0, background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--body-sm)', fontWeight: 600, color: style.accent, fontFamily: 'var(--font-base)' }}>
            {item.action.label}
          </button>
        )}
      </div>
      <button onClick={() => onDismiss(item.id)} aria-label="Dismiss notification"
        style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-subtle)', borderRadius: 'var(--radius-sm)', padding: 0 }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-faint)'; e.currentTarget.style.color = 'var(--text-base)'; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--text-subtle)'; }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
      </button>
    </div>
  );
}

interface ToastContextValue {
  toast: (config: ToastConfig) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((config: ToastConfig) => {
    const id = config.id ?? Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, title: config.title, message: config.message, variant: config.variant ?? 'neutral', duration: config.duration ?? 4000, action: config.action }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {mounted && (
        <div aria-label="Notifications" style={{ position: 'fixed', bottom: 'var(--space-6)', right: 'var(--space-6)', zIndex: 1100, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', alignItems: 'flex-end', pointerEvents: toasts.length ? 'auto' : 'none' }}>
          {toasts.map(item => <SingleToast key={item.id} item={item} onDismiss={dismiss} />)}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
