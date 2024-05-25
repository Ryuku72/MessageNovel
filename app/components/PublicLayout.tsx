import { NavLink } from '@remix-run/react';

import LOCALES from '~/locales/language_en.json';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col flex-auto relative">
      <div className="min-[768px]:p-12 max-[768px]:p-4 flex justify-center items-center gap-3 flex-col w-full flex-auto">
        <header className="w-full min-[768px]:pb-0 max-[768px]:pb-[80px]">
          <nav className="absolute flex top-0 right-0 w-full items-end min-[768px]:gap-8 max-[768px]:gap-2 justify-end px-8 py-6 max-[768px]:px-2 flex-wrap z-[2] bg-slate-50 backdrop-blur-sm bg-opacity-15 font-miltonian">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `text-3xl max-[768px]:text-lg font-semibold tracking-widest ${isActive ? ' text-slate-600 underline underline-offset-[14px]' : 'text-slate-400 hover:underline-offset-[14px] hover:underline'} flex items-center justify-center`
              }>
              &nbsp;&nbsp;{LOCALES.index.primary_button}&nbsp;&nbsp;
            </NavLink>
            <NavLink
              to="/create"
              className={({ isActive }) =>
                `text-3xl max-[768px]:text-lg font-semibold tracking-widest ${isActive ? ' text-slate-600 underline underline-offset-[14px]' : 'text-slate-400 hover:underline-offset-[14px] hover:underline'} flex items-center justify-center`
              }>
              &nbsp;&nbsp;{LOCALES.index.secondary_button}&nbsp;&nbsp;
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-3xl max-[768px]:text-lg font-semibold tracking-widest ${isActive ? ' text-slate-600 underline underline-offset-[14px]' : 'text-slate-400 hover:underline-offset-[14px] hover:underline'} flex items-center justify-center`
              }>
              &nbsp;&nbsp;{LOCALES.index.tertiary_button}&nbsp;&nbsp;
            </NavLink>
          </nav>
        </header>
        {children}
      </div>
    </div>
  );
}
