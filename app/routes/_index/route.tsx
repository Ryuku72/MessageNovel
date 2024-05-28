import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useOutletContext } from '@remix-run/react';

import { useEffect } from 'react';

import LOCALES from '~/locales/language_en.json';

import { indexLoader } from './services';
import IndexView from './view';

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

  return <IndexView />;
}
