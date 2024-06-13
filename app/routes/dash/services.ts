/* eslint-disable no-console */
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { UserDataEntry } from '~/types';

import { initServer } from '~/services/API';

export async function DashLoader(request: LoaderFunctionArgs['request']) {
  const { supabaseClient, headers, env } = await initServer(request);

  try {
    const response = await supabaseClient.auth.getUser();
    const user = response.data?.user;
    const avatarURL = user?.user_metadata?.avatar || '';
    if (!user) return redirect('/', { headers });

    const fetchAvatar = async () => {
      if (!avatarURL) return '';
      const avatarImage = await supabaseClient.storage.from('avatars').getPublicUrl(avatarURL);
      return avatarImage.data.publicUrl;
    };

    const userData: UserDataEntry = {
      avatar: await fetchAvatar(),
      id: user?.id || '',
      username: user?.user_metadata.username || 'Not Found',
      email: user?.email || 'Unknonwn',
      color: user?.user_metadata.color || '#aeaeae'
    };

    return json({ user: userData, env }, { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in dash');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    else return json(null, { headers });
  }
}
