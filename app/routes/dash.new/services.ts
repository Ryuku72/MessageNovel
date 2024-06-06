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

  const url = new URL(request.url);
  const novel_id = await url.searchParams.get('novel_id');

  const user = await supabaseClient.auth.getUser();
  if (!user?.data?.user) redirect('/', { headers });
  try {
    if (title && description) {
      const userData = user.data.user;
      if (novel_id) {
        const libraryUpdate = await supabaseClient
          .from('library')
          .update({
            title,
            description: description,
            updated_at: new Date(),
            updated_by: userData?.id
          })
          .match({ id: novel_id })
          .select()
          .single();

        if (libraryUpdate.error) {
          console.error(libraryUpdate.error);
          console.error('error in dash new - library insert');
          return json({ error: { message: libraryUpdate.error.message } }, { headers });
        }
        return redirect('/dash', { headers });
      } else {
        const libraryInsert = await supabaseClient
          .from('library')
          .insert({
            owner: userData?.id,
            owner_username: userData?.user_metadata.username,
            title,
            description: description,
            members: [userData?.id]
          })
          .select()
          .single();

        if (libraryInsert.error) {
          console.error(libraryInsert.error);
          console.error('error in dash new - library insert');
          return json({ error: { message: libraryInsert.error.message } }, { headers });
        }

        return redirect(`/dash/${libraryInsert.data?.draft_id}`, { headers });
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

  try {
    const response = await supabaseClient.from('library').select('*').match({ id: novel_id }).select().maybeSingle();

    return json(response?.data, { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in dash new');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    return json(null, { headers });
  }
}
