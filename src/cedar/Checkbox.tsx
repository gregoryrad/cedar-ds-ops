import { useId, type ChangeEvent } from 'react';

type CheckboxSize = 'sm' | 'md' | 'lg';
type CheckboxState = 'default' | 'error' | 'disabled';

interface CheckboxProps {
  label?: string;
  description?: string;
  checked?: boolean;
  indeterminate?: boolean;
  checkboxSize?: CheckboxSize;
  state?: CheckboxState;
  onChange?: (checked: boolean) => void;
  name?: string;
  value?: string;
}

const boxSizes: Record<CheckboxSize, number> = { sm: 16, md: 18, lg: 20 };
const labelFontSizes: Record<CheckboxSize, string> = { sm: 'var(--body-sm)', md: 'var(--body-md)', lg: 'var(--body-lg)' };

function CheckIcon({ size }: { size: number }) {
  return (
    <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 12 9" fill="none" aria-hidden="true">
      <path d="M1 4.5L4.5 8L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IndeterminateIcon({ size }: { size: number }) {
  return (
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 10 2" fill="none" aria-hidden="true">
      <path d="M1 1h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function Checkbox({ label, description, checked = false, indeterminate = false, checkboxSize = 'md', state = 'default', onChange, name, value }: CheckboxProps) {
  const id = useId();
  const isDisabled = state === 'disabled';
  const hasError = state === 'error';
  const isFilled = checked || indeterminate;
  const boxPx = boxSizes[checkboxSize];

  const borderColor = isDisabled ? 'var(--border-disabled)' : hasError ? 'var(--status-error)' : isFilled ? 'var(--action-primary)' : 'var(--border-base)';
  const bgColor = isDisabled ? 'var(--bg-disabled)' : isFilled ? 'var(--action-primary)' : 'var(--bg-base)';
  const iconColor = isDisabled ? 'var(--text-disabled)' : 'var(--action-on-primary)';

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => { if (!isDisabled) onChange?.(e.target.checked); };

  const control = (
    <span style={{ position: 'relative', flexShrink: 0, display: 'inline-flex' }}>
      <input
        type="checkbox" id={label ? id : undefined} name={name} value={value}
        checked={checked} disabled={isDisabled} onChange={handleChange}
        ref={(el) => { if (el) el.indeterminate = indeterminate; }}
        aria-invalid={hasError || undefined}
        style={{ position: 'absolute', opacity: 0, width: boxPx, height: boxPx, margin: 0, cursor: isDisabled ? 'not-allowed' : 'pointer', zIndex: 1 }}
      />
      <span aria-hidden="true" style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: boxPx, height: boxPx, borderRadius: 'var(--radius-sm)',
        border: `var(--border-width-bold) solid ${borderColor}`, backgroundColor: bgColor,
        color: iconColor, flexShrink: 0, transition: 'background-color 0.12s, border-color 0.12s', pointerEvents: 'none',
      }}>
        {indeterminate && <IndeterminateIcon size={boxPx} />}
        {!indeterminate && checked && <CheckIcon size={boxPx} />}
      </span>
    </span>
  );

  if (!label) return control;

  return (
    <div style={{ display: 'flex', alignItems: description ? 'flex-start' : 'center', gap: 'var(--space-2)', cursor: isDisabled ? 'not-allowed' : 'pointer', width: description ? '100%' : undefined }}>
      {control}
      <label htmlFor={id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', cursor: isDisabled ? 'not-allowed' : 'pointer', flex: description ? 1 : undefined }}>
        <span style={{ fontFamily: 'var(--font-base)', fontSize: labelFontSizes[checkboxSize], color: isDisabled ? 'var(--text-disabled)' : 'var(--text-base)', lineHeight: 1.4 }}>
          {label}
        </span>
        {description && (
          <span style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--body-sm)', color: isDisabled ? 'var(--text-disabled)' : 'var(--text-subtle)', lineHeight: 1.5 }}>
            {description}
          </span>
        )}
      </label>
    </div>
  );
}
