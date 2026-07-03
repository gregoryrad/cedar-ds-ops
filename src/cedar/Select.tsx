import { useState, useRef, useEffect, useId } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type SelectSize = 'sm' | 'md';
export type SelectState = 'default' | 'error';

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  state?: SelectState;
  size?: SelectSize;
  id?: string;
}

export interface SelectFieldProps extends SelectProps {
  label: string;
  error?: string;
  helper?: string;
}

const SIZE: Record<SelectSize, { height: string; fontSize: string; px: string }> = {
  sm: { height: '32px', fontSize: 'var(--body-sm)', px: 'var(--space-3)' },
  md: { height: '40px', fontSize: 'var(--body-md)', px: 'var(--space-4)' },
};

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function Select({ options, value, onChange, placeholder = 'Select an option', disabled = false, state = 'default', size = 'md', id }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const listboxId = `${controlId}-listbox`;
  const selected = options.find(o => o.value === value);
  const sz = SIZE[size];

  const borderColor = disabled ? 'var(--border-disabled)' : state === 'error' ? 'var(--status-error)' : (focused || open) ? 'var(--action-primary)' : 'var(--border-subtle)';
  const borderWidth = (focused || open) && !disabled ? 'var(--border-width-bold)' : 'var(--border-width-base)';

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => { if (!wrapperRef.current?.contains(e.target as Node)) { setOpen(false); setFocusedIdx(-1); } };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const idx = options.findIndex(o => o.value === value && !o.disabled);
    setFocusedIdx(idx >= 0 ? idx : options.findIndex(o => !o.disabled));
    listboxRef.current?.focus();
  }, [open]);

  function handleTriggerKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;
    if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) { e.preventDefault(); setOpen(true); }
  }

  function handleListboxKeyDown(e: React.KeyboardEvent) {
    const enabledIdxs = options.map((o, i) => (!o.disabled ? i : -1)).filter(i => i >= 0);
    const pos = enabledIdxs.indexOf(focusedIdx);
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); setFocusedIdx(-1); triggerRef.current?.focus(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setFocusedIdx(enabledIdxs[(pos + 1) % enabledIdxs.length]); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setFocusedIdx(enabledIdxs[(pos - 1 + enabledIdxs.length) % enabledIdxs.length]); }
    else if (e.key === 'Home') { e.preventDefault(); setFocusedIdx(enabledIdxs[0]); }
    else if (e.key === 'End') { e.preventDefault(); setFocusedIdx(enabledIdxs[enabledIdxs.length - 1]); }
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const opt = options[focusedIdx];
      if (opt && !opt.disabled) { onChange?.(opt.value); setOpen(false); setFocusedIdx(-1); triggerRef.current?.focus(); }
    } else if (e.key === 'Tab') { setOpen(false); setFocusedIdx(-1); }
  }

  const activeDescendant = focusedIdx >= 0 ? `${listboxId}-opt-${focusedIdx}` : undefined;

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <button
        ref={triggerRef} id={controlId} type="button" role="combobox"
        aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? listboxId : undefined}
        disabled={disabled}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        onClick={() => { if (!disabled) setOpen(o => !o); }}
        onKeyDown={handleTriggerKeyDown}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: sz.height, padding: `0 ${sz.px}`, border: `${borderWidth} solid ${borderColor}`, borderRadius: 'var(--radius-md)', backgroundColor: disabled ? 'var(--bg-disabled)' : 'var(--bg-base)', fontFamily: 'var(--font-base)', fontSize: sz.fontSize, color: selected ? (disabled ? 'var(--text-disabled)' : 'var(--text-base)') : 'var(--text-subtle)', cursor: disabled ? 'not-allowed' : 'pointer', boxSizing: 'border-box', transition: 'border-color 0.15s', outline: 'none', gap: 'var(--space-2)', textAlign: 'left' }}
      >
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selected?.label ?? placeholder}</span>
        <span style={{ color: disabled ? 'var(--text-disabled)' : 'var(--text-subtle)', transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'none', display: 'flex' }}>
          <ChevronDown />
        </span>
      </button>
      {open && (
        <ul ref={listboxRef} id={listboxId} role="listbox" tabIndex={-1} aria-activedescendant={activeDescendant} onKeyDown={handleListboxKeyDown}
          style={{ position: 'absolute', top: 'calc(100% + var(--space-1))', left: 0, right: 0, zIndex: 900, backgroundColor: 'var(--bg-base)', border: 'var(--border-width-base) solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', padding: 'var(--space-1)', margin: 0, listStyle: 'none', maxHeight: 240, overflowY: 'auto', outline: 'none' }}>
          {options.map((opt, i) => {
            const isFocused = i === focusedIdx;
            const isSelected = opt.value === value;
            return (
              <li key={opt.value} id={`${listboxId}-opt-${i}`} role="option" aria-selected={isSelected} aria-disabled={opt.disabled}
                onClick={() => { if (!opt.disabled) { onChange?.(opt.value); setOpen(false); setFocusedIdx(-1); triggerRef.current?.focus(); } }}
                onMouseEnter={() => { if (!opt.disabled) setFocusedIdx(i); }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px var(--space-3)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--body-sm)', fontFamily: 'var(--font-base)', color: opt.disabled ? 'var(--text-disabled)' : 'var(--text-base)', backgroundColor: isFocused && !opt.disabled ? 'var(--bg-faint)' : 'transparent', cursor: opt.disabled ? 'not-allowed' : 'pointer' }}>
                <span>{opt.label}</span>
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M11.5 3.5L5.5 10L2.5 7" stroke="var(--action-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function SelectField({ label, error, helper, state, ...selectProps }: SelectFieldProps) {
  const id = useId();
  const resolvedState = error ? 'error' : (state ?? 'default');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', width: '100%' }}>
      <label htmlFor={id} style={{ fontSize: 'var(--body-sm)', fontWeight: 500, color: selectProps.disabled ? 'var(--text-disabled)' : 'var(--text-base)', fontFamily: 'var(--font-base)' }}>{label}</label>
      <Select {...selectProps} id={id} state={resolvedState} />
      {(error || helper) && (
        <p style={{ margin: 0, fontSize: 'var(--size-xs)', fontFamily: 'var(--font-base)', color: error ? 'var(--status-error)' : 'var(--text-subtle)' }}>{error ?? helper}</p>
      )}
    </div>
  );
}
