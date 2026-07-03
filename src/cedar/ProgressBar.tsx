interface ProgressBarProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const heights: Record<'sm' | 'md' | 'lg', number> = { sm: 4, md: 8, lg: 12 };

export function ProgressBar({ value, size = 'md', label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const h = heights[size];

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <span style={{ display: 'block', fontFamily: 'var(--font-base)', fontSize: 'var(--body-sm)', color: 'var(--text-subtle)', marginBottom: 'var(--space-2)' }}>
          {label}
        </span>
      )}
      <div role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100} aria-label={label ?? `${clamped}% complete`}
        style={{ width: '100%', height: h, borderRadius: h / 2, background: 'var(--bg-muted)', overflow: 'hidden' }}>
        <div style={{ width: `${clamped}%`, height: '100%', background: 'var(--action-primary)', borderRadius: h / 2, transition: 'width 0.3s ease' }} />
      </div>
    </div>
  );
}
