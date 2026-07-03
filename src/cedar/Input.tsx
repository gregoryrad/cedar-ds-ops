import { useState, type InputHTMLAttributes, type ReactNode } from 'react';

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  inputSize?: InputSize;
  hasError?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const sizeTokens: Record<InputSize, { height: string; fontSize: string; px: string; iconSize: number }> = {
  sm: { height: '32px', fontSize: 'var(--body-sm)', px: 'var(--space-3)', iconSize: 14 },
  md: { height: '40px', fontSize: 'var(--body-md)', px: 'var(--space-4)', iconSize: 16 },
  lg: { height: '48px', fontSize: 'var(--body-lg)', px: 'var(--space-4)', iconSize: 18 },
};

export function Input({ inputSize = 'md', hasError = false, disabled, leadingIcon, trailingIcon, style, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);
  const sz = sizeTokens[inputSize];
  const borderColor = disabled ? 'var(--border-disabled)' : hasError ? 'var(--status-error)' : focused ? 'var(--action-primary)' : 'var(--border-subtle)';
  const borderWidth = focused && !disabled ? 'var(--border-width-bold)' : 'var(--border-width-base)';

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: sz.height, borderRadius: 'var(--radius-md)', border: `${borderWidth} solid ${borderColor}`, backgroundColor: disabled ? 'var(--bg-disabled)' : 'var(--bg-base)', paddingLeft: leadingIcon ? 'var(--space-3)' : sz.px, paddingRight: trailingIcon ? 'var(--space-3)' : sz.px, gap: 'var(--space-2)', boxSizing: 'border-box', transition: 'border-color 0.15s, border-width 0.1s', outline: 'none', width: '100%' }}>
      {leadingIcon && (
        <span style={{ color: disabled ? 'var(--text-disabled)' : hasError ? 'var(--status-error)' : 'var(--text-subtle)', flexShrink: 0, display: 'flex' }}>{leadingIcon}</span>
      )}
      <input disabled={disabled} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-base)', fontSize: sz.fontSize, color: disabled ? 'var(--text-disabled)' : 'var(--text-base)', cursor: disabled ? 'not-allowed' : 'text', width: '100%', minWidth: 0, ...style }}
        {...rest} />
      {trailingIcon && (
        <span style={{ color: disabled ? 'var(--text-disabled)' : hasError ? 'var(--status-error)' : 'var(--text-subtle)', flexShrink: 0, display: 'flex' }}>{trailingIcon}</span>
      )}
      {hasError && !trailingIcon && (
        <span aria-hidden="true" style={{ flexShrink: 0, color: 'var(--status-error)', display: 'flex' }}>
          <svg width={sz.iconSize} height={sz.iconSize} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </span>
      )}
    </div>
  );
}
