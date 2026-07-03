import React from 'react';

type AlertVariant = 'error' | 'warning' | 'success' | 'information';

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  children: React.ReactNode;
}

const icons: Record<AlertVariant, string> = {
  error: '✕', warning: '⚠', success: '✓', information: 'i',
};

const tokens: Record<AlertVariant, { bg: string; border: string; icon: string; title: string }> = {
  error:       { bg: 'var(--status-error-bg)',       border: 'var(--status-error)',       icon: 'var(--status-error)',       title: 'var(--status-error)' },
  warning:     { bg: 'var(--status-warning-bg)',     border: 'var(--status-warning)',     icon: 'var(--status-warning)',     title: 'var(--status-warning)' },
  success:     { bg: 'var(--status-success-bg)',     border: 'var(--status-success)',     icon: 'var(--status-success)',     title: 'var(--status-success)' },
  information: { bg: 'var(--status-information-bg)', border: 'var(--status-information)', icon: 'var(--status-information)', title: 'var(--status-information)' },
};

export function Alert({ variant, title, children }: AlertProps) {
  const t = tokens[variant];
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: t.bg,
        borderLeft: `var(--border-width-bold) solid ${t.border}`,
        fontFamily: 'var(--font-base)',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          flexShrink: 0, width: 20, height: 20, borderRadius: '50%',
          backgroundColor: t.icon, color: 'var(--foundations-white)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, marginTop: 1,
        }}
      >
        {icons[variant]}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        {title && <span style={{ fontWeight: 600, fontSize: 'var(--body-sm)', color: t.title }}>{title}</span>}
        <span style={{ fontSize: 'var(--body-sm)', color: 'var(--text-base)' }}>{children}</span>
      </div>
    </div>
  );
}
