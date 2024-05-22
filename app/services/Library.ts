import { SupabaseClientAndHeaderEntry, UserDataEntry } from './Auth';
import { json } from '@remix-run/node';

export type LoadLibraryEntry = {
  user: UserDataEntry;
} & SupabaseClientAndHeaderEntry;

export type ActionLibraryInsertEntry = {
  title: string;
  description: string;
} & LoadLibraryEntry;

export async function LoadLibrary({ user, supabaseClient, headers }: LoadLibraryEntry) {
  const library = await supabaseClient.from('library').select('*').match({ owner: user.id });
  return json({ library: library?.error || library?.data, user }, { headers });
}

export async function ActionLibraryInsert({
  user,
  title,
  description,
  supabaseClient,
  headers
}: ActionLibraryInsertEntry) {
  const update = await supabaseClient
    .from('library')
    .insert({
      owner: user.id,
      owner_username: user.username,
      title,
      description,
      members: [user.id]
    })
    .select();
  return { ...update, headers };
}
