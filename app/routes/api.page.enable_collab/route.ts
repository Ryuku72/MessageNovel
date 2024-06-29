/* eslint-disable no-console */
import { ActionFunctionArgs, json } from '@remix-run/node';

import { initServer } from '~/services/API';

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === 'POST') {
    const { supabaseClient, headers } = await initServer(request);
    const data = await request.formData();
    const enable_collab = data.get('enable_collab');
    const page_id = data.get('page_id');
    if (!page_id) return null;
    try {
      const response = await supabaseClient
        .from('pages')
        .update({ enable_collab })
        .match({ id: page_id })
        .select()
        .single();
      console.dir(response);
      if (response.error) throw response.error;
      return json(response.data, { headers });
    } catch (err) {
      console.error(err);
      throw new Error('No page id attached');
    }
  } else return null;
}
