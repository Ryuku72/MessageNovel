import { NavLink } from '@remix-run/react';

import LOCALES from '~/locales/language_en.json';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const LocalString = LOCALES.public_nav;
  return (
    <div className="w-full h-full flex flex-col flex-auto relative">
      <nav className="sticky top-0 right-0 flex w-full items-end min-[768px]:gap-8 max-[768px]:gap-2 justify-end px-8 py-6 max-[768px]:px-2 flex-wrap z-[2] bg-slate-900 backdrop-blur-sm min-[768px]:bg-opacity-5 max-[768px]:bg-opacity-40 font-miltonian">
        <NavLink
          to="/login"
          className={({ isActive, isPending, isTransitioning }) =>
            `text-3xl max-[768px]:text-xl font-semibold tracking-widest ${isActive || isPending || isTransitioning ? ' text-slate-600 max-[768px]:text-white underline underline-offset-[14px]' : 'text-slate-100 hover:underline-offset-[14px] hover:underline'} flex items-center justify-center`
          }>
          &nbsp;&nbsp;{LocalString.primary_button}&nbsp;&nbsp;
        </NavLink>
        <NavLink
          to="/create"
          className={({ isActive, isPending, isTransitioning }) =>
            `text-3xl max-[768px]:text-xl font-semibold tracking-widest ${isActive || isPending || isTransitioning ? ' text-slate-600 max-[768px]:text-white underline underline-offset-[14px]' : 'text-slate-100 hover:underline-offset-[14px] hover:underline'} flex items-center justify-center`
          }>
          &nbsp;&nbsp;{LocalString.secondary_button}&nbsp;&nbsp;
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive, isPending, isTransitioning }) =>
            `text-3xl max-[768px]:text-xl font-semibold tracking-widest ${isActive || isPending || isTransitioning ? ' text-slate-600 max-[768px]:text-white underline underline-offset-[14px]' : 'text-slate-100 hover:underline-offset-[14px] hover:underline'} flex items-center justify-center`
          }>
          &nbsp;&nbsp;{LocalString.tertiary_button}&nbsp;&nbsp;
        </NavLink>
      </nav>
      <div className="min-[768px]:p-12 max-[768px]:p-4 flex justify-center items-center gap-3 flex-col w-full flex-auto">
        {children}
      </div>
    </div>
  );
}
