import { Link } from '@remix-run/react';
import LOCALES from '~/locales/language_en.json';

export default function PublicNavBar() {
  return (
    <div className="absolute min-[768px]:top-0 max-[768px]:bottom-0 right-0 w-full flex items-end gap-5 justify-end p-8 flex-wrap z-[2]">
      <Link
        to="/login"
        className="rounded-lg px-5 py-2.5 text-gray-100 bg-blue-500 hover:bg-green-500 w-full max-w-button flex items-center justify-center bg-opacity-95 backdrop-blur-sm shadow-xl">
        {LOCALES.index.primary_button}
      </Link>
      <Link
        to="/create"
        className="rounded-lg px-5 py-2.5 whitespace-pre text-gray-100 bg-orange-400 hover:bg-orange-500 flex items-center justify-center w-full max-w-button bg-opacity-95 backdrop-blur-sm shadow-xl">
        {LOCALES.index.secondary_button}
      </Link>
      <Link
        to="/about"
        className="rounded-lg px-5 py-2.5 text-gray-100 bg-slate-400 hover:bg-slate-600 hover:text-gray-100 w-full max-w-button flex items-center justify-center bg-opacity-95 backdrop-blur-sm shadow-xl">
        {LOCALES.index.tertiary_button}
      </Link>
    </div>
  );
}
