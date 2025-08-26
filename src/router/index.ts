import { createRouter, createWebHistory } from "@ionic/vue-router";
import type { RouteRecordRaw } from "vue-router";

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
    path: "/app",
  },
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
  console.log("IsAuthed", isAuthed);

  // 1) Not authed → only redirect if they're trying to leave /auth
  if (!isAuthed && to.path !== "/auth") {
    return { path: "/auth", replace: true };
  }

  // 2) Authed → keep them out of /auth
  if (isAuthed && to.path === "/auth") {
    return { path: "/app", replace: true };
  }

  return true;
});

export default router;
