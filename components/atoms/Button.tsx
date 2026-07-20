import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#f4f1e8] text-[#080808] hover:bg-[#f4f1e8]/85 shadow-lg shadow-black/20',
  secondary:
    'bg-transparent text-[#f4f1e8] border border-[#f4f1e8]/[0.22] hover:bg-[#f4f1e8] hover:text-[#080808]',
  ghost: 'text-[#f4f1e8]/60 hover:text-[#f4f1e8] hover:bg-[#f4f1e8]/[0.08]',
  danger:
    'bg-transparent text-[#f4f1e8] border border-[#f4f1e8]/[0.22] hover:bg-[#f4f1e8] hover:text-[#080808]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center gap-2 font-medium
          transition-all duration-200 ease-out
          active:scale-[0.97]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
        {...props}
      >
        {loading && (
          <div className="h-3 w-3 animate-pulse bg-current" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
