<template>
  <IonPage>
    <IonContent fullscreen>
      <div class="ion-align-content-center h-full flex flex-col items-center justify-center">
        <div>
          <img class="h-48 w-auto m-auto" src="../assets/harthline-house.png" alt="Harthline logo">
        </div>


        <!-- Google login button -->
        <IonButton expand="block" size="medium" @click="simulateGoogleSignIn">
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
// No router nav while styling
const simulateGoogleSignIn = () => {
  //will need to implement Google Sign-In functionality for supabase
};
</script>


