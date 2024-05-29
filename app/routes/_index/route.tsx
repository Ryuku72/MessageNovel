import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useOutletContext } from '@remix-run/react';

import { useEffect } from 'react';

import LOCALES from '~/locales/language_en.json';

import { PublicLayout } from '~/components/PublicLayout';

import { indexLoader } from './services';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export function loader({ request }: LoaderFunctionArgs) {
  return indexLoader(request);
}

export default function Index() {
  const { sceneReady } = useOutletContext<{ sceneReady: boolean }>();
  useEffect(() => {
    if (!sceneReady) return;

    const sceneEvent = new CustomEvent('sceneUpdate', {
      detail: 1
    });
    window.dispatchEvent(sceneEvent);
  }, [sceneReady]);

  return (
    <PublicLayout>
      <h1 className="text-red-700 text-6xl m-0 [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
        {LOCALES._index.title}
      </h1>
    </PublicLayout>
  );
}
