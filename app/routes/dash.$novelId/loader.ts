import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { initServer } from '~/services/API';
import { LoadNovelinLibrary } from '~/services/Library';

export default async function DashNovelIdLoader({ request, params }: LoaderFunctionArgs) {
  if (!params.novelId) return;
  const { supabaseClient, headers } = await initServer(request);
  try {
    const response = await LoadNovelinLibrary({ novelId: params.novelId as string, supabaseClient });
    if (!response.data) redirect('/dash', { headers });
    return json(response, { headers });
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
