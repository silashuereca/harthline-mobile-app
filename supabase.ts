import { createClient, User } from "@supabase/supabase-js";
import Constants from "expo-constants";

import { Database } from "../supabase/functions/_shared/database-types";

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;
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
