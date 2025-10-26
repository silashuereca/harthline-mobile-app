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
        class="mt-2"
        color="primary"
        size="small"
        expand="full"
        fill="outline"
        @click="quickCreateExpense()"
      >
        Quick Expense
      </IonButton>
      <IonButton
        color="danger"
        size="small"
        expand="full"
        fill="clear"
        @click="deleteBudgetItem()"
      >
        Delete
      </IonButton>

      <IonCard v-show="state.expenses.length" class="ion-padding mt-5">
        <p class="text-center">
          Expenses
        </p>
        <div v-show="state.expenses.length">
          <button v-for="expense in state.expenses" :key="expense.id" class="w-full" @click="editExpense(expense)">
            <div class="grid grid-cols-2 gap-2 border-b border-gray-200 dark:border-white mb-2 py-2">
              <div class="text-left">
                <p class="text-black dark:text-white font-medium" v-text="expense.name" />
                <p class="text-gray-500 text-xs mt-1" v-text="formatDate(expense.created_at)" />
              </div>
              <div class="flex items-center justify-end">
                <p class="text-black dark:text-white" v-text="formatCurrency(expense.amount)" />
              </div>
            </div>
          </button>
        </div>
      </IonCard>
    </IonContent>
    <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
    <IonFab slot="fixed" vertical="bottom" horizontal="end">
      <IonFabButton @click="createExpense()">
        <IonIcon :icon="add" />
      </IonFabButton>
    </IonFab>

    <ExpenseItemEdit
      v-if="state.closeExpenseWrapper"
      :open="state.openExpense"
      :expense="state.selectedExpense"
      @update:close="closeExpenseModal"
      @update:expenses="fetchExpenses"
    />

    <ExpenseCreate
      :open="state.openCreateExpense"
      :month-id="budgetItem.budget_month_id"
      :budget-item-id="budgetItem.id"
      :prefill-amount="state.prefillExpense?.amount ?? null"
      :prefill-name="state.prefillExpense?.name ?? null"
      @update:close="closeExpenseModal"
      @update:expenses="fetchExpenses"
    />
  </IonModal>
</template>

<script lang="ts" setup>
import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { add } from "ionicons/icons";
import { computed, onMounted, PropType, reactive } from "vue";

import {
  BudgetExpenseApi,
  TBudgetExpenseRow,
} from "../../api/budget-expenses/api";
import { TBudgetItem } from "../../api/budget-items/api";
import { BudgetItemApi } from "../../api/budget-items/api";
import { formatCurrency, formatDate } from "../../api/utils/common";
import { useActionSheet } from "../../composables/useActionSheet";
import { getTotal } from "../../composables/useBudget";
import { useMoneyInput } from "../../composables/useMoneyInput";
import { useToast } from "../../composables/useToast";
import ExpenseCreate from "./ExpenseCreate.vue";
import ExpenseItemEdit from "./ExpenseItemEdit.vue";

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
  closeExpenseWrapper: boolean;
  expenses: TBudgetExpenseRow[];
  form: {
    amount: string;
    name: string;
  };
  loading: {
    createOrEditBudgetItem: boolean;
    delete: boolean;
  };
  openCreateExpense: boolean;
  openExpense: boolean;
  prefillExpense: {
    amount: number;
    name: string;
  } | null;
  selectedExpense: TBudgetExpenseRow | null;
};

const { confirmDelete } = useActionSheet();
const budgetExpenseApi: BudgetExpenseApi = new BudgetExpenseApi();
const budgetItemApi: BudgetItemApi = new BudgetItemApi();
const { presentToast } = useToast();
const state: TState = reactive({
  closeExpenseWrapper: null,
  expenses: [],
  form: {
    amount: "",
    name: "",
  },
  loading: {
    createOrEditBudgetItem: false,
    delete: false,
  },
  openCreateExpense: false,
  openExpense: false,
  prefillExpense: null,
  selectedExpense: null,
});

onMounted(() => {
  fetchExpenses();
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

function closeExpenseModal(): void {
  state.openExpense = false;
  state.openCreateExpense = false;
  state.prefillExpense = null;

  setTimeout(() => {
    state.closeExpenseWrapper = false;
    state.selectedExpense = null;
  }, 300);
}

async function fetchExpenses(): Promise<void> {
  state.expenses = await budgetExpenseApi.getBudgetExpenses({
    id: props.budgetItem.id,
  });
  state.selectedExpense = null;
  state.openExpense = false;
  state.openCreateExpense = false;
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
  const confirmAction = await confirmDelete();
  if (!confirmAction) return;

  try {
    await budgetItemApi.deleteBudgetItem({
      id: props.budgetItem.id,
    });
  } finally {
    state.loading.delete = false;
    emit("update:items");
  }
}

function createExpense(): void {
  state.prefillExpense = null;
  state.openCreateExpense = true;
}

function editExpense(expense: TBudgetExpenseRow): void {
  state.selectedExpense = expense;
  state.openExpense = true;
  state.closeExpenseWrapper = true;
}

function quickCreateExpense(): void {
  state.prefillExpense = {
    amount: props.budgetItem?.budgeted_amount ?? 0,
    name: props.budgetItem?.name ?? "",
  };
  state.openCreateExpense = true;
}
</script>

<style>
ion-fab {
  margin-bottom: var(--ion-safe-area-bottom, 0);
}
</style>
