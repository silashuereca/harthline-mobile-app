<template>
  <div>
    <IonHeader>
      <IonToolbar>
        <div class="w-full flex items-center justify-center">
          <p class="text-base font-medium">
            Profile
          </p>
        </div>
      </IonToolbar>
    </IonHeader>

    <div class="px-6 py-8 flex flex-col items-center gap-4 text-center">
      <div
        class="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center"
      >
        <img
          :src="state.user?.user_metadata?.avatar_url"
          alt="User avatar"
          class="w-full h-full object-cover"
        >
      </div>

      <p class="text-lg font-semibold" v-text="state.user?.user_metadata?.full_name" />
      <p class="text-sm text-gray-500" v-text="state.user?.email" />

      <IonButton
        class=" dark:text-white"
        size="small"
        shape="round"
        expand="full"
        @click="logout"
      >
        Logout
      </IonButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IonButton, IonHeader, IonToolbar, useIonRouter } from "@ionic/vue";
import { onMounted, reactive } from "vue";

import { getUser, supabase, TAuthUser } from "../supabase";

const ionRouter = useIonRouter();

type TState = {
  user: TAuthUser | null;
};

const state: TState = reactive({
  user: null,
});

onMounted(async () => {
  state.user = await getUser();
});

async function logout() {
  await supabase.auth.signOut({ scope: "global" });
  ionRouter.replace({ name: "auth" });
}
</script>
