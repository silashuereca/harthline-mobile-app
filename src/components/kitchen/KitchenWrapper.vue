<template>
  <div>
    <IonHeader>
      <IonToolbar>
        <div class="w-full flex items-center justify-center">
          Place Date Picker Here
        </div>
      </IonToolbar>
    </IonHeader>

    <div>
      <IonSegment value="recipes">
        <IonSegmentButton value="recipes">
          <IonLabel>Recipes</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="grocery-list">
          <IonLabel>Grocery List</IonLabel>
        </IonSegmentButton>
      </IonSegment>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  IonHeader,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
} from "@ionic/vue";
</script>

<style>
ion-segment {
  padding: 2px;
}
</style>
