<template>
  <IonModal id="example-modal" :is-open="open" :backdrop-dismiss="false">
    <IonCard class="ion-padding">
      <IonInput :value="name" placeholder="Enter budget item name" label="Name" />
      <IonInput :value="amount" type="number" placeholder="Enter budget item amount" label="Amount" />
      <div class="mt-5 flex items-center justify-between">
        <IonButton size="small" color="light" @click="closeModal()">
          Close
        </IonButton>
        <IonButton color="success" size="small" @click="saveItem()">
          <span class="text-white">Save</span>
        </IonButton>
      </div>
    </IonCard>
  </IonModal>
</template>

<script lang="ts" setup>
import { IonButton, IonCard, IonInput, IonModal } from "@ionic/vue";
defineProps({
  amount: {
    default: 0,
    type: Number,
  },
  name: {
    default: "",
    type: String,
  },
  open: {
    default: false,
    type: Boolean,
  },
});

type TEmits = {
  "update:close": [void];
};

const emit = defineEmits<TEmits>();

function closeModal(): void {
  emit("update:close");
}

function saveItem(): void {
  emit("update:close");
}
</script>

<style>
ion-modal#budget-form-component {
  --width: fit-content;
  --min-width: 250px;
  --height: fit-content;
  --border-radius: 6px;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
}

ion-modal#budget-form-component h1 {
  margin: 20px 20px 10px 20px;
}

ion-modal#budget-form-component ion-icon {
  margin-right: 6px;

  width: 48px;
  height: 48px;

  padding: 4px 0;

  color: #aaaaaa;
}

ion-modal#budget-form-component .wrapper {
  margin-bottom: 10px;
}
</style>



