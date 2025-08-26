/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";
/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";
/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */
/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import "@ionic/vue/css/palettes/dark.system.css";
/* Theme variables */
import "./theme/variables.css";

import { App as CapacitorApp } from "@capacitor/app";
import { IonicVue } from "@ionic/vue";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import { supabase } from "./supabase";

const app = createApp(App).use(IonicVue).use(router);

CapacitorApp.addListener("appUrlOpen", async ({ url }) => {
  const hash = url.split("#")[1] ?? "";
  const params = new URLSearchParams(hash);
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");
  console.log("URL", url);
  if (access_token && refresh_token) {
    const { error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    const session = await supabase.auth.getSession();
    if (session?.data?.session) {
      await router.push("/app");
    }
    console.log("setSession", session?.data?.session);
    if (error) console.error("setSession error", error);
  } else {
    const { error } = await supabase.auth.exchangeCodeForSession(url);
    if (error) console.error("exchangeCodeForSession error", error);
  }
});

router.isReady().then(() => {
  app.mount("#app");
});
