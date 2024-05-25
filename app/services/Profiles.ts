import { SupabaseClientAndHeaderEntry, envConfig } from './API';

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
} & SupabaseClientAndHeaderEntry;
export async function ActionProfileInsert({
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
}: ActionProfileInsertEntry): Promise<ProfileEntry> {
  const env = envConfig();
  const profile = await supabaseClient
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
    .select();

  if (profile.error) {
    throw new Response(profile.error.message, {
      status: 500,
      headers
    });
  }
  return profile.data?.[0];
}
