import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { json } from 'react-router';

import { initServer } from '~/services/API';
import { LoadAuthUser } from '~/services/Auth';

export default async function indexLoader(request: LoaderFunctionArgs['request']) {
  const { supabaseClient, headers } = await initServer(request);
  try {
    const response = await LoadAuthUser(supabaseClient);
    const user = response.data?.user;
    if (user?.id) return redirect('/dash', { headers });
    return null;
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
