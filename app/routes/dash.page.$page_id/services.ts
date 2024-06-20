/* eslint-disable no-console */
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { initServer } from '~/services/API';

export async function DashPageIdLoader({ request, params }: LoaderFunctionArgs) {
  const { supabaseClient, headers } = await initServer(request);

  try {
    const response = await supabaseClient
      .from('pages')
      .select('*')
      .match({ id: params.page_id as string })
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

export async function DashPageIdAction({ request, params}: ActionFunctionArgs) {
  const formData = await request.formData();
  const body = formData.get('lexical') as string;
  const reference_title = formData.get('page-title');

  const { supabaseClient, headers } = await initServer(request);
  const user = await supabaseClient.auth.getUser();
  const userData = user.data?.user;
  if (!userData?.id) return null;
  const response = await supabaseClient
    .from('pages')
    .update({
      body: JSON.parse(body),
      reference_title,
      updated_at: new Date(),
      updated_by: userData?.id
    })
    .match({ id: params.page_id })
    .select()
    .single();

  return json(response?.data, { headers });
}