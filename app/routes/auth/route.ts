/* eslint-disable no-console */
import { json, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { initServer } from '~/services/API';

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabaseClient, headers } = await initServer(request);
  const authUser = await supabaseClient.auth.getUser();
  const url = new URL(request.url);
  const intent = url.searchParams.get('intent');
  try {
  switch (intent) {
    case 'signout': {
      await supabaseClient.auth.signOut();
      return redirect('/', { headers });
    }
    default: {
      if (authUser.data.user?.id) return redirect('/dash', { headers });
      return redirect('/', { headers });
    }
  }
  } catch (error) {
    console.error(error);
    console.error('process error in dash');

    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    else return json(null, { headers });
  }
}
