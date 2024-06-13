/* eslint-disable no-console */
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { initServer } from '~/services/API';

export async function DashIndexLoader(request: LoaderFunctionArgs['request']) {
  const { supabaseClient, headers } = await initServer(request);

  try {
    const response = await supabaseClient.auth.getUser();
    const user = response.data?.user;
    if (!user) return redirect('/', { headers });

    const library = await supabaseClient.from('library').select('*').order('updated_at', { ascending: false });
    return json(library?.data, { headers });
  } catch (error) {
    console.error(error);
    console.error('process error in dash');
    if (isRouteErrorResponse(error))
      return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
    else return json(null, { headers });
  }
}

export async function DashIndexAction(request: ActionFunctionArgs['request']) {
  const { supabaseClient, headers } = await initServer(request);
  const data = await request.formData();
  const novel_id = data.get('selected_novel');
  const response = await supabaseClient.auth.getUser();
  const user = response.data?.user;

  if (!user) return redirect('/', { headers });
  if (request.method === 'DELETE' && novel_id) {
    try {
      const update = await supabaseClient.from('library').delete().match({ id: novel_id }).select();
      return json(update, { headers });
    } catch (error) {
      console.error(error);
      console.error('process error in dash');
      if (isRouteErrorResponse(error))
        return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
      else return json(null, { headers });
    }
  } else {
    const members = data.get('members') as string;
    const membersData = members.split(',');

    const update = await supabaseClient.from('library').update({
      members: membersData
    }).match({ id: novel_id }).select().single();
    if (update.error) {
      console.error(update.error);
      console.error('process error in add member');
      return json(null, { headers });
    }

    return redirect('/dash/' + update.data.draft_id, { headers });
  }
}
