import { SupabaseClient } from '@supabase/supabase-js';

export type ActionCreateAvatarEntry = {
  userId: string;
  avatar: File;
  extension: string;
  supabaseClient: SupabaseClient;
};
export function ActionCreateAvatar({
  supabaseClient,
  userId,
  avatar,
  extension
}: ActionCreateAvatarEntry) {
  return supabaseClient.storage.from('assets').upload(`/${userId}/avatar.${extension}`, avatar);
}
