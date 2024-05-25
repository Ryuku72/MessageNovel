import { AuthResponse, AuthTokenResponsePassword, User, UserResponse } from '@supabase/supabase-js';

import { SupabaseClientAndHeaderEntry, envConfig } from '~/services/API';

import { ActionProfileInsert } from './Profiles';
import { ActionCreateAvatar } from './Storage';

export type LoginAuthUserEntry = {
  email: string;
  password: string;
} & SupabaseClientAndHeaderEntry;
export async function LoginAuthUser({
  supabaseClient,
  headers,
  email,
  password
}: LoginAuthUserEntry): Promise<AuthTokenResponsePassword['data']> {
  const init = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (init.error) {
    throw new Response(init.error.message, {
      status: 500,
      headers
    });
  }

  return init.data;
}

export async function LoadAuthUser({ supabaseClient, headers }: SupabaseClientAndHeaderEntry): Promise<User> {
  const data = await supabaseClient.auth.getUser();

  if (data.error) {
    throw new Response(data.error.message, {
      status: 500,
      headers
    });
  }

  return data.data.user;
}

export type ActionSignUpUserEntry = { email: string; password: string } & SupabaseClientAndHeaderEntry;
export async function ActionSignUpUser({
  supabaseClient,
  headers,
  email,
  password
}: ActionSignUpUserEntry): Promise<AuthResponse['data']> {
  const data = await supabaseClient.auth.signUp({ email, password });

  if (data.error) {
    throw new Response(data.error.message, {
      status: 500,
      headers
    });
  }

  return data.data;
}

export type ActionUpdateUserEntry = {
  filename: string;
  userId: string;
  extension: string;
  username: string;
  color: string;
} & SupabaseClientAndHeaderEntry;

export async function ActionUpdateAuthUser({
  supabaseClient,
  headers,
  filename,
  userId,
  extension,
  username,
  color
}: ActionUpdateUserEntry): Promise<UserResponse> {
  const env = envConfig();
  const update = await supabaseClient.auth.updateUser({
    data: {
      avatar: filename ? `${env.SUPABASE_IMG_STORAGE}/assets/${userId}/avatar.${extension}` : '',
      username,
      color
    }
  });
  if (update.error) {
    throw new Response(update.error.message, {
      status: 500,
      headers
    });
  }
  return update;
}

export type ProfileBodyEntry = { avatar: File; email: string; username: string; color: string };
export type ActionCreateProfileEntry = {
  userId: string;
  created_at: string;
  updated_at: string;
  body: ProfileBodyEntry;
} & SupabaseClientAndHeaderEntry;

export async function ActionCreateProfile({
  supabaseClient,
  headers,
  userId,
  created_at,
  updated_at,
  body
}: ActionCreateProfileEntry) {
  const { avatar, email, username, color } = body;
  const filename = avatar.name;
  const extension = avatar.name.split('.').at(-1) || '';

  if (filename) ActionCreateAvatar({ supabaseClient, headers, userId, avatar, extension });
  ActionUpdateAuthUser({ supabaseClient, headers, filename, userId, extension, username, color });
  return ActionProfileInsert({
    supabaseClient,
    headers,
    userId,
    extension,
    email,
    created_at,
    updated_at,
    filename,
    username,
    color
  });
}

export async function ActionSignOut({
  supabaseClient,
  headers
}: SupabaseClientAndHeaderEntry): Promise<{ success: true }> {
  const signOut = await supabaseClient.auth.signOut();
  if (signOut.error) {
    throw new Response(signOut.error.message, {
      status: 500,
      headers
    });
  }
  return { success: true };
}
