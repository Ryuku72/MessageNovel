import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { initServer } from '~/services/API';
import { LoadAuthUser } from '~/services/Auth';

import { UserDataEntry } from '../dash/type';

export default async function SettingsLoader(request: LoaderFunctionArgs['request']) {
  const { supabaseClient, headers } = await initServer(request);
  try {
    const response = await LoadAuthUser(supabaseClient);
    const user = response.data?.user;
    if (user?.id) {
      const data: UserDataEntry = {
        id: user.id,
        username: user?.user_metadata?.username || 'Not Found',
        avatar: user?.user_metadata?.avatar,
        email: user?.email || 'Unknonwn',
        color: user?.user_metadata?.color || '#aeaeae'
      };
      return json(data, { headers });
    } else return redirect('/', { headers });
  } catch (error) {
    if (isRouteErrorResponse(error)) {
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    } else {
      // eslint-disable-next-line no-console
      console.error(error);
      return json(null, { headers });
    }
  }
}
