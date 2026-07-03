import { useId, type ChangeEvent } from 'react';

export type RadioSize = 'sm' | 'md' | 'lg';
export type RadioState = 'default' | 'error' | 'disabled';

export interface RadioProps {
  label?: string;
  description?: string;
  checked?: boolean;
  radioSize?: RadioSize;
  state?: RadioState;
  onChange?: () => void;
  name?: string;
  value?: string;
}

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  groupLabel?: string;
  state?: 'default' | 'error';
  error?: string;
  radioSize?: RadioSize;
  layout?: 'vertical' | 'horizontal';
}

const BOX_PX: Record<RadioSize, number> = { sm: 16, md: 18, lg: 20 };
const LABEL_SIZE: Record<RadioSize, string> = { sm: 'var(--body-sm)', md: 'var(--body-md)', lg: 'var(--body-lg)' };

export function Radio({ label, description, checked = false, radioSize = 'md', state = 'default', onChange, name, value }: RadioProps) {
  const id = useId();
  const isDisabled = state === 'disabled';
  const hasError = state === 'error';
  const px = BOX_PX[radioSize];
  const borderColor = isDisabled ? 'var(--border-disabled)' : hasError ? 'var(--status-error)' : checked ? 'var(--action-primary)' : 'var(--border-base)';
  const bgColor = isDisabled ? 'var(--bg-disabled)' : checked ? 'var(--action-primary)' : 'var(--bg-base)';
  const dotSize = Math.round(px * 0.38);

  const control = (
    <span style={{ position: 'relative', flexShrink: 0, display: 'inline-flex' }}>
      <input type="radio" id={label ? id : undefined} name={name} value={value} checked={checked} disabled={isDisabled}
        onChange={(e: ChangeEvent<HTMLInputElement>) => { if (!isDisabled && e.target.checked) onChange?.(); }}
        aria-invalid={hasError || undefined}
        style={{ position: 'absolute', opacity: 0, width: px, height: px, margin: 0, cursor: isDisabled ? 'not-allowed' : 'pointer', zIndex: 1 }} />
      <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: px, height: px, borderRadius: 'var(--radius-full)', border: `var(--border-width-bold) solid ${borderColor}`, backgroundColor: bgColor, flexShrink: 0, transition: 'background-color 0.12s, border-color 0.12s', pointerEvents: 'none' }}>
        {checked && <span style={{ width: dotSize, height: dotSize, borderRadius: 'var(--radius-full)', backgroundColor: isDisabled ? 'var(--text-disabled)' : 'var(--action-on-primary)' }} />}
      </span>
    </span>
  );

  if (!label) return control;

  return (
    <div style={{ display: 'flex', alignItems: description ? 'flex-start' : 'center', gap: 'var(--space-2)', cursor: isDisabled ? 'not-allowed' : 'pointer', width: description ? '100%' : undefined }}>
      {control}
      <label htmlFor={id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', cursor: isDisabled ? 'not-allowed' : 'pointer', flex: description ? 1 : undefined }}>
        <span style={{ fontFamily: 'var(--font-base)', fontSize: LABEL_SIZE[radioSize], color: isDisabled ? 'var(--text-disabled)' : 'var(--text-base)', lineHeight: 1.4 }}>{label}</span>
        {description && <span style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--body-sm)', color: isDisabled ? 'var(--text-disabled)' : 'var(--text-subtle)', lineHeight: 1.5 }}>{description}</span>}
      </label>
    </div>
  );
}

export function RadioGroup({ name, value, onChange, options, groupLabel, state = 'default', error, radioSize = 'md', layout = 'vertical' }: RadioGroupProps) {
  const legendId = useId();
  const resolvedState = error ? 'error' : state;

  return (
    <fieldset role="radiogroup" aria-labelledby={groupLabel ? legendId : undefined} aria-invalid={resolvedState === 'error' || undefined} style={{ border: 'none', padding: 0, margin: 0 }}>
      {groupLabel && (
        <legend id={legendId} style={{ fontSize: 'var(--body-sm)', fontWeight: 600, color: 'var(--text-base)', fontFamily: 'var(--font-base)', marginBottom: 'var(--space-3)', padding: 0 }}>
          {groupLabel}
        </legend>
      )}
      <div style={{ display: 'flex', flexDirection: layout === 'horizontal' ? 'row' : 'column', gap: layout === 'horizontal' ? 'var(--space-5)' : 'var(--space-3)', flexWrap: 'wrap' }}>
        {options.map(opt => (
          <Radio key={opt.value} label={opt.label} description={opt.description} checked={value === opt.value}
            onChange={() => onChange?.(opt.value)} name={name} value={opt.value} radioSize={radioSize}
            state={opt.disabled ? 'disabled' : resolvedState === 'error' ? 'error' : 'default'} />
        ))}
      </div>
      {error && <p style={{ margin: 'var(--space-2) 0 0', fontSize: 'var(--size-xs)', fontFamily: 'var(--font-base)', color: 'var(--status-error)' }}>{error}</p>}
    </fieldset>
  );
}
