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
          <IonInput v-model="state.form.name" />
        </IonTitle>
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <IonButtons slot="end">
          <IonButton size="small" :strong="true" @click="saveItem()">
            Done
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding">
      <div class="w-full flex justify-center">
        <div class="flex items-center">
          <p class="text-green-500 text-xs" v-text="formatCurrency(totalExpenses)" />
          <p class="text-xs mx-2">
            <span v-text="budgetItem.type === 'income' ? 'received of' : 'spent of'" />
          </p>
          <p class="text-gray-500 text-xs" v-text="formatCurrency(budgetAmount())" />
        </div>
      </div>

      <IonList>
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
      <IonButton
        color="danger"
        size="small"
        expand="full"
        fill="clear"
        @click="deleteBudgetItem()"
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
import { computed, onMounted, PropType, reactive } from "vue";

import {
  BudgetExpenseApi,
  TBudgetExpenseRow,
} from "../../api/budget-expenses/api";
import { TBudgetItem } from "../../api/budget-items/api";
import { BudgetItemApi } from "../../api/budget-items/api";
import { formatCurrency } from "../../api/utils/common";
import { getTotal } from "../../composables/useBudget";
import { useMoneyInput } from "../../composables/useMoneyInput";
import { useToast } from "../../composables/useToast";

const props = defineProps({
  budgetItem: {
    required: true,
    type: Object as PropType<TBudgetItem>,
  },
  open: {
    default: false,
    type: Boolean,
  },
});

type TEmits = {
  "update:close": [void];
  "update:items": [void];
};

const emit = defineEmits<TEmits>();

type TState = {
  expenses: TBudgetExpenseRow[];
  form: {
    amount: string;
    name: string;
  };
  loading: {
    createOrEditBudgetItem: boolean;
    delete: boolean;
  };
};

const budgetExpenseApi: BudgetExpenseApi = new BudgetExpenseApi();
const budgetItemApi: BudgetItemApi = new BudgetItemApi();
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

onMounted(async () => {
  state.expenses = await budgetExpenseApi.getBudgetExpenses({
    id: props.budgetItem.id,
  });
});

const {
  formatAmountToSave,
  formattedAmount,
  handleBlur,
  handleInput,
  handleKeydown,
} = useMoneyInput({
  amountProp: props.budgetItem.budgeted_amount || 0,
  edit: props.open,
  form: state.form,
  nameProp: props.budgetItem.name,
});

const totalExpenses = computed(() => {
  return getTotal(state.expenses.map((expense) => expense.amount));
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

function budgetAmount(): number {
  return props.budgetItem?.budgeted_amount || 0;
}

function closeModal(): void {
  if (state.loading.createOrEditBudgetItem) {
    return;
  }
  emit("update:close");
}

async function saveItem(): Promise<void> {
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
      await presentToast("Please enter a valid budget name at the top", {
        color: "danger",
        placement: "bottom",
      });
    }
    return;
  }

  try {
    const { amount, name } = state.form;
    const inputAmount = formatAmountToSave(amount);
    await budgetItemApi.updateBudgetItem({
      amount: inputAmount,
      id: props.budgetItem.id,
      name,
    });
  } finally {
    state.loading.createOrEditBudgetItem = false;
    emit("update:items");
  }
}

async function deleteBudgetItem(): Promise<void> {
  if (state.loading.delete) return;

  try {
    await budgetItemApi.deleteBudgetItem({
      id: props.budgetItem.id,
    });
  } finally {
    state.loading.delete = false;
    emit("update:items");
  }
}
</script>



