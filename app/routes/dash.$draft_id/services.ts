/* eslint-disable no-console */
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { initServer } from '~/services/API';

export async function DashNovelIdLoader({ request, params }: LoaderFunctionArgs) {
  const { supabaseClient, headers } = await initServer(request);

  try {
    const response = await supabaseClient
      .from('novel_draft')
      .select('*')
      .match({ id: params.draft_id as string })
      .maybeSingle();

    if (!response.data) redirect('/dash', { headers });
    return json(response?.data, { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in dash novel id');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    return json(null, { headers });
  }
}

export async function DashNovelIdAction({ request, params}: ActionFunctionArgs) {
  const formData = await request.formData();
  const body = formData.get('lexical');
  const title = formData.get('novel-title');

  const { supabaseClient, headers } = await initServer(request);
  const user = await supabaseClient.auth.getUser();
  const userData = user.data?.user;
  if (!userData?.id) return null;

  const response = await supabaseClient
    .from('novel_draft')
    .update({
      body,
      title,
      updated_by: userData?.id
    })
    .match({ id: params.draft_id })
    .select()
    .maybeSingle();

  return json(response?.data, { headers });
}