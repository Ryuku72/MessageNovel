/* eslint-disable no-console */
import { ActionFunctionArgs, json } from '@remix-run/node';

import { Liveblocks } from '@liveblocks/node';

import { envConfig } from '~/services/API';

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method === 'DELETE') {
    const env = envConfig();
    const id = params.novel_id as string;

    if (!id) throw new Error('No page id attached');
    try {
      const liveblocks = new Liveblocks({ secret: env.LIVEBLOCKS_SECRET_KEY });
      await liveblocks.deleteRoom(id);
      return json('success');
    } catch (err) {
      console.error(err);
      throw new Error('Error whilst attempting to delete a room');
    }
  } else return null;
}
