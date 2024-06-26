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
      .select(
        '*, owner:profiles!owner(color, username, avatar, id), members:novel_members(profiles!novel_members_user_id_fkey(color, username, avatar, id))'
      )
      .match({ id: novel_id })
      .single();
    if (novel.error) throw novel.error;
    const novelData = {
      ...novel.data,
      members: novel.data.members.map((member: { profiles: ProfileEntry }) => member.profiles) // Flatten the profiles data
    };

    const pages = await supabaseClient
      .from('pages')
      .select(
        '*, owner: profiles!owner(color, username, avatar, id), members: page_members(profiles!page_members_user_id_fkey(color, username, avatar, id))'
      )
      .match({ novel_id: novel_id })
      .order('created_at', { ascending: true });
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

export async function DashNovelIdAction({ request, params }: ActionFunctionArgs) {
  const { supabaseClient, headers } = await initServer(request);
  const data = await request.formData();
  const page_id = data.get('selected_page');
  const delete_page_id = data.get('page_id_delete');
  const page_index = data.get('page_index');
  const novel_owner = data.get('novel_owner');
  const updated_at = data.get('updated_at');
  const response = await supabaseClient.auth.getUser();
  const user = response.data?.user;
  const novel_id = params.novel_id;

  if (!user) return redirect('/', { headers });
  try {
    if (request.method === 'DELETE' && delete_page_id) {
      const update = await supabaseClient.from('pages').delete().match({ id: delete_page_id }).select();
      if (update.error) throw update.error;
      return json(update, { headers });
    } else if (request.method === 'POST' && page_id) {
      const update = await supabaseClient
        .from('page_members')
        .insert({
          user_id: user.id,
          page_id
        })
        .select()
        .single();
      if (update.error) throw update.error;
      return redirect('/dash/page/' + page_id, { headers });
    } else if (request.method === 'PUT') {
      const page_insert = await supabaseClient.from('pages').insert({
        novel_id,
        owner: novel_owner,
        reference_title: 'Page ' + page_index,
        updated_at
      })
      .select()
      .single();

      if (page_insert.error) throw page_insert.error;
      if (novel_owner !== user.id) {
        const update = await supabaseClient
        .from('page_members')
        .insert({
          user_id: user.id,
          page_id: page_insert.data.id
        })
        .select()
        .single();
      if (update.error) throw update.error;
      
      } 
      return json(page_insert, { headers });
    } else return json(null, { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in dash new');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    return json(null, { headers });
  }
}
