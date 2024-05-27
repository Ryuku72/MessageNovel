import { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';

import { envConfig } from './API';

export type ProfileEntry = {
  id: string;
  email: string;
  username: string;
  color: string;
  avatar: string;
  created_at: string;
  updated_at: string;
};

export type ActionProfileInsertEntry = {
  userId: string;
  extension: string;
  email: string;
  created_at: string;
  updated_at: string;
  filename: string;
  username: string;
  color: string;
  supabaseClient: SupabaseClient;
};

export async function ActionProfileInsert({
  supabaseClient,
  userId,
  extension,
  email,
  created_at,
  updated_at,
  filename,
  username,
  color
}: ActionProfileInsertEntry): Promise<
  PostgrestSingleResponse<ProfileEntry[]| null>
> {
  const env = envConfig();
  return supabaseClient
    .from('profiles')
    .insert({
      id: userId,
      email,
      created_at,
      updated_at,
      avatar: filename ? `${env.SUPABASE_IMG_STORAGE}/assets/${userId}/avatar.${extension}` : '',
      username,
      color
    })
    .select()
    .maybeSingle();
}
