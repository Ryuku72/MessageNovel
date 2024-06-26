/* eslint-disable no-console */
import { ActionFunctionArgs, json } from '@remix-run/node';

import { Liveblocks } from '@liveblocks/node';

import { envConfig } from '~/services/API';

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === 'POST') {
    const env = envConfig();
    const data = await request.json();
    const id = data.old_record.id;

    if (!id) return json('No page id attached', { status: 500 });
    try {
      const liveblocks = new Liveblocks({ secret: env.LIVEBLOCKS_SECRET_KEY });
      await liveblocks.deleteRoom(id);
      return json('success', { status: 200 });
    } catch (err) {
      console.error(err);
      return json('Error whilst attempting to delete a room', { status: 500 });
    }
  } else return null;
}
