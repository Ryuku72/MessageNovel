/* eslint-disable no-console */
import { ActionFunctionArgs, json } from '@remix-run/node';

import { initAuthServer } from '~/services/API';

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === 'POST') {
    const { supabaseClient, headers } = await initAuthServer(request);
    const data = await request.json();
    const avatar = data.old_record.avatar;

    const image = await supabaseClient.storage.from('avatars').remove([avatar]);
    if (image.error) {
      console.error(image.error);
      console.error('delete user update - image');
      throw image.error;
    }
    json(image, { headers });
  } else return null;
}
