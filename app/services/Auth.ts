import { ActionFunctionArgs, json, redirect, TypedResponse } from '@remix-run/node';
import { SupabaseClient, User, UserResponse } from '@supabase/supabase-js';

import { envConfig, initServer } from '~/helpers/supabase';

import Default_Avatar from '~/assets/default_avatar.jpeg';

export type UserParamsBaseEntry = {
  username: string;
  email: string;
  color: string;
};

export type UserParamsEntry = UserParamsBaseEntry & {
  avatar: File;
  password: string;
};

export type UserDataEntry = UserParamsBaseEntry & {
  avatar: string;
  id: string;
};

export type SupabaseClientAndHeaderEntry = {
  supabaseClient: SupabaseClient;
  headers: Headers;
};

export type LoginAuthUserEntry = {
    request: ActionFunctionArgs['request'];
    body: { email: string; password: string };
}

export type ActionAuthUserEntry = { request: ActionFunctionArgs['request']; body: UserParamsEntry };
export type ActionSignUpUserEntry = { supabase: SupabaseClientAndHeaderEntry; body: UserParamsEntry };
export type ActionCreateProfileEntry = ActionSignUpUserEntry & { userData: UserResponse };

export async function LoginAuthUser({ request, body }: LoginAuthUserEntry){
  const { supabaseClient, headers } = await initServer(request);
  const init = await supabaseClient.auth.signInWithPassword({
    email: body.email,
    password: body.password
  });
  if (init.error) return json(init, { headers });
  else return redirect('/dash', { headers });
}

export async function LoadAuthUser({ supabaseClient, headers }: SupabaseClientAndHeaderEntry): Promise<TypedResponse<UserDataEntry>> {
  const data = await supabaseClient.auth.getUser();
  if (data.data.user?.id) {
    const loaderData = data.data.user as User;
    const user: UserDataEntry = {
      id: loaderData?.id,
      username: loaderData?.user_metadata?.username || 'Not Found',
      avatar: loaderData?.user_metadata?.avatar || Default_Avatar,
      email: loaderData?.email || 'Unknonwn',
      color: loaderData?.user_metadata?.color || '#aeaeae'
    };
    return json(user, { headers });
  } else return redirect('/', { headers });
}

export async function ActionAuthUser({ request, body }: ActionAuthUserEntry) {
  const supabase = await initServer(request);
  const userData = await supabase.supabaseClient?.auth?.getUser();

  if (!userData?.data.user || userData?.data.user.email !== body.email) return ActionSignUpUser({ supabase, body });
  else return ActionCreateProfile({ supabase, userData, body });
}

export async function ActionSignUpUser({ supabase, body }: ActionSignUpUserEntry) {
  const { supabaseClient, headers } = supabase;
  const auth = await supabaseClient.auth.signUp({
    email: body.email,
    password: body.password
  });

  if (auth.error) return json(auth, { headers });
  return json({ success: false }, { headers });
}

export async function ActionCreateProfile({ supabase, userData, body }: ActionCreateProfileEntry) {
  const env = envConfig();
  const { supabaseClient, headers } = supabase;
  const { avatar, email, username, color } = body;
  const filename = avatar.name;

  const extension = body.avatar.name.split('.').at(-1);
  if (filename) {
    const image = await supabaseClient.storage
      .from('assets')
      .upload(`/${userData.data.user?.id}/avatar.${extension}`, avatar);
    if (image.error) return json(image, { headers });
  }

  const update = await supabaseClient.auth.updateUser({
    data: {
      avatar: filename ? `${env.SUPABASE_IMG_STORAGE}/assets/${userData.data.user?.id}/avatar.${extension}` : '',
      username,
      color
    }
  });
  if (update.error) return json(update, { headers });

  const profile = await supabaseClient
    .from('profiles')
    .insert({
      id: userData.data.user?.id,
      email,
      created_at: userData.data.user?.created_at,
      updated_at: userData.data.user?.updated_at,
      avatar: filename ? `${env.SUPABASE_IMG_STORAGE}/assets/${userData.data.user?.id}/avatar.${extension}` : '',
      username,
      color
    })
    .select();
  if (profile.error) return json(profile, { headers });
  return json({ success: true }, { headers });
}
