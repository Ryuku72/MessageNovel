import { ActionFunctionArgs, json } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { envConfig, initServer } from '~/services/API';

export async function CreateAction(request: ActionFunctionArgs['request']) {
  const env = envConfig();
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
    const authUser = await supabaseClient.auth.getUser();

    const userId = authUser.data.user?.id || '';
    const created_at = authUser.data.user?.created_at || new Date().toISOString();
    const updated_at = authUser.data.user?.updated_at || new Date().toISOString();

    if (!userId || (userId && authUser.data.user?.email !== email)) {
      const response = await supabaseClient.auth.signUp({ email, password });
      if (response.error) return json({ error: { message: response.error.message } }, { headers });
      return json(response, { headers });
    } else {
      if (filename) await supabaseClient.storage.from('assets').upload(`/${userId}/avatar.${extension}`, avatar);
      await supabaseClient.auth.updateUser({
        data: {
          avatar: filename ? `${env.SUPABASE_IMG_STORAGE}/assets/${userId}/avatar.${extension}` : '',
          username,
          color
        }
      });
      const response = await supabaseClient.from('profiles').insert({
        id: userId,
        email,
        created_at,
        updated_at,
        filename,
        username,
        color,
        avatar: filename ? `${env.SUPABASE_IMG_STORAGE}/assets/${userId}/avatar.${extension}` : ''
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
