/* eslint-disable no-console */
import { ActionFunctionArgs, json } from '@remix-run/node';

import { Liveblocks } from '@liveblocks/node';

import { envConfig } from '~/services/API';

import { initialData } from './initial_state_binary';

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === 'POST') {
    const env = envConfig();
    const data = await request.json();
    const id = data.record.id;
    if (!id) throw new Error('No page id attached');
    try {
      const liveblocks = new Liveblocks({ secret: env.LIVEBLOCKS_SECRET_KEY });
      const room = await liveblocks.createRoom(id, {  defaultAccesses: ['room:write'] });
      await liveblocks.sendYjsBinaryUpdate(room.id, initialData);
      return json(room);
    } catch (err) {
      console.error(err);
      throw new Error('No page id attached');
    }
  } else return null;
}
