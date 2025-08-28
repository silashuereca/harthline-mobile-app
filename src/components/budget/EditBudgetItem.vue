<template>
  <div class="flex items-center justify-between">
    <button v-show="!state.edit" type="button" class="hover:bg-gray-50 cursor-pointer w-full" @click="viewExpenses()">
      <div class="flex items-center justify-between w-full">
        <p class="text-sm" v-text="budgetItem.name" />
        <p class="text-sm" :class="[isOverBudget && 'text-red-500']" v-text="formatCurrency(renderTabViewForAmount)" />
      </div>
      <IonProgressBar :value="setProgressWidth()" :color="setProgressColor()" />
    </button>

    <button :id="`budget-${budgetItem.id}`" class="ml-2" @click="openPopover()">
      <IonIcon :icon="ellipsisVertical" />
    </button>

    <IonPopover :trigger="`budget-${budgetItem.id}`" :is-open="state.openPopover" @did-dismiss="handlePopoverDismiss">
      <div class="flex flex-col ion-padding">
        <IonButton
          size="small"
          color="secondary"
          @click="editBudgetItem"
        >
          Edit
        </IonButton>
        <IonButton
          class="mt-4"
          size="small"
          color="success"
          @click="showQuickExpenseModal"
        >
          Quick
        </IonButton>
        <IonButton
          class="mt-4"
          size="small"
          color="danger"
          @click="deleteBudgetItem"
        >
          Delete
        </IonButton>
      </div>
    </IonPopover>

    <BudgetItemForm :open="state.edit || state.showQuickExpenseModal" @update:close="handleFormClose()" />
  </div>
</template>

<script lang="ts" setup>
import { IonButton, IonIcon, IonPopover, IonProgressBar } from "@ionic/vue";
import { ellipsisVertical } from "ionicons/icons";
import { computed, PropType, reactive } from "vue";

import { TBudgetExpenseRow } from "../../api/budget-expenses/api";
import { TBudgetItem } from "../../api/budget-items/api";
import { formatCurrency } from "../../api/utils/common";
import { getTotal } from "../../composables/useBudget";
import BudgetItemForm from "./BudgetItemForm.vue";

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

type TState = {
  edit: boolean;
  expenseForm: {
    amount: string;
    name: string;
  };
  loading: {
    addExpense: boolean;
    deletingItem: boolean;
  };
  openPopover: boolean;
  showQuickExpenseModal: boolean;
};

const state: TState = reactive({
  edit: false,
  expenseForm: {
    amount: "",
    name: "",
  },
  loading: {
    addExpense: false,
    deletingItem: false,
  },
  openPopover: false,
  showQuickExpenseModal: false,
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

function handleFormClose(): void {
  state.edit = false;
  state.showQuickExpenseModal = false;
}

function openPopover(): void {
  state.openPopover = true;
}

function handlePopoverDismiss(): void {
  state.openPopover = false;
}

function editBudgetItem(): void {
  state.edit = true;
  state.openPopover = false;
}
function deleteBudgetItem(): void {}
function showQuickExpenseModal(): void {}

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

function viewExpenses(): void {
  console.log("View Expenses");
}
</script>

<style>
ion-popover {
  --backdrop-opacity: 0.6;
  --box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.6);
  --color: white;
  --width: 100px;
}
</style>
