<template>
  <IonTabs>
    <IonTab tab="home">
      <div id="home-page">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Recipes</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div class="example-content">
            Recipes content
          </div>
        </IonContent>
      </div>
    </IonTab>
    <IonTab tab="radio">
      <div id="radio-page">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Grocery List</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div class="example-content">
            Grocery List content
          </div>
        </IonContent>
      </div>
    </IonTab>

    <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
    <IonTabBar slot="bottom" color="primary">
      <IonTabButton tab="home">
        <IonIcon :icon="albums" class=" dark:text-white" />
        <span class="dark:text-white">Recipes</span>
      </IonTabButton>
      <IonTabButton tab="radio">
        <IonIcon :icon="list" class=" dark:text-white" />
        <span class="dark:text-white">Grocery List</span>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
</template>
<script lang="ts" setup>
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { albums, list } from "ionicons/icons";
</script>

<style scoped>
/* This style is for demonstration purposes only. */
/* It's not required for the tabs to function. */
.example-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* Lift the tab bar a bit */
ion-tab-bar {
  height: 75px;
}
</style>
