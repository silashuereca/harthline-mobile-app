<template>
  <div class="w-full">
    <IonButton
      label="Add Item"
      size="small"
      fill="clear"
      color="primary"
      @click="openModal()"
    >
      Add Item
    </IonButton>
  </div>

  <IonModal :is-open="state.open" :backdrop-dismiss="false">
    <IonHeader>
      <IonToolbar>
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <IonButtons slot="start">
          <IonButton size="small" @click="closeModal()">
            Cancel
          </IonButton>
        </IonButtons>
        <IonTitle>
          Create Budget Item
        </IonTitle>
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <IonButtons slot="end">
          <IonButton size="small" :strong="true" @click="createItem()">
            Done
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding">
      <IonList>
        <IonInput v-model="state.form.name" placeholder="Enter budget name" label="Budget Name" label-placement="stacked" />
        <IonInput
          :value="formattedAmount"
          type="text"
          inputmode="numeric"
          placeholder="Enter budget item amount"
          label="Budget Amount"
          label-placement="stacked"
          error-text="Required"
          @ion-blur="handleBlur"
          @ion-input="handleInput"
          @keydown.enter="handleKeydown"
        />
      </IonList>
    </IonContent>
  </IonModal>
</template>

<script lang="ts" setup>
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { computed, PropType, reactive } from "vue";

import { BudgetItemApi, TBudgetItemCategory } from "../../api/budget-items/api";
import { useMoneyInput } from "../../composables/useMoneyInput";
import { useToast } from "../../composables/useToast";

const props = defineProps({
  category: {
    default: "",
    required: true,
    type: String as PropType<TBudgetItemCategory>,
  },
  monthId: {
    default: "",
    required: true,
    type: String,
  },
});

type TEmits = {
  "update:items": [void];
};

const emit = defineEmits<TEmits>();

type TState = {
  form: {
    amount: string;
    name: string;
  };
  loading: {
    createOrEditBudgetItem: boolean;
  };
  open: boolean;
};

const budgetItemApi: BudgetItemApi = new BudgetItemApi();
const { presentToast } = useToast();
const state: TState = reactive({
  form: {
    amount: "",
    name: "",
  },
  loading: {
    createOrEditBudgetItem: false,
  },
  open: false,
});

const {
  formatAmountToSave,
  formattedAmount,
  handleBlur,
  handleInput,
  handleKeydown,
} = useMoneyInput({
  amountProp: 0,
  edit: true,
  form: state.form,
  nameProp: "",
});

const rules = computed(() => {
  const validations = {
    state: {
      form: {
        amount: { required },
        name: { required },
      },
    },
  };

  return validations;
});

const $v: any = useVuelidate(rules, { state });

function openModal(): void {
  state.open = true;
}

function closeModal(): void {
  state.open = false;
}

async function createItem(): Promise<void> {
  if (state.loading.createOrEditBudgetItem) {
    return;
  }

  const valid = await $v.value.$validate();
  if (!valid) {
    if ($v.value.state.form.amount.$error) {
      await presentToast("Please enter a valid amount", {
        color: "danger",
        placement: "bottom",
      });
    }

    if ($v.value.state.form.name.$error) {
      await presentToast("Please enter a valid budget name", {
        color: "danger",
        placement: "bottom",
      });
    }

    return;
  }

  try {
    const { amount, name } = state.form;
    const inputAmount = formatAmountToSave(amount);
    await budgetItemApi.createBudgetItem({
      amount: inputAmount,
      category: props.category,
      monthId: props.monthId,
      name,
    });
  } finally {
    state.loading.createOrEditBudgetItem = false;
    state.open = false;
    emit("update:items");
  }
}
</script>



