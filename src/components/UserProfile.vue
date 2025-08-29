<template>
  <div>
    <IonHeader>
      <IonToolbar>
        <div class="w-full flex items-center justify-center">
          <p v-text="state.user?.user_metadata?.name" />
        </div>
      </IonToolbar>
    </IonHeader>

    <div class="p-4">
      <IonButton size="small" shape="round" expand="full" @click="logout">
        Logout
      </IonButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IonButton, IonHeader, IonToolbar } from "@ionic/vue";
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";

import { getUser, supabase, TAuthUser } from "../supabase";

const router = useRouter();

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
  await supabase.auth.signOut();
  await router.push({ name: "auth" });
}
</script>



