type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SpinnerSize;
  color?: string;
}

const sizeMap: Record<SpinnerSize, number> = { sm: 16, md: 24, lg: 32 };
const strokeMap: Record<SpinnerSize, number> = { sm: 2, md: 2.5, lg: 3 };

export function Spinner({ size = 'md', color = 'var(--action-primary)' }: SpinnerProps) {
  const px = sizeMap[size];
  const stroke = strokeMap[size];
  const r = (px - stroke * 2) / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <svg width={px} height={px} viewBox={`0 0 ${px} ${px}`} aria-label="Loading" role="status"
      style={{ animation: 'cedar-spin 0.75s linear infinite', flexShrink: 0 }}>
      <style>{`@keyframes cedar-spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx={px / 2} cy={px / 2} r={r} fill="none" stroke="var(--border-subtle)" strokeWidth={stroke} />
      <circle cx={px / 2} cy={px / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * 0.75}
        transform={`rotate(-90 ${px / 2} ${px / 2})`} />
    </svg>
  );
}
