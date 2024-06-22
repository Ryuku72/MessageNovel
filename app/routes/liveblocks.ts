import { ActionFunctionArgs } from '@remix-run/node';

import { Liveblocks } from '@liveblocks/node';

import { initServer } from '~/services/API';

export async function action({ request }: ActionFunctionArgs) {
  const { supabaseClient, headers, env } = await initServer(request);
  const userData = await supabaseClient.auth.getUser();
  const user = userData.data?.user;
  if (!user?.id) return null;
  const avatarURL = user?.user_metadata?.avatar || '';
  const liveblocks = new Liveblocks({ secret: env.LIVEBLOCKS_SECRET_KEY });

  const userColor = (color: string) => {
    switch (color) {
      case 'bg-pastel-black':
        return '211, 211, 211';
      case 'bg-pastel-red':
        return '255, 153, 153';
      case 'bg-pastel-brown':
        return '255, 204, 204';
      case 'bg-pastel-orange':
        return '255, 218, 185';
      case 'bg-pastel-indigo':
        return '153, 204, 255';
      case 'bg-pastel-blue':
        return '218, 240, 247';
      case 'bg-pastel-green':
        return '178, 223, 219';
      case 'bg-pastel-emerald':
        return '204, 255, 204';
      case 'bg-pastel-purple':
        return '204, 204, 255';
      default:
        return '255, 255, 204';
    }
  };

  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      avatar: avatarURL ? env.SUPABASE_IMG_STORAGE + 'public/avatars/' + avatarURL : null,
      name: user?.user_metadata.username,
      color: `rgb(${userColor(user?.user_metadata.color)})` || '#aeaeae'
    }
  });
  const { room } = await request.json();
  session.allow(room, session.FULL_ACCESS);

  
  // Authorize the user and return the result
  const { body, status } = await session.authorize();

  return new Response(body, { headers, status });
}
