import { LoaderFunctionArgs } from "@remix-run/node";
import { createServerClient, parse, serialize } from "@supabase/ssr";

export type envConfigType = {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string
  }

export const envConfig = () => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_KEY!,
  };
  return env;
};


export const initServer = async (request: LoaderFunctionArgs['request']) => {
  const env = envConfig();
  const cookies = parse(request.headers.get('Cookie') ?? '')
  const headers = new Headers()
  const supabase = await createServerClient(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    {
      cookies: {
        get(key) {
          return cookies[key]
        },
        set(key, value, options) {
          headers.append('Set-Cookie', serialize(key, value, options))
        },
        remove(key, options) {
          headers.append('Set-Cookie', serialize(key, '', options))
        },
      }
    }
  );

  return supabase;
}