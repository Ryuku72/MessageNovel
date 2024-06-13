/* eslint-disable no-console */
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { initServer } from '~/services/API';

export async function UserLoader(request: LoaderFunctionArgs['request']) {
  const { supabaseClient, headers } = await initServer(request);
  try {
    const response = await supabaseClient.from('profiles').select('*').order('updated_at', { ascending: false });
    if (response.error) throw response.error;
    await response.data.forEach(async user => {
      if (user.avatar) {
        const avatarImage = await supabaseClient.storage.from('avatars').getPublicUrl(user.avatar);
        user.avatar = avatarImage.data.publicUrl;
        return user;
      }
    });
    return json(response.data, { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in dash novel id');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    return redirect('/dash', { headers });
  }
}
