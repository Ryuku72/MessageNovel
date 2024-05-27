import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData, useNavigate, useOutletContext } from '@remix-run/react';

import { useEffect } from 'react';

import LOCALES from '~/locales/language_en.json';

import SettingsLoader from './loader';
import SettingsAction from './action';
import { UserDataEntry } from '../dash/type';
import { SettingsView } from './view';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export function loader({ request }: LoaderFunctionArgs) {
  return SettingsLoader(request);
}

export function action({ request }: ActionFunctionArgs) {
  return SettingsAction(request);
}

export default function Settings() {
  const loaderData = useLoaderData<UserDataEntry>() || {};
  const { sceneReady } = useOutletContext<{ sceneReady: boolean }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sceneReady) return;
    const sceneEvent = new CustomEvent('sceneUpdate', {
      detail: 4
    });
    window.dispatchEvent(sceneEvent);
  }, [sceneReady]);

  const handleSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/dash');
  };

  return <SettingsView loaderData={loaderData} handleSubmit={handleSubmit} />;
}
