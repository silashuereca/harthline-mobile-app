import { createRouter, createWebHistory } from "@ionic/vue-router";
import type { RouteRecordRaw } from "vue-router";

import { useAppStore } from "../store";
import { supabase } from "../supabase";

const routes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/auth" },
  {
    component: () => import("../views/AuthPage.vue"),
    name: "auth",
    path: "/auth",
  },
  // simple "you’re logged in" page with a Logout button
  {
    component: () => import("../views/HomePage.vue"),
    name: "home",
    path: "/app/:houseId",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  const { data } = await supabase.auth.getSession();
  const isAuthed = !!data.session;

  if (!isAuthed && to.path !== "/auth") {
    return { path: "/auth", replace: true };
  } else if (!isAuthed) {
    return { path: "/auth", replace: true };
  }

  const { setHouseId } = useAppStore();
  const settings = await supabase.from("settings").select("*").single();
  setHouseId(settings.data?.selected_house_id);

  // Authed → keep them out of /auth
  if (to.path === "/auth") {
    return {
      name: "home",
      params: { houseId: settings.data?.selected_house_id },
      replace: true,
    };
  }

  if (to.path === "/app") {
    return {
      name: "home",
      params: { houseId: settings.data?.selected_house_id },
      replace: true,
    };
  }

  return true;
});

export default router;
