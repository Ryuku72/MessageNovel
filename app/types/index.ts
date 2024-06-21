import { User } from '@supabase/supabase-js';
import { SerializedEditorState, SerializedLexicalNode } from 'lexical';

export type ProfileEntry = {
  id: string;
  email: string;
  username: string;
  color: string;
  avatar: string | null;
  created_at: string;
  updated_at: string;
};

export type BasicProfile = Pick<ProfileEntry, 'id' | 'username' | 'color' | 'avatar'>;

export type Novel = {
  id: string;
  created_at: string;
  updated_at: string;
  owner: string;
  title: string;
  description: SerializedEditorState<SerializedLexicalNode>;
  members: string[];
  pages: string[];
};

export type NovelWithUsers = Omit<Novel, 'owner'> & { owner: BasicProfile; members: BasicProfile[] };

export type Page = {
  id: string;
  created_at: string;
  updated_at: string;
  novel_id: string;
  owner: string;
  members: string[];
  reference_title: string;
  index: number;
  published: SerializedEditorState<SerializedLexicalNode> | null;
  collab: number[];
  comments: number[];
  chat: number[];
  enable_collab: boolean;
};

export type PageWithUsers = Omit<Page, 'owner'> & { owner: BasicProfile; members: BasicProfile[] };

export type AuthProfileEntry = User & {
  user_metadata: {
    avatar?: string;
    color: string;
    username: string;
  };
};

export type UserDataEntry = Omit<ProfileEntry, 'created_at' | 'updated_at'>;

export type SVG_Stoke_Component_props = {
  className: string;
  svgColor?: string;
  uniqueId: string;
  svgStroke?: string;
};

export type SVG_Component_props = Omit<SVG_Stoke_Component_props, 'svgStroke'>;

export type Unit =
  | '%'
  | 'cm'
  | 'mm'
  | 'Q'
  | 'in'
  | 'pc'
  | 'pt'
  | 'px'
  | 'em'
  | 'ex'
  | 'ch'
  | 'rem'
  | 'lh'
  | 'vw'
  | 'vh'
  | 'vmin'
  | 'vmax';

export type Escape = (className: string) => string;
