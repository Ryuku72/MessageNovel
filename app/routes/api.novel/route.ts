/* eslint-disable no-console */
import { ActionFunctionArgs, json } from '@remix-run/node';

import { Liveblocks } from '@liveblocks/node';

import { initServer } from '~/services/API';

import { initialData } from './initial_state_binary';

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === 'POST') {
    const data = await request.json();
    console.dir({ data });
    const id = data.id;
    const { supabaseClient, headers, env } = await initServer(request);
    const userData = await supabaseClient.auth.getUser();
    const user = userData.data?.user;
    console.dir({ user });
    if (!user?.id) return null;
    const liveblocks = new Liveblocks({ secret: env.LIVEBLOCKS_SECRET_KEY });

    const room = await liveblocks.createRoom(id, {
      defaultAccesses: ['room:write']
    });
    try {
    await liveblocks.sendYjsBinaryUpdate(room.id, initialData);

    return json(room, { headers });
    } catch (err) {
        console.error(err);
        return json(err, { headers, status: 400 });
    }
  } else return null;
}
