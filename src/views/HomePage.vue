<template>
  <IonPage>
    <IonTabs>
      <IonTab tab="budget">
        <IonContent>
          <BudgetWrapper />
        </IonContent>
      </IonTab>
      <IonTab tab="kitchen">
        <IonContent>
          <KitchenWrapper />
        </IonContent>
      </IonTab>
      <IonTab tab="profile">
        <IonContent>
          <UserProfile />
        </IonContent>
      </IonTab>

      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <IonTabBar slot="bottom">
        <IonTabButton tab="budget">
          <IconCreditCard class="dark:text-white" />
          <span class="dark:text-white">Budget</span>
        </IonTabButton>
        <IonTabButton tab="profile">
          <IconUserCircle class="dark:text-white" />
          <span class="dark:text-white">Profile</span>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonPage>
</template>
<script lang="ts" setup>
import {
  IonContent,
  IonPage,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/vue";

import BudgetWrapper from "../components/budget/BudgetWrapper.vue";
import KitchenWrapper from "../components/kitchen/KitchenWrapper.vue";
import UserProfile from "../components/UserProfile.vue";
import IconCreditCard from "../icons/IconCreditCard.vue";
import IconUserCircle from "../icons/IconUserCircle.vue";
</script>

<style scoped>
:deep(ion-tab-bar) {
  height: 75px;
  padding: 0 12px;
}

:deep(ion-tab-button) {
  --background: transparent;
  --background-focused: transparent;
  --background-selected: rgba(var(--ion-color-primary-rgb), 0.18);
  --background-selected-focused: rgba(var(--ion-color-primary-rgb), 0.22);
  --border-radius: 16px;
  --padding-start: 18px;
  --padding-end: 18px;
  --color: var(--ion-color-medium);
  --color-focused: var(--ion-color-medium);
  --color-selected: var(--ion-color-primary);
  --color-selected-focused: var(--ion-color-primary);
  gap: 6px;
  margin: 0 10px;
  font-weight: 500;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

:deep(ion-tab-button:not(.tab-selected)) {
  opacity: 0.65;
}

:deep(ion-tab-button.tab-selected) {
  opacity: 1;
  transform: translateY(-4px);
}
</style>
