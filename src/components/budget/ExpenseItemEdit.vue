<template>
  <IonModal :is-open="open" :backdrop-dismiss="false">
    <IonHeader>
      <IonToolbar>
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <IonButtons slot="start">
          <IonButton size="small" @click="closeModal()">
            Cancel
          </IonButton>
        </IonButtons>
        <IonTitle>
          Edit Expense
        </IonTitle>
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <IonButtons slot="end">
          <IonButton size="small" :strong="true" @click="saveExpense()">
            Done
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding">
      <IonList>
        <IonInput v-model="state.form.name" label="Expense Name" label-placement="stacked" />
        <IonInput
          :value="formattedAmount"
          type="text"
          inputmode="numeric"
          placeholder="Enter expense item amount"
          label="Expense Amount"
          label-placement="stacked"
          error-text="Required"
          @ion-blur="handleBlur"
          @ion-input="handleInput"
          @keydown.enter="handleKeydown"
        />
      </IonList>
  
      <IonButton
        color="danger"
        size="small"
        expand="full"
        fill="clear"
        @click="deleteExpense()"
      >
        Delete
      </IonButton>
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

import {
  BudgetExpenseApi,
  TBudgetExpenseRow,
} from "../../api/budget-expenses/api";
import { useActionSheet } from "../../composables/useActionSheet";
import { useMoneyInput } from "../../composables/useMoneyInput";
import { useToast } from "../../composables/useToast";

const props = defineProps({
  expense: {
    default: null,
    required: true,
    type: Object as PropType<TBudgetExpenseRow | null>,
  },
  open: {
    default: false,
    type: Boolean,
  },
});

type TEmits = {
  "update:close": [void];
  "update:expenses": [void];
};

const emit = defineEmits<TEmits>();

type TState = {
  form: {
    amount: string;
    name: string;
  };
  loading: {
    createOrEditBudgetItem: boolean;
    delete: boolean;
  };
};

const { confirmDelete } = useActionSheet();
const budgetExpenseApi: BudgetExpenseApi = new BudgetExpenseApi();
const { presentToast } = useToast();
const state: TState = reactive({
  expenses: [],
  form: {
    amount: "",
    name: "",
  },
  loading: {
    createOrEditBudgetItem: false,
    delete: false,
  },
});

const {
  formatAmountToSave,
  formattedAmount,
  handleBlur,
  handleInput,
  handleKeydown,
} = useMoneyInput({
  amountProp: props.expense.amount,
  edit: props.open,
  form: state.form,
  nameProp: props.expense.name,
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

function closeModal(): void {
  if (state.loading.createOrEditBudgetItem) {
    return;
  }
  emit("update:close");
}

async function saveExpense(): Promise<void> {
  if (state.loading.createOrEditBudgetItem || state.loading.delete) {
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
      await presentToast("Please enter a valid expense name", {
        color: "danger",
        placement: "bottom",
      });
    }
    return;
  }

  try {
    const { amount, name } = state.form;
    const inputAmount = formatAmountToSave(amount);
    await budgetExpenseApi.updateBudgetExpense({
      amount: inputAmount,
      id: props.expense.id,
      name,
    });
  } finally {
    state.loading.createOrEditBudgetItem = false;
    emit("update:expenses");
  }
}

async function deleteExpense(): Promise<void> {
  if (state.loading.delete) return;
  const confirmAction = await confirmDelete();

  if (!confirmAction) return;

  try {
    await budgetExpenseApi.deleteBudgetExpense({
      id: props.expense.id,
    });
  } finally {
    state.loading.delete = false;
    emit("update:expenses");
  }
}
</script>



