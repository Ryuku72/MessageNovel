/* eslint-disable no-console */
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
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
  const extension = filename?.split('.').at(-1) || '';

  const { supabaseClient, headers } = await initServer(request);

  try {
    const authUser = await supabaseClient.auth.getUser();

    const userId = authUser.data.user?.id || '';
    const created_at = authUser.data.user?.created_at || new Date().toISOString();
    const updated_at = authUser.data.user?.updated_at || new Date().toISOString();

    if (!userId || (userId && authUser.data.user?.email !== email)) {
      const response = await supabaseClient.auth.signUp({ email, password });
      if (response.error) {
        console.error(response.error);
        return json({ error: { message: response.error.message } }, { headers });
      }
      return json({ ...response, success: false }, { headers });
    } else {
      if (filename) {
        const image = await supabaseClient.storage.from('assets').upload(`/${userId}/avatar.${extension}`, avatar);
        if (image.error) {
          console.error(image.error);
          console.error('image storage');
          return json({ error: { message: image.error.message } }, { headers });
        }
      }
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
        username,
        color,
        created_at,
        updated_at,
        avatar: filename ? `${env.SUPABASE_IMG_STORAGE}/assets/${userId}/avatar.${extension}` : ''
      });
      if (response.error) {
        console.error(response.error);
        console.error('profile insert error');
        return json({ error: { message: response.error.message } }, { headers });
      }
      return redirect('/dash', { headers });
    }
  } catch (error) {
    console.error(error);
    console.error('process error in create');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    return json(null, { headers });
  }
}
