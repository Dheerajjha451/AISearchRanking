import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  className = '',
  padding = 'md',
}: CardProps) {
  return (
    <div
      className={`
        backdrop-blur-xl bg-white/[0.03] border border-white/[0.06]
        rounded-2xl shadow-xl
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
