import { LoaderFunctionArgs } from '@remix-run/node';

import { createServerClient, parse, serialize } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

export type EnvConfigEntry = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_IMG_STORAGE: string;
  SUPABASE_SERVICE_KEY: string;
};

export const envConfig = (): EnvConfigEntry => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_KEY!,
    SUPABASE_IMG_STORAGE: process.env.SUPABASE_IMG_STORAGE!,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY!
  };
  return env;
};

export type SupabaseClientAndHeaderEntry = {
  supabaseClient: SupabaseClient;
  headers: Headers;
  env: EnvConfigEntry;
};

export const initServer = async (request: LoaderFunctionArgs['request']): Promise<SupabaseClientAndHeaderEntry> => {
  const env = envConfig();
  const cookies = parse(request.headers.get('Cookie') ?? '');
  const headers = new Headers();

  const supabaseClient = await createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      get(key) {
        return cookies[key];
      },
      set(key, value, options) {
        headers.append('Set-Cookie', serialize(key, value, options));
      },
      remove(key, options) {
        headers.append('Set-Cookie', serialize(key, '', options));
      }
    }
  });

  return { supabaseClient, headers, env };
};

export const initAuthServer = async (request: LoaderFunctionArgs['request']): Promise<SupabaseClientAndHeaderEntry> => {
  const env = envConfig();
  const cookies = parse(request.headers.get('Cookie') ?? '');
  const headers = new Headers();

  const supabaseClient = await createServerClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
    cookies: {
      get(key) {
        return cookies[key];
      },
      set(key, value, options) {
        headers.append('Set-Cookie', serialize(key, value, options));
      },
      remove(key, options) {
        headers.append('Set-Cookie', serialize(key, '', options));
      }
    }
  });

  return { supabaseClient, headers, env };
};
