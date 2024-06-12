/* eslint-disable no-console */
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { initServer } from '~/services/API';

export async function DashNovelIdLoader({ request, params }: LoaderFunctionArgs) {
  const { supabaseClient, headers } = await initServer(request);

  try {
    const response = await supabaseClient
      .from('draft_novel')
      .select('*')
      .match({ id: params.draft_id as string })
      .single();

    if (response.error) throw response.error;
    return json(response.data, { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in dash novel id');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    return  redirect('/dash', { headers });
  }
}

export async function DashNovelIdAction({ request, params}: ActionFunctionArgs) {
  const formData = await request.formData();
  const body = formData.get('lexical') as string;
  const title = formData.get('novel-title');

  const { supabaseClient, headers } = await initServer(request);
  const user = await supabaseClient.auth.getUser();
  const userData = user.data?.user;
  if (!userData?.id) return null;
  const response = await supabaseClient
    .from('draft_novel')
    .update({
      body: JSON.parse(body),
      title,
      updated_at: new Date(),
      updated_by: userData?.id
    })
    .match({ id: params.draft_id })
    .select()
    .single();

  await supabaseClient.from('library').update({ title, updated_at: new Date() }).match({ draft_id: params.draft_id });

  return json(response?.data, { headers });
}