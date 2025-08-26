import { createRouter, createWebHistory } from "@ionic/vue-router";
import type { RouteRecordRaw } from "vue-router";

import { supabase } from "../supabase";

const routes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/auth" },
  { component: () => import("../views/AuthPage.vue"), path: "/auth" },
  // simple "you’re logged in" page with a Logout button
  { component: () => import("../views/HomePage.vue"), path: "/app" },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  const { data } = await supabase.auth.getSession();
  const isAuthed = !!data.session;

  console.log("IsAuthed", isAuthed);
  console.log("Full path", to.fullPath);

  // If not authed, force to /auth

  if (!isAuthed) {
    return "/auth";
  } else if (isAuthed && to.path === "/auth") {
    return "/app";
  }
});

export default router;
