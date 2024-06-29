import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Outlet, useLoaderData, useOutletContext, useSearchParams } from '@remix-run/react';

import { useEffect } from 'react';

import { createBrowserClient } from '@supabase/ssr';
import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';

import LOCALES from '~/locales/language_en.json';
import { UserDataEntry } from '~/types';

import DashNavBar from './components/DashNavBar';
import { DashLoader } from './services';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export function loader({ request }: LoaderFunctionArgs) {
  return DashLoader(request);
}

export type DashOutletContext = {
  user: UserDataEntry;
  supabase: SupabaseClient;
  channel: RealtimeChannel;
  img_url: string;
};

export default function Dash() {
  const { user, env } = useLoaderData<{
    user: UserDataEntry;
    env: { SUPABASE_URL: string; SUPABASE_ANON_KEY: string; SUPABASE_IMG_STORAGE: string };
  }>();
  const { sceneReady } = useOutletContext<{ sceneReady: boolean }>();
  const [searchParams] = useSearchParams();
  const showComments = searchParams.get('showComments');

  const supabase = createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

  useEffect(() => {
    if (!sceneReady) return;
    const sceneEvent = new CustomEvent('sceneUpdate', {
      detail: 4
    });
    window.dispatchEvent(sceneEvent);
  }, [sceneReady]);

  return (
    <div
      className={`w-full flex flex-auto flex-row relative ${showComments ? 'md:overflow-visible overflow-hidden' : 'overflow-visible'}`}
      id="dash-default">
      <DashNavBar user={user} />
      <Outlet context={{ user, supabase, img_url: env.SUPABASE_IMG_STORAGE + 'public/avatars/' }} />
    </div>
  );
}
