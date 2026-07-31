'use client';

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Field({ label, error, id, ...props }: FieldProps) {
  const fieldId = id ?? props.name;
  return (
    <div className="mb-4">
      <label
        htmlFor={fieldId}
        className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-paper-muted"
      >
        {label}
      </label>
      <input
        id={fieldId}
        {...props}
        className={[
          'w-full rounded-sm border bg-white/60 px-3 py-2.5 font-sans text-[15px] text-ink outline-none transition-colors',
          'placeholder:text-ink/30 focus:border-ember focus:bg-white',
          error ? 'border-red-400' : 'border-paper-line',
        ].join(' ')}
      />
      {error && <p className="mt-1 font-mono text-[11px] text-red-600">{error}</p>}
    </div>
  );
}
