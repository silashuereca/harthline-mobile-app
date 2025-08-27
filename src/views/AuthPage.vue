<template>
  <IonPage>
    <IonContent fullscreen>
      <div class="ion-align-content-center h-full flex flex-col items-center justify-center">
        <div>
          <img class="h-48 w-auto m-auto" src="../assets/harthline-house.png" alt="Harthline logo">
        </div>


        <!-- Google login button -->
        <IonButton expand="block" shape="round" @click="onGoogle()">
          <IonIcon class="dark:text-white" :icon="logoGoogle" />
          <span class="pl-2 dark:text-white">Continue with Google</span>
        </IonButton>
      </div>
    </IonContent>
  </IonPage>
</template>

<!-- src/views/AuthPage.vue -->
<script setup lang="ts">
import { IonButton, IonContent, IonIcon, IonPage } from "@ionic/vue";
import { logoGoogle } from "ionicons/icons";

import { useAuth } from "../composables/useAuth";

const OAUTH_REDIRECT = "harthline://auth/callback";
const { signInWithGoogle } = useAuth();
// No router nav while styling
const onGoogle = async () => {
  try {
    // Open via system browser for native OAuth
    await signInWithGoogle(OAUTH_REDIRECT);
    // Supabase SDK will open the browser; we don't push routes here.
    // The deep link handler in main.ts will complete the sign-in.
  } catch (e) {
    console.error(e);
    // optional: toast error
  }
};
</script>


