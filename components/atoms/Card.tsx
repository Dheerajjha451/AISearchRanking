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
        relative overflow-hidden border border-[#f4f1e8]/[0.14] bg-[#101010] shadow-[0_18px_55px_rgba(0,0,0,0.2)]
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
