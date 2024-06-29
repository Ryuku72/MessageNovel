import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useOutletContext } from '@remix-run/react';

import { useEffect, useState } from 'react';

import { ProfileEntry } from '~/types';

import Default_Avatar from '~/assets/default_avatar.jpeg';

import { DashOutletContext } from '../dash/route';
import { UserLoader } from './services';

export function loader({ request }: LoaderFunctionArgs) {
  return UserLoader(request);
}
// update - new and old
// delete - old
// insert - new?
export type UserChangesBroadcast = {
  commit_timestamp: string;
  errors: null | Error;
  eventType: 'UPDATE' | 'DELETE' | 'INSERT';
  new: ProfileEntry;
  old: ProfileEntry;
  schema: 'Public';
  table: 'profiles';
};

export default function DashUsers() {
  const profiles = useLoaderData<ProfileEntry[]>();
  const { supabase, onlineUsers, img_url } = useOutletContext<DashOutletContext>();
  const [userProfiles, setUserProfiles] = useState<ProfileEntry[]>(profiles);

  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel('user-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          const info = payload as unknown as UserChangesBroadcast;
          switch (payload.eventType) {
            case 'INSERT': return setUserProfiles(profiles => [...profiles, info.new]);
            case 'UPDATE': return setUserProfiles(profiles => profiles.map(user => {
              if (user.id === info.new.id) return info.new;
              else return user;
            }));
            case 'DELETE': return setUserProfiles(profiles => profiles.filter(user => user.id !== info.old.id));
          }
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [supabase]);

  return (
    <div className="flex flex-col flex-auto items-center w-full md:px-10 px-3 md:pt-12 md:pb-12 pb-[200px] pt-4 gap-10">
      <h1 className="text-red-700 text-4xl underline underline-offset-8 [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
        &nbsp;&nbsp;Participants&nbsp;&nbsp;&nbsp;
      </h1>
      <div className="grid grid-cols-[repeat(auto-fill,320px)] gap-4 w-wide">
        {userProfiles?.map(profile => {
          const online = onlineUsers?.find(user_id => user_id === profile?.id);
          return (
            <div
              key={profile.id}
              className={`flex flex-wrap w-full px-10 py-6 overflow-hidden relative rounded-lg font-mono flex-col gap-1 text-white items-center ${online ? profile.color : 'bg-gray-400'} bg-opacity-65 backdrop-blur-lg`}>
              <img
                alt="create-img"
                className="w-20 h-20 relative z-10 rounded-full object-cover bg-gradient-to-b from-slate-500 to-fuchsia-600"
                src={img_url + profile?.avatar || Default_Avatar}
                onError={e => {
                  e.currentTarget.src = Default_Avatar;
                  e.currentTarget.onerror = null;
                  return e;
                }}
              />
              <div className="relative flex flex-col z-10 text-center">
                <h3 className="text-current text-2xl font-semibold tracking-wide truncate max-w-full overflow-hidden capitalize">
                  {profile.username}
                </h3>
                <p
                  className={`${online ? 'text-emerald-600 font-semibold' : 'text-slate-700'} font-semibold tracking-wide overflow-hidden`}>
                  {online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
