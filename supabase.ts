import { createClient, User } from "@supabase/supabase-js";
import Constants from "expo-constants";
import * as Linking from "expo-linking";

import { Database } from "./supabase/functions/_shared/database-types";

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    detectSessionInUrl: false,
    persistSession: true,
  },
});
export type TAuthUser = User;

export async function getUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return null;
  }
  return data.user;
}

export async function signInWithGoogle(redirectTo: string) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        prompt: "select_account",
      },
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;

  if (data?.url) {
    await Linking.openURL(data.url);
  }

  return data;
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut({ scope: "global" });
  if (error) {
    throw new Error(`Failed to sign out: ${error.message}`);
  }
}

export async function handleAuthCallback(url: string): Promise<void> {
  // Tokens come in URL hash fragment (#access_token=...)
  // Extract from hash if present
  let accessToken: string | null = null;
  let refreshToken: string | null = null;

  const hashIndex = url.indexOf('#');
  if (hashIndex !== -1) {
    const hashParams = new URLSearchParams(url.substring(hashIndex + 1));
    accessToken = hashParams.get('access_token');
    refreshToken = hashParams.get('refresh_token');
  }

  // Fallback to query params (Linking.parse puts fragment params here sometimes)
  if (!accessToken || !refreshToken) {
    const parsedUrl = Linking.parse(url);
    accessToken = accessToken || (parsedUrl.queryParams?.access_token as string);
    refreshToken = refreshToken || (parsedUrl.queryParams?.refresh_token as string);
  }

  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      throw new Error(`Failed to set session: ${error.message}`);
    }
  }
}
