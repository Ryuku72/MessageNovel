import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { UserDataEntry } from '~/types';

import { initServer } from '~/services/API';

export async function DashAction(request: ActionFunctionArgs['request']) {
  const { supabaseClient, headers } = await initServer(request);
  const body = await request.formData();
  const type = body.get('type') as string;

  try {
    if (type === 'sign_out') {
      await supabaseClient.auth.signOut();
      return redirect('/', { headers });
    }

    return json(null, { headers });
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

export async function DashLoader(request: LoaderFunctionArgs['request']) {
  const { supabaseClient, headers } = await initServer(request);

  try {
    const response = await supabaseClient.auth.getUser();
    const user = response.data?.user;
    if (!user) return redirect('/', { headers });

    const library = await supabaseClient.from('library').select('*').match({ owner: user.id });
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
