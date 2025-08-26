<template>
  <div>
    <IonHeader>
      <IonToolbar>
        <div class="w-full flex items-center justify-center">
          <IonSegment value="recipes">
            <IonSegmentButton value="recipes">
              <IonLabel>Recipes</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="grocery-list">
              <IonLabel>Grocery List</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>
      </IonToolbar>
    </IonHeader>
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
