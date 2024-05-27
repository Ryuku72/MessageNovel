import { ActionFunctionArgs, json } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { initServer } from '~/services/API';
import { ActionSignUpUser, ActionUpdateAuthUser, LoadAuthUser } from '~/services/Auth';
import { ActionProfileInsert } from '~/services/Profiles';
import { ActionCreateAvatar } from '~/services/Storage';

export default async function CreateAction(request: ActionFunctionArgs['request']) {
  const data = await request.formData();
  const email = data.get('create-email') as string;
  const password = data.get('create-password') as string;
  const avatar = data.get('avatar') as File;
  const username = data.get('username') as string;
  const color = data.get('color') as string;

  const filename = avatar?.name;
  const extension = avatar?.name.split('.').at(-1) || '';

  const { supabaseClient, headers } = await initServer(request);

  try {
    const authUser = await LoadAuthUser(supabaseClient);

    const userId = authUser.data.user?.id || '';
    const created_at = authUser.data.user?.created_at || new Date().toISOString();
    const updated_at = authUser.data.user?.updated_at || new Date().toISOString();

    if (!userId || (userId && authUser.data.user?.email !== email)) {
      const response = await ActionSignUpUser({ supabaseClient, email, password });
      if (response.error) return json({ error: { message: response.error.message } }, { headers });
      return json(response, { headers });
    } else {
      if (filename) await ActionCreateAvatar({ supabaseClient, userId, avatar, extension });
      await ActionUpdateAuthUser({ supabaseClient, userId, filename, extension, username, color });
      const response = await ActionProfileInsert({
        supabaseClient,
        userId,
        extension,
        email,
        created_at,
        updated_at,
        filename,
        username,
        color
      });
      if (response.error) return json({ error: { message: response.error.message } }, { headers });
      return json(response, { headers });
    }
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
