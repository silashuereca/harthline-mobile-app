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
      <IonTabBar slot="bottom" color="primary">
        <IonTabButton tab="budget">
          <IconCreditCard class=" dark:text-white" />
          <span class="dark:text-white">Budget</span>
        </IonTabButton>
        <IonTabButton tab="kitchen">
          <IconCake class=" dark:text-white" />
          <span class="dark:text-white">Kitchen</span>
        </IonTabButton>
        <IonTabButton tab="profile">
          <IconUserCircle class=" dark:text-white" />
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
import IconCake from "../icons/IconCake.vue";
import IconCreditCard from "../icons/IconCreditCard.vue";
import IconUserCircle from "../icons/IconUserCircle.vue";
</script>

<style scoped>
ion-tab-bar {
  height: 75px;
}
</style>
