<template>
  <div>
    <IonHeader>
      <IonToolbar>
        <IonButton id="open-custom-dialog">
          Select Month
        </IonButton>
      </IonToolbar>
    </IonHeader>

    <IonModal id="example-modal" ref="modal" trigger="open-custom-dialog">
      <div class="wrapper">
        <IonDatetime
          :value="state.selectedMonth"
          presentation="month-year"
          @ion-change="selectMonth"
        />
      </div>
    </IonModal>



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
  </div>
</template>

<script lang="ts" setup>
import {
  IonButton,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
} from "@ionic/vue";
import { reactive, ref } from "vue";

const modal = ref();
const dismiss = () => modal.value.$el.dismiss();

type TState = {
  selectedMonth: string;
};

const state: TState = reactive({
  selectedMonth: null,
});

function selectMonth(selected: any): void {
  const selectedDate = selected.detail.value;
  state.selectedMonth = selectedDate;
}
</script>
<style>
ion-modal#example-modal {
  --width: fit-content;
  --min-width: 250px;
  --height: fit-content;
  --border-radius: 6px;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
}

ion-modal#example-modal h1 {
  margin: 20px 20px 10px 20px;
}

ion-modal#example-modal ion-icon {
  margin-right: 6px;

  width: 48px;
  height: 48px;

  padding: 4px 0;

  color: #aaaaaa;
}

ion-modal#example-modal .wrapper {
  margin-bottom: 10px;
}
</style>
