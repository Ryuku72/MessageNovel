import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { initServer } from '~/services/API';
import { LoadAuthUser } from '~/services/Auth';
import { LoadLibrary } from '~/services/Library';

import { UserDataEntry } from './type';

export default async function DashLoader(request: LoaderFunctionArgs['request']) {
  const { supabaseClient, headers } = await initServer(request);

  try {
    const response = await LoadAuthUser(supabaseClient);
    const user = response.data?.user;
    if (!user) return redirect('/', { headers });

    const library = await LoadLibrary({ supabaseClient, ownerId: user?.id || '' });
    const userData: UserDataEntry = {
      avatar: user?.user_metadata.avatar,
      id: user?.id || '',
      username: user?.user_metadata.username || 'Not Found',
      email: user?.email || 'Unknonwn',
      color: user?.user_metadata.color || '#aeaeae'
    };

    return json({ library: library?.data, user: userData }, { headers });
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
