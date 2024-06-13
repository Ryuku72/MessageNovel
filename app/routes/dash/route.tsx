import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Outlet, useLoaderData, useOutletContext, useSearchParams } from '@remix-run/react';

import { useEffect, useState } from 'react';

import { createBrowserClient } from '@supabase/ssr';
import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { UserDataEntry } from '~/types';

import { EnvConfigEntry } from '~/services/API';

import LOCALES from '~/locales/language_en.json';

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
  onlineUsers: { id: string; room: string }[];
};

export default function Dash() {
  const { user, env } = useLoaderData<{ user: UserDataEntry; env: EnvConfigEntry }>();
  const { sceneReady } = useOutletContext<{ sceneReady: boolean }>();
  const [searchParams] = useSearchParams();
  const showComments = searchParams.get('showComments');
  
  const supabase = createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

  const [channel, setChannel] = useState<RealtimeChannel>();
  const [onlineUsers, setOnlineUsers] = useState<{ id: string; room: string }[]>([]);

  useEffect(() => {
    if (!sceneReady) return;
    const sceneEvent = new CustomEvent('sceneUpdate', {
      detail: 4
    });
    window.dispatchEvent(sceneEvent);
  }, [sceneReady]);

  useEffect(() => {
    if (!supabase) return;
    const channel = supabase.channel('dashboard', {
      config: { broadcast: { self: true } }
    });
    channel.subscribe();
    setChannel(channel);

    channel.on('presence', { event: 'sync' }, () => {
      /** Get the presence state from the channel, keyed by realtime identifier */
      const presenceState = channel.presenceState();
      /** transform the presence */
      const users = Object.keys(presenceState)
        .map(presenceId => {
          const presences = presenceState[presenceId] as unknown as { userId: string; room: string }[];
          return presences.map(presence => ({ id: presence.userId, room: presence.room }));
        })
        .flat();
      /** sort and set the users */
      setOnlineUsers(users);
    });

    return () => {
      channel.unsubscribe();
      setChannel(undefined);
    };
  }, [supabase, user]);

  return (
    <div
      className={`w-full md:h-full flex flex-row relative ${showComments ? 'md:overflow-visible overflow-hidden' : 'overflow-visible'}`}
      id="dash-default">
      <DashNavBar user={user} />
      <Outlet context={{ user, supabase, channel, onlineUsers }} />
    </div>
  );
}
