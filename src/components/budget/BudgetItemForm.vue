<template>
  <IonModal :is-open="open" :backdrop-dismiss="false">
    <IonContent>
      <div class="mt-10">
        Budget Item Form Here
      </div>
      <button @click="closeModal()">
        Close
      </button>
    </IonContent>
  </IonModal>
</template>

<script lang="ts" setup>
import { IonContent, IonModal } from "@ionic/vue";
defineProps({
  open: {
    default: false,
    type: Boolean,
  },
});

type TEmits = {
  "update:close": [boolean];
};

const emit = defineEmits<TEmits>();

function closeModal(): void {
  emit("update:close", false);
}
</script>
