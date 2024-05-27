import {
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  Session,
  SupabaseClient,
  UserResponse
} from '@supabase/supabase-js';

import { envConfig } from '~/services/API';

export type LoginAuthUserEntry = {
  email: string;
  password: string;
  supabaseClient: SupabaseClient;
};
export async function LoginAuthUser({
  supabaseClient,
  email,
  password
}: LoginAuthUserEntry): Promise<AuthTokenResponsePassword> {
  return supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });
}

export async function LoadAuthUser(supabaseClient: SupabaseClient): Promise<UserResponse> {
  return supabaseClient.auth.getUser();
}

export async function LoadSession(
  supabaseClient: SupabaseClient
): Promise<{ data: { session: Session | null }; error: AuthError | null }> {
  return supabaseClient.auth.getSession();
}

export type ActionSignUpUserEntry = { email: string; password: string; supabaseClient: SupabaseClient };
export function ActionSignUpUser({ supabaseClient, email, password }: ActionSignUpUserEntry): Promise<AuthResponse> {
  return supabaseClient.auth.signUp({ email, password });
}

export type ActionUpdateUserEntry = {
  filename: string;
  userId: string;
  extension: string;
  username: string;
  color: string;
  supabaseClient: SupabaseClient;
};
export async function ActionUpdateAuthUser({
  supabaseClient,
  filename,
  userId,
  extension,
  username,
  color
}: ActionUpdateUserEntry): Promise<UserResponse> {
  const env = envConfig();
  return supabaseClient.auth.updateUser({
    data: {
      avatar: filename ? `${env.SUPABASE_IMG_STORAGE}/assets/${userId}/avatar.${extension}` : '',
      username,
      color
    }
  });
}

export async function ActionSignOut(
  supabaseClient: SupabaseClient): Promise<{ error: AuthError | null }> {
  return supabaseClient.auth.signOut();
}
