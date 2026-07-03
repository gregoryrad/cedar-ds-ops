import { useId, useState, type ReactNode, type InputHTMLAttributes } from 'react';

type InputFieldSize = 'sm' | 'md' | 'lg';

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  helperText?: string;
  errorText?: string;
  required?: boolean;
  inputSize?: InputFieldSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const sizeTokens: Record<InputFieldSize, { height: string; fontSize: string; px: string }> = {
  sm: { height: '32px', fontSize: 'var(--body-sm)', px: 'var(--space-3)' },
  md: { height: '40px', fontSize: 'var(--body-md)', px: 'var(--space-4)' },
  lg: { height: '48px', fontSize: 'var(--body-lg)', px: 'var(--space-4)' },
};

const labelSizes: Record<InputFieldSize, string> = { sm: 'var(--body-sm)', md: 'var(--body-sm)', lg: 'var(--body-md)' };

export function InputField({ label, helperText, errorText, required, inputSize = 'md', disabled, leadingIcon, trailingIcon, style, ...rest }: InputFieldProps) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(errorText);
  const sz = sizeTokens[inputSize];
  const borderColor = disabled ? 'var(--border-disabled)' : hasError ? 'var(--status-error)' : focused ? 'var(--action-primary)' : 'var(--border-subtle)';
  const borderWidth = focused && !disabled ? 'var(--border-width-bold)' : 'var(--border-width-base)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', width: '100%' }}>
      <label htmlFor={id} style={{ fontFamily: 'var(--font-base)', fontSize: labelSizes[inputSize], fontWeight: 500, color: 'var(--text-base)', display: 'flex', gap: 'var(--space-1)' }}>
        {label}
        {required && <span aria-hidden="true" style={{ color: 'var(--status-error)' }}>*</span>}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', height: sz.height, borderRadius: 'var(--radius-md)', border: `${borderWidth} solid ${borderColor}`, backgroundColor: disabled ? 'var(--bg-disabled)' : 'var(--bg-base)', paddingLeft: leadingIcon ? 'var(--space-3)' : sz.px, paddingRight: (trailingIcon || hasError) ? 'var(--space-3)' : sz.px, gap: 'var(--space-2)', boxSizing: 'border-box', transition: 'border-color 0.15s, border-width 0.1s' }}>
        {leadingIcon && <span style={{ color: hasError ? 'var(--status-error)' : 'var(--text-subtle)', flexShrink: 0, display: 'flex' }}>{leadingIcon}</span>}
        <input id={id} disabled={disabled} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          aria-invalid={hasError || undefined} aria-describedby={helperText || errorText ? `${id}-helper` : undefined}
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-base)', fontSize: sz.fontSize, color: disabled ? 'var(--text-disabled)' : 'var(--text-base)', cursor: disabled ? 'not-allowed' : 'text', minWidth: 0, ...style }}
          {...rest} />
        {trailingIcon && !hasError && <span style={{ color: 'var(--text-subtle)', flexShrink: 0, display: 'flex' }}>{trailingIcon}</span>}
        {hasError && (
          <span aria-hidden="true" style={{ flexShrink: 0, color: 'var(--status-error)', display: 'flex' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </span>
        )}
      </div>
      {(helperText || errorText) && (
        <p id={`${id}-helper`} style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--body-sm)', color: hasError ? 'var(--status-error)' : 'var(--text-subtle)', lineHeight: 1.4, margin: 0 }} role={hasError ? 'alert' : undefined}>
          {errorText ?? helperText}
        </p>
      )}
    </div>
  );
}
