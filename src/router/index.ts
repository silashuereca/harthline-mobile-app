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

  if (!isAuthed) {
    // Allow the auth screen to render when the user is logged out.
    if (to.path === "/auth") {
      return true;
    }

    return { path: "/auth", replace: true };
  }

  const { setHouseId } = useAppStore();
  const { data: settingsData } = await supabase
    .from("settings")
    .select("*")
    .single();

  const selectedHouseId = settingsData?.selected_house_id;
  if (typeof selectedHouseId === "number") {
    setHouseId(selectedHouseId);
  }

  if (to.path === "/auth") {
    return {
      name: "home",
      params: { houseId: selectedHouseId },
      replace: true,
    };
  }

  if (to.path === "/app") {
    return {
      name: "home",
      params: { houseId: selectedHouseId },
      replace: true,
    };
  }

  return true;
});

export default router;
