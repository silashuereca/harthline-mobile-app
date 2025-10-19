import type { Session, User } from "@supabase/supabase-js";
import { onMounted, onUnmounted, ref } from "vue";

import { supabase } from "../supabase";

const sessionRef = ref<Session | null>(null);
const userRef = ref<User | null>(null);

let unsub: (() => void) | null = null;

export function useAuth() {
  const load = async () => {
    const { data } = await supabase.auth.getSession();
    sessionRef.value = data.session ?? null;
    userRef.value = data.session?.user ?? null;
  };

  onMounted(async () => {
    await load();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      sessionRef.value = session ?? null;
      userRef.value = session?.user ?? null;
    });
    unsub = sub.subscription.unsubscribe;
  });

  onUnmounted(() => {
    if (unsub) unsub();
  });

  const signInWithGoogle = async (redirectTo: string) => {
    // Native flow uses system browser; Capacitor will bounce back to our app
    const { data, error } = await supabase.auth.signInWithOAuth({
      options: {
        queryParams: {
          prompt: "select_account",
        },
        redirectTo,
        skipBrowserRedirect: false,
      },
      provider: "google",
    });
    if (error) throw error;
    return data;
  };

  const signOut = (scope: "global" | "local" = "global") =>
    supabase.auth.signOut({ scope });

  return {
    refresh: load,
    session: sessionRef,
    signInWithGoogle,
    signOut,
    user: userRef,
  };
}
