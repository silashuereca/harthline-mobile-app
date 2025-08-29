<template>
  <div class="flex items-center justify-between">
    <button v-show="!state.edit" type="button" class="hover:bg-gray-50 cursor-pointer w-full" @click="openBudgetItem()">
      <div class="flex items-center justify-between w-full">
        <p class="text-sm" v-text="budgetItem.name" />
        <p class="text-sm" :class="[isOverBudget && 'text-red-500']" v-text="formatCurrency(renderTabViewForAmount)" />
      </div>
      <IonProgressBar :value="setProgressWidth()" :color="setProgressColor()" />
    </button>

    <BudgetItemSheet
      v-if="state.closeBudgetItemWrapper"
      :open="state.openBudgetItem"
      :budget-item="budgetItem"
      @update:close="closeBudgetItem()"
      @update:items="updateBudgetItems()"
    />
  </div>
</template>

<script lang="ts" setup>
import { IonProgressBar } from "@ionic/vue";
import { computed, PropType, reactive } from "vue";

import { TBudgetExpenseRow } from "../../api/budget-expenses/api";
import { TBudgetItem } from "../../api/budget-items/api";
import { formatCurrency } from "../../api/utils/common";
import { getTotal } from "../../composables/useBudget";
import BudgetItemSheet from "./BudgetItemSheet.vue";

const props = defineProps({
  budgetItem: {
    required: true,
    type: Object as PropType<TBudgetItem>,
  },
  expenses: {
    default: () => [],
    type: Array as PropType<TBudgetExpenseRow[]>,
  },
  tab: {
    required: true,
    type: String as PropType<"planned" | "spent" | "remaining">,
  },
});

type TEmits = {
  "update:refresh": [boolean];
};

const emit = defineEmits<TEmits>();

type TState = {
  closeBudgetItemWrapper: boolean;
  edit: boolean;
  expenseForm: {
    amount: string;
    name: string;
  };
  loading: {
    addExpense: boolean;
    deletingItem: boolean;
  };
  openBudgetItem: boolean;
};

const state: TState = reactive({
  closeBudgetItemWrapper: false,
  edit: false,
  expenseForm: {
    amount: "",
    name: "",
  },
  loading: {
    addExpense: false,
    deletingItem: false,
  },
  openBudgetItem: false,
});

const getExpenses = computed(() => {
  const expenses = props.expenses.filter(
    (expense) => expense.budget_item_id === props.budgetItem.id,
  );
  return expenses;
});

const getExpensePercentage = computed(() => {
  const total = getTotal(getExpenses.value.map((expense) => expense.amount));
  const budgetedAmount = props.budgetItem.budgeted_amount;
  if (total === 0 || budgetedAmount === 0) return 0;
  return (total / budgetedAmount) * 100;
});

const renderTabViewForAmount = computed(() => {
  if (props.tab === "planned") {
    return props.budgetItem.budgeted_amount;
  } else if (props.tab === "spent") {
    return getTotal(getExpenses.value.map((expense) => expense.amount));
  } else if (props.tab === "remaining") {
    return (
      props.budgetItem.budgeted_amount -
      getTotal(getExpenses.value.map((expense) => expense.amount))
    );
  }
  return 0;
});

const getProgressPercentage = computed(() => {
  if (props.tab === "planned") {
    return getExpensePercentage.value;
  } else if (props.tab === "spent") {
    return getExpensePercentage.value;
  }
  return getRemainingPercentage();
});

function openBudgetItem(): void {
  state.closeBudgetItemWrapper = true;
  state.openBudgetItem = true;
}

function closeBudgetItem(): void {
  state.openBudgetItem = false;
  setTimeout(() => {
    state.closeBudgetItemWrapper = false;
  }, 200);
}

function updateBudgetItems(): void {
  closeBudgetItem();
  emit("update:refresh", true);
}

function getRemainingPercentage(): number {
  const total = getTotal(getExpenses.value.map((expense) => expense.amount));
  const budgetedAmount = props.budgetItem.budgeted_amount;
  if (total === 0 || budgetedAmount === 0) return 0;
  return ((budgetedAmount - total) / budgetedAmount) * 100;
}

function setProgressColor(): string {
  if (isOverBudget.value) return "danger";
  const percentage = getExpensePercentage.value;
  if (percentage > 0) return "success";
  return "default";
}

function setProgressWidth(): number {
  const percentage = getProgressPercentage.value;
  const percentageWidth = getProgressPercentage.value;
  if (percentage >= 100 || percentage === 0) return 100;
  if (percentage === 0) return percentage;

  const minVisibleWidth = 10;
  if (percentage < minVisibleWidth) {
    return minVisibleWidth;
  }
  return percentageWidth;
}

const isOverBudget = computed(() => {
  return getExpensePercentage.value > 100;
});
</script>

<style>
ion-popover {
  --backdrop-opacity: 0.6;
  --box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.6);
  --color: white;
  --width: 100px;
}
</style>
