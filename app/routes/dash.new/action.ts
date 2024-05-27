import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { initServer } from '~/services/API';
import { LoadAuthUser } from '~/services/Auth';
import { ActionDraftLibraryInsert, ActionInsertibrary } from '~/services/Library';

export default async function DashNewAction(request: ActionFunctionArgs['request']) {
  const { supabaseClient, headers } = await initServer(request);
  const body = await request.formData();
  const title = body.get('novel-title') as string;
  const description = body.get('novel-description') as string;

  const user = await LoadAuthUser(supabaseClient);
  if (!user) redirect('/', { headers });
  try {
    if (title && description) {
      const userData = user.data.user;
      const draftInsert = await ActionDraftLibraryInsert({
        supabaseClient,
        userId: userData?.id || '',
        username: userData?.user_metadata.username || '',
        title,
        description
      });
      if (draftInsert.error) return json({ error: { message: draftInsert.error.message } }, { headers });
      const libraryInsert = await ActionInsertibrary({
        supabaseClient,
        userId: userData?.id || '',
        username: userData?.user_metadata.username || '',
        title,
        draft_id: draftInsert.data?.id || '',
        description: description
      });

      return redirect(`/dash/${libraryInsert.data?.id}`, { headers });
    } else return json({ error: 'Title and Description are requires' }, { headers });
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
