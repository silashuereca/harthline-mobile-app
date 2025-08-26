<template>
  <IonTabs>
    <IonTab tab="home">
      <IonContent>
        <BudgetWrapper />
      </IonContent>
    </IonTab>
    <IonTab tab="radio">
      <IonContent>
        <KitchenWrapper />
      </IonContent>
    </IonTab>

    <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
    <IonTabBar slot="bottom" color="primary">
      <IonTabButton tab="home">
        <IconCreditCard class=" dark:text-white" />
        <span class="dark:text-white">Budget</span>
      </IonTabButton>
      <IonTabButton tab="radio">
        <IconCake class=" dark:text-white" />
        <span class="dark:text-white">Kitchen</span>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
</template>
<script lang="ts" setup>
import {
  IonContent,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/vue";

import BudgetWrapper from "../components/budget/BudgetWrapper.vue";
import KitchenWrapper from "../components/kitchen/KitchenWrapper.vue";
import IconCake from "../icons/IconCake.vue";
import IconCreditCard from "../icons/IconCreditCard.vue";
</script>

<style scoped>
ion-tab-bar {
  height: 75px;
}
</style>
