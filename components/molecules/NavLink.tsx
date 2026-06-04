'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavLinkProps {
  href: string;
  icon: ReactNode;
  children: ReactNode;
}

export default function NavLink({ href, icon, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        flex shrink-0 items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-200 whitespace-nowrap
        ${
          isActive
            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }
      `}
    >
      <span className="w-5 h-5">{icon}</span>
      {children}
    </Link>
  );
}
