import { useId, type ReactNode } from 'react';

type FormFieldSize = 'sm' | 'md' | 'lg';

interface FormFieldProps {
  label: string;
  helperText?: string;
  errorText?: string;
  required?: boolean;
  inputSize?: FormFieldSize;
  children: ReactNode;
}

const labelSizes: Record<FormFieldSize, string> = { sm: 'var(--body-sm)', md: 'var(--body-sm)', lg: 'var(--body-md)' };
const helperSizes: Record<FormFieldSize, string> = { sm: 'var(--size-xs)', md: 'var(--body-sm)', lg: 'var(--body-sm)' };

export function FormField({ label, helperText, errorText, required, inputSize = 'md', children }: FormFieldProps) {
  const id = useId();
  const hasError = Boolean(errorText);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', width: '100%' }}>
      <label htmlFor={id} style={{ fontFamily: 'var(--font-base)', fontSize: labelSizes[inputSize], fontWeight: 500, color: 'var(--text-base)', display: 'flex', gap: 'var(--space-1)' }}>
        {label}
        {required && <span aria-hidden="true" style={{ color: 'var(--status-error)' }}>*</span>}
      </label>
      {children}
      {(helperText || errorText) && (
        <p style={{ fontFamily: 'var(--font-base)', fontSize: helperSizes[inputSize], color: hasError ? 'var(--status-error)' : 'var(--text-subtle)', lineHeight: 1.4, margin: 0 }} role={hasError ? 'alert' : undefined}>
          {errorText ?? helperText}
        </p>
      )}
    </div>
  );
}
