import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Outlet, useLoaderData, useNavigation, useOutletContext, useSubmit } from '@remix-run/react';

import { useEffect } from 'react';

import { UserDataEntry } from '~/types';

import LOCALES from '~/locales/language_en.json';

import { DashAction, DashLoader } from './services';
import DashNavBar from './components/DashNavBar';

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
  const loaderData = useLoaderData<UserDataEntry>();
  const { sceneReady } = useOutletContext<{ sceneReady: boolean }>();
  const submit = useSubmit();
  const navigationState = useNavigation();

  const isLoading = ['submitting', 'loading'].includes(navigationState.state);

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

  return (
    <div className="w-full h-full flex flex-row max-[768px]:flex-col-reverse relative">
      <DashNavBar user={loaderData} isLoading={isLoading} handleSubmit={handleSubmit} />
      <Outlet context={{ user: loaderData }} />
    </div>
  );
}
