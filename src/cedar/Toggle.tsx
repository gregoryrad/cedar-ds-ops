import { useId } from 'react';

export type ToggleSize = 'sm' | 'md';

const SIZES: Record<ToggleSize, { trackW: number; trackH: number; thumbSize: number }> = {
  sm: { trackW: 32, trackH: 18, thumbSize: 14 },
  md: { trackW: 40, trackH: 22, thumbSize: 18 },
};

export interface ToggleProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  size?: ToggleSize;
  id?: string;
}

function ToggleControl({ checked, onChange, disabled = false, size = 'md', id, labelledBy }: Pick<ToggleProps, 'checked' | 'onChange' | 'disabled' | 'size' | 'id'> & { labelledBy?: string }) {
  const sz = SIZES[size];
  const pad = 2;
  const travel = sz.trackW - sz.thumbSize - pad * 2;
  const trackBg = disabled ? 'var(--bg-disabled)' : checked ? 'var(--action-primary)' : 'var(--border-subtle)';

  return (
    <button
      id={id} type="button" role="switch" aria-checked={checked} aria-labelledby={labelledBy}
      disabled={disabled} onClick={() => !disabled && onChange?.(!checked)}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', flexShrink: 0, width: sz.trackW, height: sz.trackH, borderRadius: 'var(--radius-full)', backgroundColor: trackBg, border: 'none', padding: 0, cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s', outline: 'none' }}
      onFocus={e => { if (!disabled) e.currentTarget.style.boxShadow = `0 0 0 3px color-mix(in srgb, var(--action-primary) 30%, transparent)`; }}
      onBlur={e => { e.currentTarget.style.boxShadow = ''; }}
    >
      <span aria-hidden="true" style={{ position: 'absolute', left: checked ? `${pad + travel}px` : `${pad}px`, width: sz.thumbSize, height: sz.thumbSize, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--foundations-white)', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
    </button>
  );
}

export function Toggle({ checked, onChange, disabled, size = 'md', label, description, id }: ToggleProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const labelId = label ? `${controlId}-label` : undefined;

  if (description) {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          {label && <span id={labelId} style={{ fontSize: 'var(--body-sm)', fontWeight: 500, color: disabled ? 'var(--text-disabled)' : 'var(--text-base)', fontFamily: 'var(--font-base)' }}>{label}</span>}
          <span style={{ fontSize: 'var(--body-sm)', color: disabled ? 'var(--text-disabled)' : 'var(--text-subtle)', fontFamily: 'var(--font-base)', lineHeight: 1.5 }}>{description}</span>
        </div>
        <ToggleControl checked={checked} onChange={onChange} disabled={disabled} size={size} id={controlId} labelledBy={labelId} />
      </div>
    );
  }

  if (label) {
    return (
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)', cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-base)', fontSize: 'var(--body-sm)', color: disabled ? 'var(--text-disabled)' : 'var(--text-base)', userSelect: 'none' }}>
        <ToggleControl checked={checked} onChange={onChange} disabled={disabled} size={size} />
        {label}
      </label>
    );
  }

  return <ToggleControl checked={checked} onChange={onChange} disabled={disabled} size={size} id={controlId} />;
}
