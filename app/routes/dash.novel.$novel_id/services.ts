/* eslint-disable no-console */
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
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

export async function DashNovelIdAction(request: ActionFunctionArgs['request']) {
  const { supabaseClient, headers } = await initServer(request);
  const data = await request.formData();
  const page_id = data.get('selected_page');
  const response = await supabaseClient.auth.getUser();
  const user = response.data?.user;

  if (!user) return redirect('/', { headers });
  if (request.method === 'DELETE' && page_id) {
    try {
      const update = await supabaseClient.from('pages').delete().match({ id: page_id }).select();
      return json(update, { headers });
    } catch (error) {
      console.error(error);
      console.error('process error in dash');
      if (isRouteErrorResponse(error))
        return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
      else return json(null, { headers });
    }
  } else {
    const update = await supabaseClient
      .from('page_members')
      .insert({
        user_id: user.id,
        page_id
      })
      .select()
      .single();
    if (update.error) {
      console.error(update.error);
      console.error('process error in add member');
      return json(null, { headers });
    }

    return redirect('/dash/page/' + page_id, { headers });
  }
}
