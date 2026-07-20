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
        flex shrink-0 items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 text-sm font-medium
        transition-all duration-200 whitespace-nowrap
        ${
          isActive
            ? 'bg-[#f4f1e8] text-[#080808] shadow-[0_8px_20px_rgba(0,0,0,0.2)]'
            : 'text-[#f4f1e8]/60 hover:text-[#f4f1e8] hover:bg-[#f4f1e8]/[0.08]'
        }
      `}
    >
      <span className="w-5 h-5">{icon}</span>
      {children}
    </Link>
  );
}
