import { SupabaseClientAndHeaderEntry } from './API';

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

export type LoadLibraryEntry = {
  ownerId: string;
} & SupabaseClientAndHeaderEntry;
export async function LoadLibrary({ ownerId, supabaseClient, headers }: LoadLibraryEntry): Promise<NovelinLibraryEntry[]>  {
  const library = await supabaseClient.from('library').select('*').match({ owner: ownerId });
  if (library.error) {
    throw new Response(library.error.message, {
      status: 500,
      headers
    });
  }
  return library.data;
}


export type ActionLibraryInsertEntry = {
  title: string;
  description: string;
  username: string;
  userId: string;
} &  SupabaseClientAndHeaderEntry;
export async function ActionLibraryInsert({
  userId,
  username,
  title,
  description,
  supabaseClient,
  headers
}: ActionLibraryInsertEntry): Promise<NovelinLibraryEntry> {
  const draftNovel = await supabaseClient
    .from('novel_draft')
    .insert({
     updated_by: userId,
     body: {},
     title,
     members: [userId]
    })
    .select();

  if (draftNovel.error) {
    throw new Response(draftNovel.error.message, {
      status: 500,
      headers
    });
  }

  const update = await supabaseClient
    .from('library')
    .insert({
      owner: userId,
      owner_username: username,
      title,
      draft_id: draftNovel.data?.[0]?.id,
      description,
      members: [userId]
    })
    .select();

    if (update.error) {
      throw new Response(update.error.message, {
        status: 500,
        headers
      });
    }

  return update.data?.[0];
}

export type LoadNovelEntry = {
  novelId: string;
} & SupabaseClientAndHeaderEntry;
export async function LoadNovelinLibrary({ novelId, supabaseClient, headers }: LoadNovelEntry): Promise<NovelinLibraryEntry> {
  const novel = await supabaseClient.from('library').select('*').match({ id: novelId });
  if (novel.error) {
    throw new Response(novel.error.message, {
      status: 500,
      headers
    });
  }
  return novel.data?.[0];
}
