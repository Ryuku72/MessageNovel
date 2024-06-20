/* eslint-disable no-console */
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { initServer } from '~/services/API';

export async function DashNewAction(data: ActionFunctionArgs) {
  const { request } = data;
  const { supabaseClient, headers } = await initServer(request);
  const body = await request.formData();
  const title = body.get('novel-title') as string;
  const description = body.get('novel-description') as string;
  const descriptionParse = JSON.parse(description);
  const url = new URL(request.url);
  const novel_id = await url.searchParams.get('novel_id');

  const user = await supabaseClient.auth.getUser();
  if (!user?.data?.user) redirect('/', { headers });
  try {
    if (title && description) {
      const userData = user.data.user;
      if (novel_id) {
        const novelUpdate = await supabaseClient
          .from('novels')
          .update({
            title,
            description: descriptionParse,
            updated_at: new Date()
          })
          .match({ id: novel_id })
          .select()
          .single();

        if (novelUpdate.error) {
          console.error(novelUpdate.error);
          console.error('error in dash new - novel insert');
          return json({ error: { message: novelUpdate.error.message } }, { headers });
        }
        return redirect('/dash', { headers });
      } else {
        const novelInsert = await supabaseClient
          .from('novels')
          .insert({
            owner: userData?.id,
            title,
            description: descriptionParse
          })
          .select()
          .single();

        if (novelInsert.error) {
          console.error(novelInsert.error);
          console.error('error in dash new - novel insert');
          return json({ error: { message: novelInsert.error.message } }, { headers });
        }

        return redirect(`/dash/novel/${novelInsert.data?.id}`, { headers });
      }
    } else return json({ error: 'Title and Description are requires' }, { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in dash new');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    return json(null, { headers });
  }
}

export async function DashNewLoader(data: LoaderFunctionArgs) {
  const { request } = data;
  const { supabaseClient, headers } = await initServer(request);
  const url = new URL(request.url);
  const novel_id = url.searchParams.get('novel_id');
  if (!novel_id) return json(null, { headers });
  try {
    const response = await supabaseClient.from('novels').select('*').match({ id: novel_id }).select().maybeSingle();
    if (response.error) throw response.error;
    return json(response?.data, { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in dash new');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    return json(null, { headers });
  }
}
