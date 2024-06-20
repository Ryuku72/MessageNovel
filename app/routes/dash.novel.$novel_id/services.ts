/* eslint-disable no-console */
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { initServer } from '~/services/API';
import { ProfileEntry } from '~/types';

export async function DashNovelIdLoader(data: LoaderFunctionArgs) {
  const { request, params } = data;
  const { supabaseClient, headers } = await initServer(request);
  const novel_id = params.novel_id;

  try {
    const novel = await supabaseClient
    .from('novels')
    .select('*, owner:profiles!owner(color, username, avatar, id), members:novel_members(profiles!novel_members_user_id_fkey(color, username, avatar, id))')
    .match({ id: novel_id }).single(); 
    if (novel.error) throw novel.error;
    const novelData = {
      ...novel.data,
      members: novel.data.members.map((member: { profiles: ProfileEntry }) => member.profiles) // Flatten the profiles data
    };

    const pages = await supabaseClient.from('pages').select('*, owner: profiles!owner(color, username, avatar, id), members: page_members(profiles!page_members_user_id_fkey(color, username, avatar, id))').match({ novel_id: novel_id });
    if (pages.error) throw pages.error;

    const pagesData = pages.data.map(page => ({
      ...page,
      members: page.members.map((member: { profiles: ProfileEntry }) => member.profiles) // Flatten the profiles data
    }));
    return json({ novel: novelData, pages: pagesData }, { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in dash new');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    return json(null, { headers });
  }
}
