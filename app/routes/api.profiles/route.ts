/* eslint-disable no-console */
import { ActionFunctionArgs, json } from '@remix-run/node';

// import { initAuthServer } from '~/services/API';

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === 'POST') {
    console.dir(request.body);
    return json('hello I am profile');
    // const { supabaseClient, headers } = await initAuthServer(request);
    // const userDetails = await supabaseClient.auth.getUser();
    // if (!userDetails.data.user?.id)  return json({ error: { message: 'user not authenticated' } }, { headers });
    // const image = await supabaseClient.storage.from('avatars').remove([userDetails.data.user.user_metadata.avatar]);
    // if (image.error) {
    //   console.error(image.error);
    //   console.error('delete user update - image');
    // }

    // const response = await supabaseClient.auth.admin.deleteUser(userDetails.data.user.id);
    // if (response.error) {
    //   console.error(response.error);
    //   console.error('delete user update');
    //   return json({ error: { message: response.error.message } }, { headers });
    // }

    // return json(response.data, { headers });
  }
}
