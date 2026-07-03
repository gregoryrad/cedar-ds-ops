import { useState, useRef, useId, useEffect, type ReactNode } from 'react';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: string;
  placement?: TooltipPlacement;
  children: ReactNode;
}

const GAP = 8;

export function Tooltip({ content, placement = 'top', children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const id = useId();

  function position() {
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger || !tooltip) return;
    const t = trigger.getBoundingClientRect();
    const tp = tooltip.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    let top = 0, left = 0;
    switch (placement) {
      case 'top':    top = t.top + scrollY - tp.height - GAP; left = t.left + scrollX + t.width / 2 - tp.width / 2; break;
      case 'bottom': top = t.bottom + scrollY + GAP; left = t.left + scrollX + t.width / 2 - tp.width / 2; break;
      case 'left':   top = t.top + scrollY + t.height / 2 - tp.height / 2; left = t.left + scrollX - tp.width - GAP; break;
      case 'right':  top = t.top + scrollY + t.height / 2 - tp.height / 2; left = t.right + scrollX + GAP; break;
    }
    setCoords({ top, left });
  }

  useEffect(() => { if (visible) requestAnimationFrame(position); }, [visible, placement]);

  return (
    <>
      <span ref={triggerRef} aria-describedby={visible ? id : undefined}
        onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)} onBlur={() => setVisible(false)}
        style={{ display: 'inline-flex' }}>
        {children}
      </span>
      {visible && (
        <div ref={tooltipRef} id={id} role="tooltip"
          style={{ position: 'absolute', top: coords.top, left: coords.left, zIndex: 1200, maxWidth: 240, padding: '6px var(--space-3)', backgroundColor: 'var(--neutral-900)', color: 'var(--foundations-white)', fontSize: 'var(--size-xs)', fontFamily: 'var(--font-base)', lineHeight: 1.5, borderRadius: 'var(--radius-md)', pointerEvents: 'none', whiteSpace: 'normal', wordBreak: 'break-word' }}>
          {content}
        </div>
      )}
    </>
  );
}
