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