import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData, useOutletContext, useSubmit } from '@remix-run/react';

import { useEffect } from 'react';

import { NovelinLibraryEntry, UserDataEntry } from '~/types';

import LOCALES from '~/locales/language_en.json';

import { DashAction, DashLoader } from './services';
import DashView from './view';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export function loader({ request }: LoaderFunctionArgs) {
  return DashLoader(request);
}

export function action({ request }: ActionFunctionArgs) {
  return DashAction(request);
}

export default function Dash() {
  const loaderData =
    useLoaderData<{
      user: UserDataEntry;
      library: NovelinLibraryEntry[];
    }>() || {};
  const { sceneReady } = useOutletContext<{ sceneReady: boolean }>();
  const submit = useSubmit();

  useEffect(() => {
    if (!sceneReady) return;
    const sceneEvent = new CustomEvent('sceneUpdate', {
      detail: 4
    });
    window.dispatchEvent(sceneEvent);
  }, [sceneReady]);

  const handleSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    const formData = new FormData();
    formData.append('type', 'sign_out');
    submit(formData, { method: 'post' });
  };

  return <DashView handleSubmit={handleSubmit} loaderData={loaderData} />;
}
