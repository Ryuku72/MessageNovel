import { SupabaseClientAndHeaderEntry } from './API';

export type ActionCreateAvatarEntry = {
  userId: string;
  avatar: File;
  extension: string;
} & SupabaseClientAndHeaderEntry;
export async function ActionCreateAvatar({
  supabaseClient,
  headers,
  userId,
  avatar,
  extension
}: ActionCreateAvatarEntry): Promise<{ path: string }> {
  const image = await supabaseClient.storage.from('assets').upload(`/${userId}/avatar.${extension}`, avatar);
  if (image.error) {
    throw new Response(image.error.message, {
      status: 500,
      headers
    });
  }
  return image.data;
}
