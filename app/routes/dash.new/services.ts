/* eslint-disable no-console */
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { initServer } from '~/services/API';

export async function DashNewAction(request: ActionFunctionArgs['request']) {
  const { supabaseClient, headers } = await initServer(request);
  const body = await request.formData();
  const title = body.get('novel-title') as string;
  const description = body.get('novel-description') as string;

  const user = await supabaseClient.auth.getUser();
  if (!user) redirect('/', { headers });
  try {
    if (title && description) {
      const userData = user.data.user;
      const draftInsert = await supabaseClient
        .from('novel_draft')
        .insert({
          updated_by: userData?.id || '',
          body: {},
          title,
          members: [userData?.id || '']
        })
        .select()
        .maybeSingle();

      if (draftInsert.error) {
        console.error(draftInsert.error);
        console.error('error in dash new');
        return json({ error: { message: draftInsert.error.message } }, { headers });
      }
      const libraryInsert = await supabaseClient
        .from('library')
        .insert({
          owner: userData?.id || '',
          username: userData?.user_metadata.username || '',
          title,
          draft_id: draftInsert.data?.id || '',
          description: description,
          members: [userData?.id || '']
        })
        .select()
        .maybeSingle();

      return redirect(`/dash/${libraryInsert.data?.id}`, { headers });
    } else return json({ error: 'Title and Description are requires' }, { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in dash new');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    return json(null, { headers });
  }
}
