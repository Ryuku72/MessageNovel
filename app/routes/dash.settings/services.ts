/* eslint-disable no-console */
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

import { initAuthServer, initServer } from '~/services/API';
import { AuthProfileEntry, UserDataEntry } from '~/types';

export async function SettingsAction(request: ActionFunctionArgs['request']) {
  const data = await request.formData();
  const avatar = data.get('avatar') as File;
  const username = data.get('username') as string;
  const color = data.get('color') as string;

  const filename = avatar?.name;
  const imageFilePath = `public/${new Date().valueOf()}_${filename}`;

  if (request.method === 'DELETE') {
    // To delete you need a different auth token
    const { supabaseClient, headers } = await initAuthServer(request);
    const userDetails = await supabaseClient.auth.getUser();
    if (!userDetails.data.user?.id) return redirect('/', { headers });

    const image = await supabaseClient.storage.from('avatars').remove([userDetails.data.user.user_metadata.avatar]);
    if (image.error) {
      console.error(image.error);
      console.error('delete user update - image');
    }

    const response = await supabaseClient.auth.admin.deleteUser(userDetails.data.user.id);
    if (response.error) {
      console.error(response.error);
      console.error('delete user update');
      return json({ error: { message: response.error.message } }, { headers });
    }
    return redirect('/', { headers });
  } else {
    const { supabaseClient, headers } = await initServer(request);

    try {
      const userDetails = await supabaseClient.auth.getUser();
      if (!userDetails.data.user?.id) return redirect('/', { headers });
      if (filename) {
        if (userDetails.data.user?.user_metadata.avatar) {
          const image = await supabaseClient.storage
            .from('avatars')
            .remove([userDetails.data.user.user_metadata.avatar]);
          if (image.error) {
            console.error(image.error);
            console.error('image storage update');
            return json({ error: { message: image.error.message } }, { headers });
          }
        }
        const image = await supabaseClient.storage.from('avatars').upload(imageFilePath, avatar);
        if (image.error) {
          console.error(image.error);
          console.error('image storage insert');
          return json({ error: { message: image.error.message } }, { headers });
        }
      }

      const dataUpdate: { username: string; color: string; avatar?: string } = { username, color };
      if (filename) dataUpdate.avatar = imageFilePath;
      const response = await supabaseClient.auth.updateUser({ data: dataUpdate });

      if (response.error) {
        console.error('update user');
        console.error(response.error);
        return json({ error: { message: response.error.message } }, { headers });
      }

      const user = response.data.user as AuthProfileEntry;

      const fetchAvatar = async () => {
        const avatarURL = user?.user_metadata?.avatar || '';
        if (!avatarURL) return '';
        const avatarImage = await supabaseClient.storage.from('avatars').getPublicUrl(avatarURL);
        return avatarImage.data.publicUrl;
      };

      const userData: UserDataEntry = {
        avatar: await fetchAvatar(),
        id: user?.id || '',
        username: user?.user_metadata.username || 'Not Found',
        email: user?.email || 'Unknonwn',
        color: user?.user_metadata.color || '#aeaeae'
      };

      return json(userData, { headers });
    } catch (error) {
      console.error(error);
      console.error('process error in settings');
      if (isRouteErrorResponse(error))
        return new Response(`${error.status} - ${error?.statusText || 'Error'}`, { status: error.status, headers });
      return json(null, { headers });
    }
  }
}
