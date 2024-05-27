import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { UserDataEntry } from '~/types';

import { initServer } from '~/services/API';

export async function SettingsAction(request: ActionFunctionArgs['request']) {
  const { supabaseClient, headers } = await initServer(request);
  const body = await request.formData();
  const type = body.get('type') as string;
  try {
    if (type === 'sign_out') {
      await supabaseClient.auth.signOut();
      return redirect('/', { headers });
    } else return json(null, { headers });
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

export async function SettingsLoader(request: LoaderFunctionArgs['request']) {
  const { supabaseClient, headers } = await initServer(request);
  try {
    const response = await supabaseClient.auth.getUser();
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
