export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      library: {
        Row: {
          created_at: string;
          description: string;
          draft_id: string | null;
          id: string;
          members: string[];
          owner: string;
          owner_username: string;
          published_id: string | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          description: string;
          draft_id?: string | null;
          id?: string;
          members?: string[];
          owner: string;
          owner_username: string;
          published_id?: string | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string;
          draft_id?: string | null;
          id?: string;
          members?: string[];
          owner?: string;
          owner_username?: string;
          published_id?: string | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'library_draft_id_fkey';
            columns: ['draft_id'];
            isOneToOne: true;
            referencedRelation: 'novel_draft';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Library_owner_fkey';
            columns: ['owner'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'library_published_id_fkey';
            columns: ['published_id'];
            isOneToOne: true;
            referencedRelation: 'novel_published';
            referencedColumns: ['id'];
          }
        ];
      };
      novel_draft: {
        Row: {
          body: string | null;
          created_at: string;
          id: string;
          members: string[] | null;
          title: string | null;
          updated_at: string | null;
          updated_by: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          id?: string;
          members?: string[] | null;
          title?: string | null;
          updated_at?: string | null;
          updated_by: string;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          id?: string;
          members?: string[] | null;
          title?: string | null;
          updated_at?: string | null;
          updated_by?: string;
        };
        Relationships: [];
      };
      novel_published: {
        Row: {
          body: Json;
          created_at: string;
          id: string;
          members: string[] | null;
          title: string | null;
          updated_at: string | null;
          updated_by: string;
        };
        Insert: {
          body: Json;
          created_at?: string;
          id?: string;
          members?: string[] | null;
          title?: string | null;
          updated_at?: string | null;
          updated_by: string;
        };
        Update: {
          body?: Json;
          created_at?: string;
          id?: string;
          members?: string[] | null;
          title?: string | null;
          updated_at?: string | null;
          updated_by?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar: string;
          color: string | null;
          created_at: string | null;
          email: string | null;
          id: string;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          avatar?: string;
          color?: string | null;
          created_at?: string | null;
          email?: string | null;
          id: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          avatar?: string;
          color?: string | null;
          created_at?: string | null;
          email?: string | null;
          id?: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views']) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;
