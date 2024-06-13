import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useOutletContext } from '@remix-run/react';

import { useEffect, useRef, useState } from 'react';

import { UserDataEntry } from '~/types';


import { UserLoader } from './services';
import { DashOutletContext } from '../dash/route';

export function loader({ request }: LoaderFunctionArgs) {
  return UserLoader(request);
}

export default function DashUsers() {
  const profiles = useLoaderData<UserDataEntry[]>();
  const { channel, onlineUsers } = useOutletContext<DashOutletContext>();
  const [userProfiles, setUserProfiles] = useState(profiles);
  const usersRef = useRef(profiles);

  useEffect(() => {
    if (!channel) return;
    channel.on('broadcast', { event: 'user update'}, (event: { event: string, payload: UserDataEntry, type: string }) => {
      if (usersRef.current.find(user => user.id === event.payload.id)) {
        usersRef.current = usersRef.current.map(user => {
          if (user.id === event.payload.id) return event.payload;
          return user;
        });
        setUserProfiles(usersRef.current);
      }
    });
  }, [channel]);

  return (
    <div className="flex flex-col flex-auto md:flex-1 items-center w-full md:px-10 px-3 md:py-12 py-4 gap-10">
      <h1 className="text-red-700 text-4xl underline underline-offset-8 [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
        &nbsp;&nbsp;Participants&nbsp;&nbsp;&nbsp;
      </h1>
      <div className="flex flex-wrap gap-4 w-full max-w-wide">
        {userProfiles?.map(profile => {
          const online = onlineUsers?.find(user => user === profile?.id);
          return (
            <div
              key={profile.id}
              className={`flex flex-wrap md:w-[300px] w-full px-10 py-6 overflow-hidden relative rounded-lg font-mono flex-col gap-1 text-white items-center ${online ? profile.color : 'bg-gray-400'} bg-opacity-65 backdrop-blur-lg`}>
              <img
                alt="create-img"
                className="w-20 h-20 relative z-10 rounded-full object-cover bg-gradient-to-b from-slate-500 to-fuchsia-600"
                src={profile.avatar}
              />
              <div className="relative flex flex-col z-10 text-center">
                <h3 className="text-current text-2xl font-semibold tracking-wide truncate max-w-full overflow-hidden capitalize">
                  {profile.username}
                </h3>
                <p
                  className={`${online ? 'text-emerald-600 font-semibold' : 'text-slate-700'} group-hover:text-gray-700 font-semibold tracking-wide overflow-hidden`}>
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
