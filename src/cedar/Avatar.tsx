import type { ReactNode } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  status?: AvatarStatus;
  icon?: ReactNode;
}

export interface AvatarGroupProps {
  children: ReactNode;
  max?: number;
  size?: AvatarSize;
}

const SIZES: Record<AvatarSize, { wh: number; fontSize: string; statusSize: number; statusOffset: number; borderRadius: string }> = {
  xs: { wh: 24, fontSize: 'var(--size-xs)',  statusSize: 7,  statusOffset: -1, borderRadius: 'var(--radius-sm)' },
  sm: { wh: 32, fontSize: 'var(--size-xs)',  statusSize: 9,  statusOffset: -1, borderRadius: 'var(--radius-md)' },
  md: { wh: 40, fontSize: 'var(--body-sm)',  statusSize: 11, statusOffset:  0, borderRadius: 'var(--radius-lg)' },
  lg: { wh: 48, fontSize: 'var(--body-md)',  statusSize: 12, statusOffset:  0, borderRadius: 'var(--radius-lg)' },
  xl: { wh: 64, fontSize: 'var(--body-lg)',  statusSize: 14, statusOffset:  1, borderRadius: 'var(--radius-xl)' },
};

const STATUS_COLOR: Record<AvatarStatus, string> = {
  online: 'var(--status-success)', away: 'var(--status-warning)', busy: 'var(--status-error)', offline: 'var(--border-base)',
};

const PALETTE = [
  { bg: '#E8F4FD', fg: '#1565C0' }, { bg: '#E8F5E9', fg: '#2E7D32' },
  { bg: '#FFF3E0', fg: '#E65100' }, { bg: '#F3E5F5', fg: '#6A1B9A' },
  { bg: '#FCE4EC', fg: '#AD1457' }, { bg: '#E0F7FA', fg: '#00695C' },
  { bg: '#FFF8E1', fg: '#F57F17' }, { bg: '#EDE7F6', fg: '#4527A0' },
];

function colorFromName(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xFFFFFF;
  return PALETTE[Math.abs(h) % PALETTE.length];
}

function initials(name: string) {
  return name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function PersonIcon({ size }: { size: number }) {
  const s = size * 0.5;
  return (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function Avatar({ src, name, size = 'md', shape = 'circle', status, icon }: AvatarProps) {
  const sz = SIZES[size];
  const radius = shape === 'circle' ? '50%' : sz.borderRadius;
  const color = name ? colorFromName(name) : { bg: 'var(--bg-muted)', fg: 'var(--text-subtle)' };

  const inner = src ? (
    <img src={src} alt={name ?? 'Avatar'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: radius }} />
  ) : name ? (
    <span style={{ fontSize: sz.fontSize, fontWeight: 600, lineHeight: 1, color: color.fg, userSelect: 'none', fontFamily: 'var(--font-base)' }}>
      {initials(name)}
    </span>
  ) : icon ? (
    <span style={{ color: 'var(--text-subtle)', display: 'flex' }}>{icon}</span>
  ) : (
    <span style={{ color: 'var(--text-subtle)', display: 'flex' }}><PersonIcon size={sz.wh} /></span>
  );

  return (
    <span role="img" aria-label={name ?? 'User avatar'}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: sz.wh, height: sz.wh, borderRadius: radius, backgroundColor: src ? 'transparent' : color.bg, overflow: src ? 'hidden' : 'visible', border: src ? 'none' : `var(--border-width-base) solid transparent` }}>
      {inner}
      {status && (
        <span aria-label={status} style={{ position: 'absolute', bottom: sz.statusOffset, right: sz.statusOffset, width: sz.statusSize, height: sz.statusSize, borderRadius: '50%', backgroundColor: STATUS_COLOR[status], border: '2px solid var(--bg-base)' }} />
      )}
    </span>
  );
}

export function AvatarGroup({ children, max = 4, size = 'md' }: AvatarGroupProps) {
  const sz = SIZES[size];
  const all = Array.isArray(children) ? children : [children];
  const visible = all.slice(0, max);
  const overflow = all.length - max;
  const overlapPx = Math.round(sz.wh * 0.25);

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      {visible.map((child, i) => (
        <span key={i} style={{ marginLeft: i === 0 ? 0 : -overlapPx, zIndex: visible.length - i, position: 'relative', display: 'inline-flex', borderRadius: '50%', outline: '2px solid var(--bg-base)' }}>
          {child}
        </span>
      ))}
      {overflow > 0 && (
        <span aria-label={`${overflow} more`} style={{ marginLeft: -overlapPx, zIndex: 0, position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: sz.wh, height: sz.wh, borderRadius: '50%', backgroundColor: 'var(--bg-muted)', color: 'var(--text-subtle)', fontSize: sz.fontSize, fontWeight: 600, fontFamily: 'var(--font-base)', outline: '2px solid var(--bg-base)', userSelect: 'none' }}>
          +{overflow}
        </span>
      )}
    </span>
  );
}
