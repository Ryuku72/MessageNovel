# Welcome to Message Novel

Message Novel an open source Remix React project built with Vite and a Supabase Backend. 

To try out the website please visit [Message Novel](https://messagenovel.vercel.app/) by clicking the link


## Supabase Database Setup

To set up tables and storage in Supabase please copy and paste the following commands into the SQL Editor.

### Public Profile

```sh
DROP TABLE IF EXISTS public.profiles cascade;

CREATE TABLE
  public.profiles (
    id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    email text,
    username text,
    color text,
    avatar text,
    created_at timestamp DEFAULT current_timestamp,
    updated_at timestamp DEFAULT current_timestamp,
    PRIMARY KEY (id)
  );

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can only view own profile data." ON public.profiles FOR
SELECT
  USING (auth.uid () = id);

CREATE POLICY "Can only update own profile data." ON public.profiles
FOR UPDATE
  USING (auth.uid () = id);

CREATE POLICY "Can only delete own profile data." ON public.profiles FOR DELETE USING (auth.uid () = id);

CREATE
OR REPLACE FUNCTION public.create_profile () RETURNS TRIGGER AS $$ BEGIN INSERT INTO public.profiles (id, email, username, color, avatar) 
VALUES 
  (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'username', 
    NEW.raw_user_meta_data ->> 'color',
    NEW.raw_user_meta_data ->> 'avatar'
  );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE
OR REPLACE TRIGGER create_profile_trigger
AFTER INSERT ON auth.users FOR EACH ROW WHEN (NEW.raw_user_meta_data IS NOT NULL)
EXECUTE FUNCTION public.create_profile ();

CREATE
OR REPLACE FUNCTION public.create_first_library_entry () RETURNS TRIGGER AS $$ BEGIN INSERT INTO public.library (members, title, owner, description, owner_username, updated_by) 
VALUES 
  (
    ARRAY[NEW.id],
    'Example Novel',
    NEW.id,
    'This is an example entry for your library. If you would like to update the description or title then please click the "Edit Description" button below. If you would to use this entry to try write a novel then click the "Write Novel" button. Lastly, if you would like to delete this entry then please click the red text below marked "Delete Novel". I hope you have a whimsical time. Your friend Josh',
    NEW.username,
    NEW.id
  );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE
OR REPLACE TRIGGER create_profile_library_entry_trigger
AFTER INSERT ON public.profiles FOR EACH ROW WHEN (NEW.id IS NOT NULL)
EXECUTE FUNCTION public.create_first_library_entry ();

```

### Public Library

```sh

drop table if exists public.library cascade;

create table
  public.library (
    id uuid DEFAULT uuid_generate_v4() unique,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    members uuid[],
    title text,
    owner uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    description text,
    updated_by text DEFAULT auth.uid(),
    draft_id uuid DEFAULT uuid_generate_v4() REFERENCES public.draft_novel(id) ON DELETE CASCADE unique,
    published_id uuid REFERENCES public.published_novel(id) unique,
    owner_username text,
    primary key (id)
  );

alter table public.library enable row level security;

create policy "Can only view if authenticated." on public.library for
select
  to authenticated using (true);

create policy "Can only insert if authenticated." on public.library for insert to authenticated
with
  check (true);

create policy "Can only update if owner or member" on public.library
for update
  using (
    (auth.uid () = owner)
    or auth.uid () = any (members)
  );

create policy "Can only delete if owner" on public.library for delete using (auth.uid () = owner);

CREATE 
OR REPLACE FUNCTION public.create_draft_novel() RETURNS TRIGGER AS $$ BEGIN INSERT INTO public.draft_novel (id, title, owner, members, updated_by) 
VALUES 
  (
    NEW.draft_id,
    NEW.title,
    NEW.owner,
    NEW.members,
    NEW.owner 
  );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER create_draft_novel_trigger 
AFTER 
  INSERT ON public.library FOR EACH ROW WHEN (
    NEW.title IS NOT NULL
  ) EXECUTE FUNCTION public.create_draft_novel();

CREATE OR REPLACE FUNCTION public.update_draft_novel() 
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.draft_novel 
  SET (updated_by, updated_at, title, members) = (
    NEW.updated_by,
    NEW.updated_at,
    NEW.title,
    NEW.members
  )
  WHERE (
    public.draft_novel.id = NEW.draft_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER update_draft_trigger
AFTER UPDATE ON public.library FOR EACH ROW WHEN (
  NEW.title IS DISTINCT FROM OLD.title
) EXECUTE FUNCTION public.update_draft_novel();

```

### Draft Novel

```sh

DROP TABLE IF EXISTS public.draft_novel cascade;

CREATE TABLE public.draft_novel (
    id uuid NOT NULL REFERENCES public.library(draft_id) ON DELETE CASCADE UNIQUE,
    created_at TIMESTAMP DEFAULT current_timestamp,
    updated_at TIMESTAMP DEFAULT current_timestamp,
    members UUID[],
    title TEXT,
    owner UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    updated_by TEXT,
    body TEXT,
    PRIMARY KEY (id)
);

ALTER TABLE public.draft_novel ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can only view draft novel data if member or owner"
  ON public.draft_novel
  FOR SELECT
  TO authenticated
  USING ( auth.uid() = owner OR auth.uid() = ANY(members) );

CREATE POLICY "Can insert into draft novel if authenticated"
  ON public.draft_novel
  FOR INSERT
  TO authenticated
  WITH CHECK ( true );

CREATE POLICY "Can delete draft novel if owner"
  ON public.draft_novel
  FOR DELETE
  USING ( auth.uid() = owner );

CREATE POLICY "Can update draft novel if member or owner"
  ON public.draft_novel
  FOR UPDATE
  TO authenticated
  USING ( auth.uid() = owner OR auth.uid() = ANY(members));

CREATE OR REPLACE FUNCTION public.update_library_novel() 
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.library 
  SET (updated_by, updated_at, title, members) = (
    NEW.updated_by,
    NEW.updated_at,
    NEW.title,
    NEW.members
  )
  WHERE (
    public.library.draft_id = NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER update_library_trigger
AFTER UPDATE ON public.draft_novel FOR EACH ROW WHEN (
  NEW.title IS DISTINCT FROM OLD.title
) EXECUTE FUNCTION public.update_library_novel();

```

### Published Novel

```sh

DROP TABLE IF EXISTS public.published_novel cascade;

CREATE TABLE
  public.published_novel (
    id uuid DEFAULT gen_random_uuid() REFERENCES public.library (published_id) UNIQUE,
    created_at TIMESTAMP DEFAULT current_timestamp,
    updated_at TIMESTAMP DEFAULT current_timestamp,
    members UUID[],
    title TEXT,
    owner UUID REFERENCES auth.users,
    updated_by TEXT,
    body TEXT,
    PRIMARY KEY (id)
  );

ALTER TABLE public.published_novel ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can only view published novel data if member or owner" ON public.published_novel FOR
SELECT
  TO authenticated USING (
    auth.uid () = owner
    OR auth.uid () = ANY (members)
  );

CREATE POLICY "Can insert into published novel if authenticated" ON public.published_novel FOR INSERT TO authenticated
WITH
  CHECK (true);

CREATE POLICY "Can delete published novel if owner" ON public.published_novel FOR DELETE USING (auth.uid () = owner);

CREATE POLICY "Can update published novel if member or owner" ON public.published_novel
FOR UPDATE
  TO authenticated USING (
    auth.uid () = owner
    OR auth.uid () = ANY (members)
  );

```

### Avatar Storage bucket

```sh

DELETE FROM storage.buckets WHERE id = 'avatars';

insert into storage.buckets
  (id, name, public)
values
  ('avatars', 'avatars', true);

DROP POLICY IF EXISTS "Allow upload on Avatar" ON storage.objects;
CREATE POLICY "Allow upload on Avatar"
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'avatars' AND storage."extension"(name) = 'png' AND auth.role() = 'anon'
  );

DROP POLICY IF EXISTS "Allow select on Avatar" ON storage.objects;
CREATE POLICY "Allow select on Avatar" 
  ON storage.objects
  FOR SELECT
  TO authenticated 
  USING (
    bucket_id = 'avatars' AND storage."extension"(name) = 'png' AND auth.role() = 'anon'
  );

DROP POLICY IF EXISTS "Allow update on Avatar" ON storage.objects;
CREATE POLICY "Allow update on Avatar" 
  ON storage.objects 
  FOR UPDATE 
  TO authenticated 
  USING (
    bucket_id = 'avatars' AND storage."extension"(name) = 'png' AND auth.role() = 'anon'
  );

DROP POLICY IF EXISTS "Allow delete on Avatar" ON storage.objects;
CREATE POLICY "Allow delete on Avatar" 
  ON storage.objects 
  FOR DELETE 
  TO authenticated 
  USING (
    bucket_id = 'avatars' AND storage."extension"(name) = 'png' AND auth.role() = 'anon'
  );

  ```