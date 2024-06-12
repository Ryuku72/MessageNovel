import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Outlet, useLoaderData, useOutletContext, useSearchParams } from '@remix-run/react';

import { useEffect } from 'react';

import { UserDataEntry } from '~/types';

import LOCALES from '~/locales/language_en.json';

import DashNavBar from './components/DashNavBar';
import { DashLoader } from './services';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export function loader({ request }: LoaderFunctionArgs) {
  return DashLoader(request);
}

export default function Dash() {
  const loaderData = useLoaderData<UserDataEntry>();
  const { sceneReady } = useOutletContext<{ sceneReady: boolean }>();
  const [searchParams] = useSearchParams();
  const showComments = searchParams.get('showComments');

  useEffect(() => {
    if (!sceneReady) return;
    const sceneEvent = new CustomEvent('sceneUpdate', {
      detail: 4
    });
    window.dispatchEvent(sceneEvent);
  }, [sceneReady]);

  return (
    <div
      className={`w-full md:h-full flex flex-row relative ${showComments ? 'md:overflow-visible overflow-hidden' : 'overflow-visible'}`}
      id="dash-default">
      <DashNavBar user={loaderData} />
      <Outlet context={{ user: loaderData }} />
    </div>
  );
}
