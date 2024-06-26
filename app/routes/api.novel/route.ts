import { ActionFunctionArgs } from '@remix-run/node';

import { Liveblocks } from '@liveblocks/node';

import { initServer } from '~/services/API';

import { initialData } from './initial_state_binary';

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === 'POST' && request.body) {
    const body = await request.json();
    const { supabaseClient, headers, env } = await initServer(request);
    const userData = await supabaseClient.auth.getUser();
    const user = userData.data?.user;
    if (!user?.id) return null;
    const liveblocks = new Liveblocks({ secret: env.LIVEBLOCKS_SECRET_KEY });

    const room = await liveblocks.createRoom(body.id, {
        defaultAccesses: ['room:write']
    });

    await liveblocks.sendYjsBinaryUpdate(room.id, initialData);

    return new Response(body.id, { headers });
  } else return null;
}
