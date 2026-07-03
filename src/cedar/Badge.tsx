import React from 'react';

export type BadgeColor = 'default' | 'success' | 'warning' | 'error' | 'information';
export type BadgeStyle = 'filled' | 'subtle' | 'outlined';
export type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  color?: BadgeColor;
  badgeStyle?: BadgeStyle;
  size?: BadgeSize;
  children: React.ReactNode;
}

const colorTokens: Record<BadgeColor, { fg: string; bg: string; border: string }> = {
  default:     { fg: 'var(--text-base)',         bg: 'var(--bg-muted)',              border: 'var(--border-subtle)' },
  success:     { fg: 'var(--status-success)',    bg: 'var(--status-success-bg)',    border: 'var(--status-success)' },
  warning:     { fg: 'var(--status-warning)',    bg: 'var(--status-warning-bg)',    border: 'var(--status-warning)' },
  error:       { fg: 'var(--status-error)',      bg: 'var(--status-error-bg)',      border: 'var(--status-error)' },
  information: { fg: 'var(--status-information)', bg: 'var(--status-information-bg)', border: 'var(--status-information)' },
};

export function Badge({ color = 'default', badgeStyle = 'subtle', size = 'sm', children }: BadgeProps) {
  const t = colorTokens[color];
  const isSmall = size === 'sm';

  const styleMap: Record<BadgeStyle, React.CSSProperties> = {
    filled:   { backgroundColor: t.fg, color: color === 'default' ? 'var(--text-inverse)' : `var(--status-on-${color})`, border: 'none' },
    subtle:   { backgroundColor: t.bg, color: t.fg, border: 'none' },
    outlined: { backgroundColor: 'transparent', color: t.fg, border: `var(--border-width-base) solid ${t.border}` },
  };

  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center',
        fontFamily: 'var(--font-base)', fontWeight: 500,
        borderRadius: 'var(--radius-full)',
        padding: isSmall ? '2px 8px' : '4px 10px',
        fontSize: isSmall ? 'var(--size-xs)' : 'var(--body-sm)',
        lineHeight: 1.4,
        ...styleMap[badgeStyle],
      }}
    >
      {children}
    </span>
  );
}
