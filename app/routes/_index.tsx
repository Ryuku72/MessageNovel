import { useEffect } from 'react';

import type { MetaFunction } from '@remix-run/node';
import { useOutletContext } from '@remix-run/react';

import LOCALES from '~/locales/language_en.json';
import PublicNavBar from '~/components/PublicNavBar';

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
    <div className="w-full h-full flex justify-center items-center flex-col flex-auto relative">
      <div className="p-12 flex justify-center items-center gap-3 flex-col w-full max-w-c-600 flex-auto">
        <PublicNavBar />
        <h1 className="text-red-700 text-6xl m-0 [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
          {LOCALES.index.title}
        </h1>
      </div>
    </div>
  );
}
