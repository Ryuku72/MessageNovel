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

export type ProfileEntry = {
  id: string;
  email: string;
  username: string;
  color: string;
  avatar: string;
  created_at: string;
  updated_at: string;
};

export type UserDataEntry = {
  id: string;
  avatar: string;
  username: string;
  email: string;
  color: string;
};
