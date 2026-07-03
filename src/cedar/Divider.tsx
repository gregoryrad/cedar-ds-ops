export type DividerVariant = 'subtle' | 'base' | 'strong';
export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps {
  variant?: DividerVariant;
  orientation?: DividerOrientation;
  label?: string;
  decorative?: boolean;
}

const COLOR: Record<DividerVariant, string> = { subtle: 'var(--border-subtle)', base: 'var(--border-base)', strong: 'var(--border-base)' };
const WEIGHT: Record<DividerVariant, string> = { subtle: '1px', base: '1px', strong: '2px' };

export function Divider({ variant = 'subtle', orientation = 'horizontal', label, decorative = true }: DividerProps) {
  const color = COLOR[variant];
  const weight = WEIGHT[variant];

  if (orientation === 'vertical') {
    return (
      <span role={decorative ? 'none' : 'separator'} aria-orientation="vertical"
        style={{ display: 'inline-block', alignSelf: 'stretch', width: weight, backgroundColor: color, flexShrink: 0 }} />
    );
  }

  if (label) {
    return (
      <div role={decorative ? 'none' : 'separator'} aria-label={!decorative ? label : undefined}
        style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', width: '100%' }}>
        <span style={{ flex: 1, height: weight, backgroundColor: color }} />
        <span style={{ fontSize: 'var(--size-xs)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)', fontWeight: 500, whiteSpace: 'nowrap', userSelect: 'none' }}>
          {label}
        </span>
        <span style={{ flex: 1, height: weight, backgroundColor: color }} />
      </div>
    );
  }

  return (
    <hr role={decorative ? 'none' : 'separator'} aria-hidden={decorative || undefined}
      style={{ border: 'none', borderTop: `${weight} solid ${color}`, margin: 0, width: '100%' }} />
  );
}
