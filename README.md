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
OR REPLACE FUNCTION public.update_profiles () RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles 
  SET (updated_at, username, color, avatar) = (
    NEW.updated_at,
    NEW.raw_user_meta_data ->> 'username', 
    NEW.raw_user_meta_data ->> 'color',
    NEW.raw_user_meta_data ->> 'avatar'
  )
  WHERE (
    public.profiles.id = NEW.id
  );
  RETURN NEW;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE
OR REPLACE TRIGGER update_profile_trigger
AFTER UPDATE ON auth.users FOR EACH ROW WHEN (
  NEW.raw_user_meta_data IS DISTINCT FROM OLD.raw_user_meta_data
)
EXECUTE FUNCTION public.update_profiles ();

CREATE
OR REPLACE FUNCTION public.create_first_library_entry () RETURNS TRIGGER AS $$ 
BEGIN 
 -- Indicate that the special condition should apply
INSERT INTO public.special_condition (user_id) VALUES (NEW.id);
INSERT INTO public.library (members, title, owner, description, owner_username, updated_by) 
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
    id uuid DEFAULT uuid_generate_v4 () unique,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    members uuid[],
    title text,
    owner uuid REFERENCES auth.users (id) ON DELETE CASCADE,
    description text,
    updated_by text DEFAULT auth.uid (),
    draft_id uuid DEFAULT uuid_generate_v4 () REFERENCES public.draft_novel (id) ON DELETE CASCADE unique,
    published_id uuid REFERENCES public.published_novel (id) unique,
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
OR REPLACE FUNCTION public.create_draft_novel () RETURNS TRIGGER AS $$ 
DECLARE
    is_special_condition BOOLEAN;
BEGIN
  -- Check if the special condition is met
  SELECT EXISTS (SELECT 1 FROM public.special_condition WHERE user_id = NEW.owner)
  INTO is_special_condition;
  
  IF is_special_condition THEN
    INSERT INTO public.draft_novel (id, title, owner, members, updated_by, body) 
    VALUES (
      NEW.draft_id,
      NEW.title,
      NEW.owner,
      NEW.members,
      NEW.owner,
 '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"What is Lorem Ipsum?","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"heading","version":1,"tag":"h3"},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Lorem Ipsum","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":1},{"children":[],"direction":null,"format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Why do we use it?","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"heading","version":1,"tag":"h3"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Where does it come from?","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"heading","version":1,"tag":"h3"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \"de Finibus Bonorum et Malorum\" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[],"direction":null,"format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Where can I get some?","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"heading","version":1,"tag":"h3"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isnt anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}'
    );
    -- Remove the special condition
    DELETE FROM public.special_condition WHERE user_id = NEW.owner;
  ELSE
INSERT INTO public.draft_novel (id, title, owner, members, updated_by) 
VALUES 
  (
    NEW.draft_id,
    NEW.title,
    NEW.owner,
    NEW.members,
    NEW.owner 
  );
 END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE
OR REPLACE TRIGGER create_draft_novel_trigger
AFTER INSERT ON public.library FOR EACH ROW WHEN (NEW.title IS NOT NULL)
EXECUTE FUNCTION public.create_draft_novel ();

CREATE
OR REPLACE FUNCTION public.update_draft_novel () RETURNS TRIGGER AS $$
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

CREATE
OR REPLACE TRIGGER update_draft_trigger
AFTER
UPDATE ON public.library FOR EACH ROW WHEN (NEW.title IS DISTINCT FROM OLD.title)
EXECUTE FUNCTION public.update_draft_novel ();

CREATE
OR REPLACE FUNCTION public.update_library_owner () RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.library
  SET (updated_at, updated_by, owner_username) = (
    NEW.updated_at,
    NEW.raw_user_meta_data ->> 'username',
    NEW.raw_user_meta_data ->> 'username'
  )
  WHERE (
    public.library.owner = NEW.id
    AND public.library.owner_username <> NEW.raw_user_meta_data ->> 'username'
  );
  RETURN NEW;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE
OR REPLACE TRIGGER update_profile_trigger
AFTER
UPDATE ON auth.users FOR EACH ROW WHEN (
  NEW.raw_user_meta_data IS DISTINCT FROM OLD.raw_user_meta_data
  AND OLD.raw_user_meta_data ->> 'username' IS DISTINCT FROM NEW.raw_user_meta_data ->> 'username'
)
EXECUTE FUNCTION public.update_library_owner ();


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

insert into
  storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true);

create policy "Allow authenticated access to avatars" on storage.objects for
select
  to authenticated using (
    bucket_id = 'avatars'
    and (storage.foldername (name)) [1] = 'public'
  );

create policy "Allow authenticated to insert avatars" on storage.objects for insert to authenticated
with
  check (
    bucket_id = 'avatars'
    and (storage.foldername (name)) [1] = 'public'
  );

create policy "Allow authenticated to update avatars" on storage.objects
for update
  to authenticated using (
    bucket_id = 'avatars'
    and (storage.foldername (name)) [1] = 'public'
  );

create policy "Allow authenticated to delete avatars" on storage.objects for delete to authenticated using (
  bucket_id = 'avatars'
  and (storage.foldername (name)) [1] = 'public'
);

create policy "Enable read access for all users" on "storage"."objects" for
select
  using (true);

create policy "Enable insert access to storage bucket for authenticated users" on "storage"."buckets" for insert to authenticated
with
  check (true);

create policy "Enable delete access to storage for authenticated users" on storage.objects for delete to authenticated using (true);

create policy "Enable update access to storage bucket for authenticated users" on storage.objects
for update
  to authenticated using (true);

```