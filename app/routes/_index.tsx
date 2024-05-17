import type { MetaFunction } from '@remix-run/node';
import { Link, useOutletContext } from '@remix-run/react';
import { useEffect } from 'react';

import { ToastAlert } from '~/components/ToastAlert';
import LOCALES from '~/locales/language_en.json';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export default function Index() {
  const { sceneReady } = useOutletContext() as {
    sceneReady: boolean;
  };
  useEffect(() => {
    if (!sceneReady) return;

    const sceneEvent = new CustomEvent('sceneUpdate', {
      detail: 1
    });
    window.dispatchEvent(sceneEvent);
  }, [sceneReady]);

  return (
    <div className="w-full h-full flex justify-center items-center flex-col flex-auto absolute">
      <div className="p-12 flex justify-center items-center gap-3 flex-col w-full max-w-c-600 flex-auto">
      <div className="absolute min-[768px]:top-0 max-[768px]:bottom-0 right-0 w-full flex items-end gap-5 justify-end p-8 flex-wrap">
            <Link
              to="/login"
              className="rounded-lg h-10 px-4 text-gray-100 bg-blue-500 hover:bg-green-500 w-full max-w-button flex items-center justify-center">
              {LOCALES.index.primary_button}
            </Link>
            <Link
              to="/onboarding"
              className="rounded-lg h-10 px-4 text-gray-100 bg-orange-400 hover:bg-orange-500 flex items-center justify-center w-full max-w-button">
              {LOCALES.index.secondary_button}
            </Link>
          </div>
        <h1 className="text-red-800 text-6xl m-0 [text-shadow:_5px_3px_2px_rgb(107_114_128_/_50%)] font-medium font-miltonian">
          {LOCALES.index.title}
        </h1>
      </div>
      <ToastAlert />
    </div>
  );
}
