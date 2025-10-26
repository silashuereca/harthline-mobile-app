<template>
  <IonModal :is-open="open" :backdrop-dismiss="false">
    <IonHeader>
      <IonToolbar>
        <IonTitle>
          Add Expense
        </IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding">
      <div class="flex flex-col gap-6 pb-14">
        <section class="flex flex-col gap-1">
          <p class="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Adding to
          </p>
          <p class="text-xl font-semibold text-gray-900 dark:text-white" v-text="currentBudgetName" />
          <p v-if="formattedBudgetAmount" class="text-sm text-gray-500 dark:text-gray-400 flex gap-1">
            Budgeted
            <span v-text="formattedBudgetAmount" />
          </p>
        </section>

        <section class="rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white dark:bg-neutral-900 p-4">
          <IonList lines="none">
            <IonInput v-model="state.form.name" label="Expense name" placeholder="What did you spend on?" label-placement="stacked" />
            <InputValidation :errors="$v.state?.form?.name?.$errors" />
            <IonInput
              :value="formattedAmount"
              type="text"
              inputmode="numeric"
              placeholder="Enter expense amount"
              label="Amount"
              label-placement="stacked"
              error-text="Required"
              @ion-blur="handleBlur"
              @ion-input="handleInput"
              @keydown.enter="handleKeydown"
            />
            <InputValidation :errors="$v.state?.form?.amount?.$errors" />
          </IonList>
        </section>

        <section class="flex flex-col">
          <p class="text-base font-semibold mb-2">
            Split this expense?
          </p>
          <IonSegment v-model="state.mode" mode="md">
            <IonSegmentButton value="single">
              <IonLabel>Single</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="split" :disabled="!splitOptions.length">
              <IonLabel>Split</IonLabel>
            </IonSegmentButton>
          </IonSegment>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Keep track of shared purchases by splitting the total between budget items.
          </p>
          <p v-if="state.mode === 'split' && !splitOptions.length" class="mt-1 text-xs text-amber-500">
            Add another budget item first to enable splitting.
          </p>

          <div v-if="state.mode === 'split' && splitOptions.length" class="mt-4 rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white dark:bg-neutral-900 p-4">
            <IonList lines="none">
              <IonSelect
                v-model="state.splitTransaction.budgetItemId"
                class="always-flip w-full"
                placeholder="Select budget item"
                label="Budget item"
                label-placement="stacked"
              >
                <IonSelectOption v-for="item in splitOptions" :key="item.id" :value="item.id">
                  <span v-text="item.name" />
                </IonSelectOption>
              </IonSelect>
              <InputValidation :errors="$v.state.splitTransaction?.budgetItemId?.$errors" />

              <IonInput v-model="state.splitTransaction.name" label="Second expense name" placeholder="Enter expense name" label-placement="stacked" />
              <InputValidation :errors="$v.state.splitTransaction?.name?.$errors" />
              <IonInput
                :value="formattedSplitAmount"
                type="text"
                inputmode="numeric"
                placeholder="Enter split amount"
                label="Split amount"
                label-placement="stacked"
                error-text="Required"
                @ion-blur="handleSplitInputAmountBlur"
                @ion-input="handleSplitInputAmount"
                @keydown="handleKeydown"
              />
              <InputValidation :errors="$v.state.splitTransaction?.amount?.$errors" />
            </IonList>
          </div>
        </section>
      </div>
    </IonContent>
    <IonFooter>
      <IonToolbar>
        <div class="flex w-full justify-between px-2">
          <IonButton expand="block" fill="clear" color="medium" @click="closeModal()">
            Cancel
          </IonButton>
          <IonButton
            expand="block"
            :strong="true"
            :disabled="state.loading.createOrEditBudgetItem"
            @click="createExpense()"
          >
            Save Expense
          </IonButton>
        </div>
      </IonToolbar>
    </IonFooter>
  </IonModal>
</template>

<script lang="ts" setup>
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonLabel,
  IonList,
  IonModal,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { computed, ComputedRef, PropType, reactive, watch } from "vue";

import { BudgetExpenseApi } from "../../api/budget-expenses/api";
import { BudgetItemApi, TBudgetItem } from "../../api/budget-items/api";
import { formatCurrency } from "../../api/utils/common";
import { useMoneyInput } from "../../composables/useMoneyInput";
import InputValidation from "../InputValidation.vue";

const props = defineProps({
  budgetItemId: {
    required: true,
    type: String,
  },
  monthId: {
    required: true,
    type: String,
  },
  open: {
    default: false,
    type: Boolean,
  },
  prefillAmount: {
    default: null,
    type: Number as PropType<number | null>,
  },
  prefillName: {
    default: null,
    type: String as PropType<string | null>,
  },
});

type TEmits = {
  "update:close": [void];
  "update:expenses": [void];
};

const emit = defineEmits<TEmits>();

type TExpenseMode = "single" | "split";

type TState = {
  budgetItems: TBudgetItem[];
  form: {
    amount: string;
    name: string;
  };
  loading: {
    createOrEditBudgetItem: boolean;
    delete: boolean;
  };
  mode: TExpenseMode;
  splitTransaction: {
    amount: string;
    budgetItemId: string;
    name: string;
  } | null;
};

const budgetItemApi: BudgetItemApi = new BudgetItemApi();
const budgetExpenseApi: BudgetExpenseApi = new BudgetExpenseApi();
const state: TState = reactive({
  budgetItems: [],
  form: {
    amount: "",
    name: "",
  },
  loading: {
    createOrEditBudgetItem: false,
    delete: false,
  },
  mode: "single",
  splitTransaction: null,
});

const {
  formatAmountOnMount,
  formatAmountToSave,
  formattedAmount,
  handleBlur,
  handleDigitsOnly,
  handleInput,
  handleKeydown,
} = useMoneyInput({
  amountProp: 0,
  edit: true,
  form: state.form,
  nameProp: "",
});

const currentBudgetItem = computed(() => {
  return (
    state.budgetItems.find((item) => item.id === props.budgetItemId) ?? null
  );
});

const currentBudgetName = computed(() => {
  return currentBudgetItem.value?.name ?? "Expense";
});

const formattedBudgetAmount = computed(() => {
  if (!currentBudgetItem.value) return "";
  return formatCurrency(currentBudgetItem.value.budgeted_amount ?? 0);
});

const splitOptions = computed(() => {
  return state.budgetItems.filter((item) => item.id !== props.budgetItemId);
});

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      resetForm(false);
      const budgetItems = await budgetItemApi.getBudgetItems(props.monthId);
      state.budgetItems = budgetItems.sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      setPrefillFields();
    } else {
      resetForm(true);
    }
  },
);

watch(
  () => [props.prefillAmount, props.prefillName],
  () => {
    if (props.open) {
      setPrefillFields();
    }
  },
);

function setPrefillFields(): void {
  $v.value.$reset();
  state.mode = "single";
  if (props.prefillName !== null && props.prefillName !== undefined) {
    state.form.name = props.prefillName;
  }
  if (props.prefillAmount !== null && props.prefillAmount !== undefined) {
    state.form.amount = formatAmountOnMount(props.prefillAmount);
  }
  if (state.splitTransaction) {
    state.splitTransaction = null;
  }
}

watch(
  () => state.mode,
  (mode) => {
    if (mode === "split") {
      if (!splitOptions.value.length) {
        state.mode = "single";
        return;
      }
      activateSplitTransaction();
    }

    if (mode === "single" && state.splitTransaction) {
      state.splitTransaction = null;
      $v.value.$reset();
    }
  },
);

const rules = computed(() => {
  if (!props.open) return {};

  const validations = {
    state: {
      form: {
        amount: { required },
        name: { required },
      },
      splitTransaction: {
        budgetItemId: {},
        name: {},
      },
    },
  };

  if (state.splitTransaction !== null && state.mode === "split") {
    validations.state.splitTransaction.budgetItemId = { required };
    validations.state.splitTransaction.name = { required };
  } else {
    validations.state.splitTransaction.budgetItemId = {};
  }

  return validations;
});

const $v: any = useVuelidate(rules, { state });

const formattedSplitAmount: ComputedRef<string> = computed(() => {
  if (!state.splitTransaction) {
    return "$0.00";
  }
  const value = state.splitTransaction.amount.padStart(3, "0");
  const dollars = value.slice(0, -2);
  const cents = value.slice(-2);
  return `$${parseInt(dollars, 10).toLocaleString()}.${cents}`;
});

function handleSplitInputAmount(event: Event): void {
  if (!state.splitTransaction) return;
  const digitsOnly = handleDigitsOnly(event);
  state.splitTransaction.amount = digitsOnly;
}

function handleSplitInputAmountBlur(): void {
  if (state.splitTransaction && state.splitTransaction.amount === "") {
    state.splitTransaction.amount = "0";
  }
}

function closeModal(): void {
  if (state.loading.createOrEditBudgetItem) {
    return;
  }
  resetForm(true);
  emit("update:close");
}

function activateSplitTransaction(): void {
  if (state.splitTransaction) return;
  const formAmount =
    state.form.amount !== "" ? formatAmountToSave(state.form.amount) : 0;

  state.splitTransaction = {
    amount: "",
    budgetItemId: "",
    name: state.form.name,
  };

  if (Number.isFinite(formAmount) && formAmount > 0) {
    const splitValue = formatAmountOnMount(formAmount / 2);
    state.splitTransaction.amount = splitValue;
    state.form.amount = splitValue;
  }
}

function resetForm(clearBudgetItems: boolean): void {
  state.form.amount = "";
  state.form.name = "";
  state.mode = "single";
  state.splitTransaction = null;
  state.loading.createOrEditBudgetItem = false;
  state.loading.delete = false;
  if (clearBudgetItems) {
    state.budgetItems = [];
  }
  $v.value?.$reset();
}

async function createExpense(): Promise<void> {
  if (state.loading.createOrEditBudgetItem || state.loading.delete) {
    return;
  }

  const valid = await $v.value.$validate();
  if (!valid) return;

  try {
    state.loading.createOrEditBudgetItem = true;
    const { amount, name } = state.form;
    const inputAmount = formatAmountToSave(amount);
    await budgetExpenseApi.createBudgetExpense({
      amount: inputAmount,
      budget_item_id: props.budgetItemId,
      budget_month_id: props.monthId,
      name,
    });

    if (state.mode === "split" && state.splitTransaction) {
      await budgetExpenseApi.createBudgetExpense({
        amount: formatAmountToSave(state.splitTransaction.amount),
        budget_item_id: state.splitTransaction.budgetItemId,
        budget_month_id: props.monthId,
        name: state.splitTransaction.name,
      });
    }
  } finally {
    state.loading.createOrEditBudgetItem = false;
    resetForm(false);
    emit("update:expenses");
  }
}
</script>
