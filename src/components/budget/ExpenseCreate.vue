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
          Create Expense
        </IonTitle>
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <IonButtons slot="end">
          <IonButton size="small" :strong="true" @click="createExpense()">
            Done
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding">
      <IonList>
        <IonInput v-model="state.form.name" label="Expense Name" placeholder="Enter expense name" label-placement="stacked" />
        <InputValidation :errors="$v.state?.form?.name?.$errors" />
        <IonInput
          :value="formattedAmount"
          type="text"
          inputmode="numeric"
          placeholder="Enter budget item amount"
          label="Expense Amount"
          label-placement="stacked"
          error-text="Required"
          @ion-blur="handleBlur"
          @ion-input="handleInput"
          @keydown.enter="handleKeydown"
        />
        <InputValidation :errors="$v.state?.form?.amount?.$errors" />
      </IonList>

      <p v-show="Boolean(state.splitTransaction)" class="mt-1 text-gray-400 text-sm">
        Split
      </p>

      <IonList v-if="Boolean(state.splitTransaction)">
        <IonSelect
          class="always-flip w-full"
          placeholder="Select Budget Item"
          label="Budget Item"
          label-placement="stacked"
        >
          <IonSelectOption v-for="item in state.budgetItems" :key="item.id" :value="item.id">
            <span v-text="item.name" />
          </IonSelectOption>
        </IonSelect>
        <InputValidation :errors="$v.state.splitTransaction?.budgetItemId?.$errors" />

        <IonInput v-model="state.splitTransaction.name" label="Expense Name" placeholder="Enter expense name" label-placement="stacked" />
        <InputValidation :errors="$v.state.splitTransaction?.name?.$errors" />
        <IonInput
          :value="formattedSplitAmount"
          type="text"
          inputmode="numeric"
          placeholder="Enter budget item amount"
          label="Expense Amount"
          label-placement="stacked"
          error-text="Required"
          @keydown="handleKeydown"
          @input="handleSplitInputAmount"
          @blur="handleSplitInputAmountBlur"
        />
        <InputValidation :errors="$v.state.splitTransaction?.amount?.$errors" />
      </IonList>

      <IonButton
        v-show="!Boolean(state.splitTransaction)"
        color="danger"
        size="small"
        expand="full"
        fill="clear"
        @click="splitTransaction()"
      >
        Split
      </IonButton>

      <IonButton
        v-show="Boolean(state.splitTransaction)"
        color="dark"
        size="small"
        expand="full"
        fill="clear"
        shape="round"
        @click="cancelSplit()"
      >
        Cancel Split
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

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      const budgetItems = await budgetItemApi.getBudgetItems(props.monthId);
      state.budgetItems = budgetItems.sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      setPrefillFields();
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

  if (state.splitTransaction !== null) {
    validations.state.splitTransaction.budgetItemId = { required };
    validations.state.splitTransaction.name = { required };
  } else {
    validations.state.splitTransaction.budgetItemId = {};
  }

  return validations;
});

const $v: any = useVuelidate(rules, { state });

const formattedSplitAmount: ComputedRef<string> = computed(() => {
  const value = state.splitTransaction.amount.padStart(3, "0");
  const dollars = value.slice(0, -2);
  const cents = value.slice(-2);
  return `$${parseInt(dollars, 10).toLocaleString()}.${cents}`;
});

function handleSplitInputAmount(event: Event): void {
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
  state.splitTransaction = null;
  $v.value.$reset();
  emit("update:close");
}

function cancelSplit(): void {
  state.splitTransaction = null;
  $v.value.$reset();
}

function splitTransaction(): void {
  const formAmount = formatAmountToSave(state.form.amount);
  state.splitTransaction = {
    amount: "",
    budgetItemId: null,
    name: state.form.name,
  };

  if (formAmount > 0) {
    state.splitTransaction.amount = formatAmountOnMount(formAmount / 2);
    state.form.amount = formatAmountOnMount(formAmount / 2);
  }
}

async function createExpense(): Promise<void> {
  if (state.loading.createOrEditBudgetItem || state.loading.delete) {
    return;
  }

  const valid = await $v.value.$validate();
  if (!valid) return;

  try {
    const { amount, name } = state.form;
    const inputAmount = formatAmountToSave(amount);
    await budgetExpenseApi.createBudgetExpense({
      amount: inputAmount,
      budget_item_id: props.budgetItemId,
      budget_month_id: props.monthId,
      name,
    });

    if (state.splitTransaction) {
      await budgetExpenseApi.createBudgetExpense({
        amount: formatAmountToSave(state.splitTransaction.amount),
        budget_item_id: state.splitTransaction.budgetItemId,
        budget_month_id: props.monthId,
        name: state.splitTransaction.name,
      });
    }
  } finally {
    state.loading.createOrEditBudgetItem = false;
    emit("update:expenses");
  }
}
</script>

<style>
.ion-select {
  width: 100%;
}
</style>
