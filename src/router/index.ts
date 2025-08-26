// src/router/index.ts
import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";

// Toggle this off later when you're ready to test real navigation
const DEV_LOCK_AUTH = true;

const routes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/auth" },
  { component: () => import("../views/AuthPage.vue"), path: "/auth" },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Hard redirect anything that isn't /auth back to /auth
router.beforeEach((to) => {
  if (DEV_LOCK_AUTH && to.path !== "/auth") return "/auth";
});

export default router;
