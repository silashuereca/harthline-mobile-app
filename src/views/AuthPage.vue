<!-- src/views/AuthPage.vue -->
<template>
  <IonPage>
    <IonContent fullscreen>
      <div class="ion-align-content-center">
        <!-- Title -->
        <h1 class="ion-text-center">
          Harthline
        </h1>

        <!-- Google login button -->
        <IonButton expand="block" size="large" shape="round" @click="simulateGoogleSignIn">
          <template #start>
            <IonIcon :icon="logoGoogle" />
          </template>
          Continue with Google
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
  /* no-op while designing */
};
</script>


