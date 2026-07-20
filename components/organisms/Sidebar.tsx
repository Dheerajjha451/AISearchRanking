'use client';

import NavLink from '@/components/molecules/NavLink';
import Image from 'next/image';

const navItems = [
  {
    href: '/',
    label: 'Dashboard',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    href: '/history',
    label: 'History',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  return (
    <aside className="sticky top-0 z-30 w-full border-b border-[#f4f1e8]/[0.16] bg-[#080808] md:static md:w-72 md:shrink-0 md:border-b-0 md:border-r md:flex md:min-h-screen md:flex-col">
      {/* Brand */}
      <div className="px-4 py-3 md:px-6 md:py-6 md:border-b md:border-[#f4f1e8]/[0.16]">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center border border-[#f4f1e8] bg-[#f4f1e8] md:h-16 md:w-16">
            <Image src="/logo.png" alt="Rankline logo" width={64} height={64} className="h-10 w-10 object-contain md:h-14 md:w-14" priority />
          </div>
          <div>
            <h1 className="display-type text-base font-bold text-[#f4f1e8]">Rankline</h1>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f4f1e8]/55">AI visibility</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex gap-2 overflow-x-auto px-3 pb-3 md:block md:flex-1 md:space-y-1 md:overflow-visible md:px-4 md:py-6">
        {navItems.map((item) => (
          <NavLink key={item.href} href={item.href} icon={item.icon}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="hidden px-6 py-5 border-t border-[#f4f1e8]/[0.16] md:block">
        <p className="eyebrow mb-2">Workspace status</p>
        <div className="flex items-center gap-2 text-xs text-[#f4f1e8]/65">
          <span className="h-2 w-2 bg-[#f4f1e8]" />
          OpenRouter connected
        </div>
      </div>
    </aside>
  );
}
