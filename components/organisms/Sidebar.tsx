'use client';

import NavLink from '@/components/molecules/NavLink';
import SearchRankLogo from '@/components/atoms/SearchRankLogo';

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
    <aside className="sticky top-0 z-30 w-full border-b border-white/[0.06] bg-[#060a14]/95 backdrop-blur-xl md:static md:w-64 md:shrink-0 md:border-b-0 md:border-r md:bg-[#060a14] md:flex md:min-h-screen md:flex-col">
      {/* Brand */}
      <div className="px-4 py-3 md:px-6 md:py-5 md:border-b md:border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <SearchRankLogo className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">AI Ranking</h1>
            <p className="text-xs text-gray-500">Monitor</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex gap-2 overflow-x-auto px-3 pb-3 md:block md:flex-1 md:space-y-1 md:overflow-visible md:py-4">
        {navItems.map((item) => (
          <NavLink key={item.href} href={item.href} icon={item.icon}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="hidden px-6 py-4 border-t border-white/[0.06] md:block">
        <p className="text-xs text-gray-600">
          AI Ranking Monitor v1.0
        </p>
      </div>
    </aside>
  );
}
