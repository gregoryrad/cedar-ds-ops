import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'filled' | 'outlined' | 'ghost';
type ButtonColor = 'brand' | 'secondary' | 'accent' | 'destructive' | 'neutral';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
}

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: 'var(--space-1) var(--space-3)', fontSize: 'var(--body-sm)', height: '32px', borderRadius: 'var(--radius-md)' },
  md: { padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--body-md)', height: '40px', borderRadius: 'var(--radius-lg)' },
  lg: { padding: 'var(--space-3) var(--space-6)', fontSize: 'var(--body-lg)', height: '48px', borderRadius: 'var(--radius-lg)' },
};

const colorMap: Record<ButtonColor, string> = {
  brand: 'var(--action-primary)', secondary: 'var(--action-secondary)',
  accent: 'var(--action-accent)', destructive: 'var(--action-destructive)',
  neutral: 'var(--action-neutral)',
};

const colorHoverMap: Record<ButtonColor, string> = {
  brand: 'var(--action-primary-hover)', secondary: 'var(--action-secondary-hover)',
  accent: 'var(--action-accent-hover)', destructive: 'var(--action-destructive-hover)',
  neutral: 'var(--action-neutral-hover)',
};

export function Button({ variant = 'filled', color = 'brand', size = 'md', disabled, children, style, ...rest }: ButtonProps) {
  const base = colorMap[color];
  const hover = colorHoverMap[color];

  const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    filled:   { backgroundColor: disabled ? 'var(--action-primary-disabled)' : base, color: disabled ? 'var(--text-disabled)' : 'var(--action-on-primary)', border: 'none' },
    outlined: { backgroundColor: 'transparent', color: disabled ? 'var(--text-disabled)' : base, border: `var(--border-width-base) solid ${disabled ? 'var(--border-disabled)' : base}` },
    ghost:    { backgroundColor: 'transparent', color: disabled ? 'var(--text-disabled)' : base, border: 'none' },
  };

  return (
    <button
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: 'var(--space-2)', fontFamily: 'var(--font-base)', fontWeight: 500,
        lineHeight: 1, cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.15s, color 0.15s, border-color 0.15s',
        outline: 'none', flexShrink: 0,
        ...sizeStyles[size], ...variantStyles[variant], ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        const el = e.currentTarget;
        if (variant === 'filled') el.style.backgroundColor = hover;
        else el.style.color = hover;
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        const el = e.currentTarget;
        if (variant === 'filled') el.style.backgroundColor = base;
        else el.style.color = base;
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
