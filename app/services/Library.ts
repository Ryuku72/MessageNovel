import { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';

export type NovelinLibraryEntry = {
  id: string;
  created_at: string;
  updated_at: string;
  owner: string;
  title: string;
  description: string;
  members: string[];
  draft_id: string;
  published_id?: string;
  owner_username: string;
};

export type LoadLibraryEntry = { ownerId: string; supabaseClient: SupabaseClient };
export async function LoadLibrary({
  ownerId,
  supabaseClient
}: LoadLibraryEntry): Promise<PostgrestSingleResponse<NovelinLibraryEntry[]>> {
  return supabaseClient.from('library').select('*').match({ owner: ownerId });
}

export type  ActionInsertibraryEntry = { supabaseClient: SupabaseClient; userId: string; username: string; title: string; description: string; draft_id: string; };
export function ActionInsertibrary({ supabaseClient, userId, username, title, draft_id, description }: ActionInsertibraryEntry) {
  return supabaseClient
    .from('library')
    .insert({
      owner: userId,
      owner_username: username,
      title,
      draft_id,
      description,
      members: [userId]
    })
    .select()
    .maybeSingle();
}

export type ActionLibraryInsertEntry = {
  title: string;
  description: string;
  username: string;
  userId: string;
  supabaseClient: SupabaseClient;
};
export async function ActionDraftLibraryInsert({
  userId,
  title,
  supabaseClient
}: ActionLibraryInsertEntry): Promise<
  PostgrestSingleResponse<NovelinLibraryEntry | null>
> {
  return supabaseClient
    .from('novel_draft')
    .insert({
      updated_by: userId,
      body: {},
      title,
      members: [userId]
    })
    .select()
    .maybeSingle();
}

export type LoadNovelEntry = { novelId: string; supabaseClient: SupabaseClient;};
export async function LoadNovelinLibrary({ novelId, supabaseClient }: LoadNovelEntry): Promise<PostgrestSingleResponse<NovelinLibraryEntry[]>> {
  const novel = await supabaseClient.from('library').select('*').match({ id: novelId });
  return novel;
}
