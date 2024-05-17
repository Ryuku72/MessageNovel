import { useEffect } from 'react';

import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { useLoaderData, useOutletContext, useSubmit } from '@remix-run/react';
import { User } from '@supabase/supabase-js';

import { initServer } from '~/helpers/supabase';

import { ToastAlert } from '~/components/ToastAlert';
import LOCALES from '~/locales/language_en.json';

import Default_Avatar from '~/assets/default_avatar.jpeg';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient, headers } = await initServer(request);
  const data = await supabaseClient.auth.getUser();
  if (data.data.user?.id) return json(data.data.user, { headers });
  else return redirect('/');
};
export async function action({ request }: ActionFunctionArgs) {
  const { supabaseClient, headers } = await initServer(request);
  const body = await request.formData();
  const type = body.get('type') as string;
  if (type === 'sign_out') {
    await supabaseClient.auth.signOut();
    return redirect('/', { headers });
  } else return json({}, { headers });
}

export type userData = {
  avatar: string;
  color: string;
  email: string;
  email_verified: boolean;
  phone_verified: boolean;
  sub: string;
  username: string;
};

export default function Dashboard() {
  const loaderData = useLoaderData() as User;
  const { sceneReady } = useOutletContext() as { sceneReady: boolean };
  const submit = useSubmit();

  useEffect(() => {
    if (!sceneReady) return;
    const sceneEvent = new CustomEvent('sceneUpdate', {
      detail: 4
    });
    window.dispatchEvent(sceneEvent);
  }, [sceneReady]);

  const user = {
    username: loaderData?.user_metadata?.username || 'Not Found',
    avatar:
      'https://zdqdkjjiqewmefxbfubj.supabase.co/storage/v1/object/public/' + loaderData?.user_metadata?.avatar ||
      Default_Avatar,
    email: loaderData?.email || 'Unknonwn',
    color: loaderData?.user_metadata?.color || '#aeaeae'
  };
  const LocalStrings = LOCALES.onboarding;

  const handleSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    const formData = new FormData();
    formData.append('type', 'sign_out');
    submit(formData, { method: 'post' });
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center absolute">
      <h1 className="text-gray-200 text-3xl m-0 font-medium font-mono text-center">User Profile</h1>
      <div className="p-4 w-card-l max-w-full">
        <div className="w-full flex justify-center items-center gap-3 flex-col rounded-lg shadow-xl px-12 py-8 bg-white">
          <div className="w-full flex flex-col justify-center items-center">
            <img alt="onboarding-img" className="w-32 h-32 rounded-full object-cover" src={user.avatar} />
          </div>
          <div className="w-full flex flex-col gap-3 font-mono">
            <p className="w-full text-gray-600">
              {LocalStrings.username}: {user.username}
            </p>
          </div>
          <div className="w-full flex flex-col gap-3 font-mono">
            <p className="w-full text-gray-600">
              {LocalStrings.email}: {user.email}
            </p>
          </div>
          <div className="w-full flex gap-3 font-mono">
            <p className="text-gray-600">{LocalStrings.color}: </p>
            <div className="h-5 w-5 rounded-lg" style={{ backgroundColor: user.color }} />
            <p className="text-gray-600">{user.color}</p>
          </div>
        </div>
      </div>
      <button
        className="rounded-lg h-10 px-4 text-gray-100 bg-blue-500 hover:bg-green-500 flex items-center justify-center"
        onClick={handleSubmit}>
        Sign out
      </button>
      <ToastAlert />
    </div>
  );
}
