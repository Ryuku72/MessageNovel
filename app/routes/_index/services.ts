/* eslint-disable no-console */
import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { json } from 'react-router';

import { initServer } from '~/services/API';

export async function indexLoader(request: LoaderFunctionArgs['request']) {
  const { supabaseClient, headers } = await initServer(request);
  try {
    const response = await supabaseClient.auth.getUser();
    const user = response.data?.user;
    if (user?.id) return redirect('/dash', { headers });
    return null;
  } catch (error) {
    console.error(error);
    console.error('process error in index');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    return json(null, { headers });
  }
}
