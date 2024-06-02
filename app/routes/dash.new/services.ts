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
  if (!user) redirect('/', { headers });
  try {
    if (title && description) {
      if (novel_id) {
        const userData = user.data.user;

        const libraryUpdate = await supabaseClient
          .from('library')
          .update({
            title,
            description: description,
            updated_at: new Date()
          })
          .match({ id: novel_id })
          .select()
          .maybeSingle();

        if (libraryUpdate.error) {
          console.error(libraryUpdate.error);
          console.error('error in dash new - library insert');
          return json({ error: { message: libraryUpdate.error.message } }, { headers });
        }

        const draftUpdate = await supabaseClient
        .from('novel_draft')
        .update({
          updated_by: userData?.id || '',
          updated_at: new Date(),
          title
        })
        .match({ id: libraryUpdate?.data?.draft_id })
        .select()
        .maybeSingle();

      if (draftUpdate.error) {
        console.error(draftUpdate.error);
        console.error('error in dash new - draft insert');
        return json({ error: { message: draftUpdate.error.message } }, { headers });
      }

        return redirect('/dash', { headers });
      }

      const userData = user.data.user;
      const draftInsert = await supabaseClient
        .from('novel_draft')
        .insert({
          updated_by: userData?.id || '',
          title,
          members: [userData?.id || '']
        })
        .select()
        .maybeSingle();

      if (draftInsert.error) {
        console.error(draftInsert.error);
        console.error('error in dash new - draft insert');
        return json({ error: { message: draftInsert.error.message } }, { headers });
      }

      const libraryInsert = await supabaseClient
        .from('library')
        .insert({
          owner: userData?.id || '',
          owner_username: userData?.user_metadata.username || '',
          title,
          draft_id: draftInsert.data?.id || '',
          description: description,
          members: [userData?.id || '']
        })
        .select()
        .maybeSingle();

      if (libraryInsert.error) {
        console.error(libraryInsert.error);
        console.error('error in dash new - library insert');
        return json({ error: { message: libraryInsert.error.message } }, { headers });
      }

      return redirect(`/dash/${libraryInsert.data?.draft_id}`, { headers });
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
