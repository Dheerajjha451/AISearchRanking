import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-[0.12em] text-[#f4f1e8]/70"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3 text-sm text-[#f4f1e8]
            bg-[#080808] border border-[#f4f1e8]/[0.16]
            placeholder:text-[#f4f1e8]/35
            focus:outline-none focus:ring-1 focus:ring-[#f4f1e8] focus:border-[#f4f1e8]
            transition-all duration-200
            ${error ? 'border-[#f4f1e8] focus:ring-[#f4f1e8]' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-[#f4f1e8]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
