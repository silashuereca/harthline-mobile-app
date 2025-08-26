import { createClient, User } from "@supabase/supabase-js";

import { Database } from "../supabase/functions/_shared/database-types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    detectSessionInUrl: false,
    persistSession: true,
  },
});
export type TAuthUser = User;

export async function getUser(): Promise<User> {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
  return data.user;
}
