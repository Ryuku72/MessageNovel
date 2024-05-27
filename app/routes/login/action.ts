import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { initServer } from '~/services/API';
import { LoginAuthUser } from '~/services/Auth';

export default async function LoginAction(request: ActionFunctionArgs['request']) {
  const { supabaseClient, headers } = await initServer(request);
  const body = await request.formData();
  const email = body.get('user-email') as string;
  const password = body.get('user-password') as string;
  try {
    const response = await LoginAuthUser({ supabaseClient, email, password });
    if (response.error) return json({ error: { message: response.error?.message } }, { headers });
    return redirect('/dash', { headers });
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
