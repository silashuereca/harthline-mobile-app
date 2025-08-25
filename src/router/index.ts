import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";

import TabsPage from "../views/TabsPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/tabs/tab1",
  },
  {
    children: [
      {
        path: "",
        redirect: "/tabs/tab1",
      },
      {
        component: () => import("@/views/Tab1Page.vue"),
        path: "tab1",
      },
      {
        component: () => import("@/views/Tab2Page.vue"),
        path: "tab2",
      },
      {
        component: () => import("@/views/Tab3Page.vue"),
        path: "tab3",
      },
    ],
    component: TabsPage,
    path: "/tabs/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
