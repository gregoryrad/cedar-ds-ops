import React from 'react';

type CardStyle = 'default' | 'elevated' | 'flat';

interface CardProps {
  cardStyle?: CardStyle;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export function Card({ cardStyle = 'default', children, style, className }: CardProps) {
  const styleMap: Record<CardStyle, React.CSSProperties> = {
    default:  { backgroundColor: 'var(--bg-base)', border: `var(--border-width-base) solid var(--border-subtle)`, boxShadow: 'none' },
    elevated: { backgroundColor: 'var(--bg-base)', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)' },
    flat:     { backgroundColor: 'var(--bg-faint)', border: 'none', boxShadow: 'none' },
  };

  return (
    <div className={className} style={{ borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', fontFamily: 'var(--font-base)', ...styleMap[cardStyle], ...style }}>
      {children}
    </div>
  );
}
