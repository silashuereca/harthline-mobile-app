<template>
  <div>
    <IonHeader>
      <IonToolbar>
        <div class="w-full flex items-center justify-center">
          <IonSegment value="planned">
            <IonSegmentButton value="planned">
              <IonLabel>Planned</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="spent">
              <IonLabel>Spent</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="remaining">
              <IonLabel>Remaining</IonLabel>
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
