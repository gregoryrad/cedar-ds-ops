import React, { type ButtonHTMLAttributes, type ReactNode } from 'react';

export type IconButtonVariant = 'filled' | 'outlined' | 'ghost';
export type IconButtonColor = 'brand' | 'secondary' | 'accent' | 'destructive' | 'neutral';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  'aria-label': string;
  variant?: IconButtonVariant;
  color?: IconButtonColor;
  size?: IconButtonSize;
}

const SIZES: Record<IconButtonSize, { wh: string; radius: string; iconSize: string }> = {
  sm: { wh: '32px', radius: 'var(--radius-md)', iconSize: '16px' },
  md: { wh: '40px', radius: 'var(--radius-lg)', iconSize: '18px' },
  lg: { wh: '48px', radius: 'var(--radius-lg)', iconSize: '20px' },
};

const COLOR_BASE: Record<IconButtonColor, string> = {
  brand: 'var(--action-primary)', secondary: 'var(--action-secondary)',
  accent: 'var(--action-accent)', destructive: 'var(--action-destructive)', neutral: 'var(--action-neutral)',
};

const COLOR_HOVER: Record<IconButtonColor, string> = {
  brand: 'var(--action-primary-hover)', secondary: 'var(--action-secondary-hover)',
  accent: 'var(--action-accent-hover)', destructive: 'var(--action-destructive-hover)', neutral: 'var(--action-neutral-hover)',
};

export function IconButton({ icon, variant = 'ghost', color = 'neutral', size = 'md', disabled, style, ...rest }: IconButtonProps) {
  const sz = SIZES[size];
  const base = COLOR_BASE[color];
  const hover = COLOR_HOVER[color];

  const variantStyle = ((): React.CSSProperties => {
    if (disabled) return { backgroundColor: variant === 'filled' ? 'var(--action-primary-disabled)' : 'transparent', color: 'var(--text-disabled)', border: variant === 'outlined' ? 'var(--border-width-base) solid var(--border-disabled)' : 'none' };
    switch (variant) {
      case 'filled':   return { backgroundColor: base, color: 'var(--action-on-primary)', border: 'none' };
      case 'outlined': return { backgroundColor: 'transparent', color: base, border: `var(--border-width-base) solid ${base}` };
      case 'ghost':    return { backgroundColor: 'transparent', color: base, border: 'none' };
    }
  })();

  return (
    <button disabled={disabled}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: sz.wh, height: sz.wh, flexShrink: 0, borderRadius: sz.radius, fontFamily: 'var(--font-base)', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background-color 0.15s, color 0.15s, border-color 0.15s', outline: 'none', padding: 0, fontSize: sz.iconSize, ...variantStyle, ...style }}
      onMouseEnter={e => {
        if (disabled) return;
        const el = e.currentTarget;
        if (variant === 'filled') el.style.backgroundColor = hover;
        else { el.style.color = hover; el.style.backgroundColor = 'var(--bg-faint)'; }
      }}
      onMouseLeave={e => {
        if (disabled) return;
        const el = e.currentTarget;
        if (variant === 'filled') el.style.backgroundColor = base;
        else { el.style.color = base; el.style.backgroundColor = 'transparent'; }
      }}
      {...rest}>
      {icon}
    </button>
  );
}
