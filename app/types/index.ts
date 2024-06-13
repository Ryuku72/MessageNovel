import { User } from '@supabase/supabase-js';
import { SerializedEditorState, SerializedLexicalNode } from 'lexical';

export type NovelEntry = {
  id: string;
  created_at: string;
  updated_at: string;
  members: string[];
  title: string;
  body: SerializedEditorState<SerializedLexicalNode>;
  updated_by: string;
};

export type NovelinLibraryEntry = Omit<
  NovelEntry & {
    owner: string;
    description: SerializedEditorState<SerializedLexicalNode>;
    draft_id: string;
    published_id?: string;
    owner_username: string;
  },
  'body' | 'updated_by'
>;

export type ProfileEntry = {
  id: string;
  email: string;
  username: string;
  color: string;
  avatar: string;
  created_at: string;
  updated_at: string;
};

export type AuthProfileEntry = User & {
  user_metadata: {
    avatar: string;
    color: string;
    username: string;
  }
}

export type UserDataEntry = Omit<ProfileEntry, 'created_at' | 'updated_at'>;

export type SVG_Stoke_Component_props = {
  className: string;
  svgColor?: string;
  uniqueId: string;
  svgStroke?: string;
};

export type SVG_Component_props = Omit<SVG_Stoke_Component_props, 'svgStroke'>;
