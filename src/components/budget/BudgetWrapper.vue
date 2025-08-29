<template>
  <div>
    <IonHeader>
      <IonToolbar>
        <div class="w-full">
          <IonButton
            id="open-custom-dialog"
            type="button"
            color="primary"
            size="small"
            expand="full"
            shape="round"
          >
            <span v-text="readableMonthYear(state.selectedMonth)" />
          </IonButton>
        </div>
      </IonToolbar>
      <IonToolbar>
        <div class="w-full flex items-center justify-center">
          <IonSegment :value="state.tab" @ion-change="selectTab">
            <IonSegmentButton value="planned">
              <IonLabel>Planned</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="spent">
              <IonLabel>Spent</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="remaining">
              <IonLabel>Remaining</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>
      </IonToolbar>
    </IonHeader>

    <IonModal id="example-modal" ref="modal" trigger="open-custom-dialog">
      <div class="wrapper">
        <IonDatetime
          :value="jsDateToIonMonthYear(state.selectedMonth)"
          presentation="month-year"
          @ion-change="selectMonth"
        />
      </div>
    </IonModal>
    <IonContent fullscreen force-overscroll class="ion-padding">
      <div v-show="state.tab === 'planned'" class="grid grid-cols-2 gap-2">
        <IonCard class="ion-padding">
          <IonCardSubtitle>Income</IonCardSubtitle>
          <IonCardTitle color="success">
            <p v-text="formatCurrency(totalIncome, { showCents: false })" />
          </IonCardTitle>
        </IonCard>
        <IonCard class="ion-padding">
          <IonCardSubtitle>Planned Budget</IonCardSubtitle>
          <IonCardTitle>
            <p v-text="formatCurrency(monthlyBudgetTotal, { showCents: false})" />
          </IonCardTitle>
        </IonCard>
      </div>
      <div v-show="state.tab === 'spent'" class="grid grid-cols-2 gap-2">
        <IonCard class="ion-padding">
          <IonCardSubtitle>Spent So Far</IonCardSubtitle>
          <IonCardTitle :color="overSpentOnTotalIncome ? 'danger' : 'success'">
            <p v-text="formatCurrency(totalExpenses, { showCents: false})" />
          </IonCardTitle>
        </IonCard>
        <IonCard class="ion-padding">
          <IonCardSubtitle>Budget Spent</IonCardSubtitle>
          <IonCardTitle :color="percentageIsOverBudget ? 'danger' : 'success'">
            <p v-text="`${percentageOfBudgetSpent.toFixed(0)}%`" />
          </IonCardTitle>
        </IonCard>
      </div>
      <div v-show="state.tab === 'remaining'" class="grid grid-cols-2 gap-2">
        <IonCard class="ion-padding">
          <IonCardSubtitle>Remaining To Spend</IonCardSubtitle>
          <IonCardTitle>
            <p v-text="formatCurrency(remainingToSpendTotal, { showCents: false})" />
          </IonCardTitle>
        </IonCard>
        <IonCard class="ion-padding">
          <IonCardSubtitle>Budget Spent</IonCardSubtitle>
          <IonCardTitle :color="remainingToSpendTotal < remainingBudgetNotSpentYet ? 'danger' : 'success'">
            <p v-text="formatCurrency(remainingToSpendTotal - remainingBudgetNotSpentYet, { showCents: false})" />
          </IonCardTitle>
        </IonCard>
      </div>

      <div v-if="state.budgetItems.length" class="w-full flex flex-col sm:flex-row sm:gap-4 mt-5">
        <div v-for="group in state.budgetItemGroups" :key="group.type" class="w-full mb-4">
          <IonCard class="ion-padding">
            <IonCardSubtitle>
              <div class="w-full flex justify-between items-center">
                <p class="font-bold text-gray-900" v-text="renderTypeHeader(group.type)" />
                <p class="text-gray-600 text-[10px]" v-text="renderTabTitle(group.type)" />
              </div>
            </IonCardSubtitle>
            <div class="mt-5">
              <ul>
                <li v-for="budgetItem in group.items" :key="budgetItem.id" class="mb-3">
                  <EditBudgetItem :budget-item="budgetItem" :expenses="state.budgetExpenses" :tab="state.tab" @update:refresh="fetchBudgetItems()" />
                </li>
                <li class="w-full">
                  <BudgetItemCreate :month-id="state.budgetMonth.id" :category="group.type" @update:items="fetchBudgetItems()" />
                </li>
              </ul>
            </div>
          </IonCard>
        </div>
      </div>
    </IonContent>
  </div>
</template>

<script lang="ts" setup>
import {
  IonButton,
  IonCard,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonDatetime,
  IonHeader,
  IonLabel,
  IonModal,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
} from "@ionic/vue";
import { DateTime } from "luxon";
import { onMounted, reactive, ref } from "vue";

import {
  BudgetExpenseApi,
  TBudgetExpenseRow,
} from "../../api/budget-expenses/api";
import { BudgetItemApi, TBudgetItem } from "../../api/budget-items/api";
import { renderTypeHeader } from "../../api/budget-items/utils";
import { BudgetMonthApi, TBudgetMonth } from "../../api/budget-months/api";
import { formatCurrency } from "../../api/utils/common";
import { useBudget } from "../../composables/useBudget";
import BudgetItemCreate from "./BudgetItemCreate.vue";
import EditBudgetItem from "./EditBudgetItem.vue";

export type TBudgetGroup = {
  items: TBudgetItem[];
  type: TBudgetItem["type"];
};

type TTab = "planned" | "spent" | "remaining";

type TState = {
  budgetExpenses: TBudgetExpenseRow[];
  budgetItemGroups: TBudgetGroup[];
  budgetItems: TBudgetItem[];
  budgetMonth: TBudgetMonth | null;
  loading: {
    budgetMonth: boolean;
    creatingBudget: boolean;
  };
  search: string | null;
  selectedMonth: Date | null;
  tab: TTab;
};

const modal = ref();
const budgetMonthApi: BudgetMonthApi = new BudgetMonthApi();
const budgetItemApi: BudgetItemApi = new BudgetItemApi();
const expenseApi: BudgetExpenseApi = new BudgetExpenseApi();
const state: TState = reactive({
  budgetExpenses: [],
  budgetItemGroups: [],
  budgetItems: [],
  budgetMonth: null,
  loading: {
    budgetMonth: false,
    creatingBudget: false,
  },
  search: "",
  selectedMonth: null,
  tab: "planned",
});

const {
  monthlyBudgetTotal,
  overSpentOnTotalIncome,
  percentageIsOverBudget,
  percentageOfBudgetSpent,
  remainingBudgetNotSpentYet,
  remainingToSpendTotal,
  totalExpenses,
  totalIncome,
} = useBudget(state);

onMounted(() => {
  setDefaultDate();
});

function selectTab(selected: any): void {
  const value = selected.detail.value as TTab;
  state.tab = value;
}

async function setDefaultDate(): Promise<void> {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  state.selectedMonth = firstOfMonth;
  state.loading.budgetMonth = true;

  try {
    const month = getMonthString(state.selectedMonth);
    const result = await budgetMonthApi.getBudgetMonth({
      month,
      monthId: null,
    });
    if (result) {
      state.budgetMonth = result;
      const items = await budgetItemApi.getBudgetItems(state.budgetMonth.id);
      const expense = await expenseApi.getAllMonthlyExpenses({
        budgetMonthId: result.id,
      });
      state.budgetItems = items;
      state.budgetExpenses = expense;
      state.budgetItemGroups = groupBudgetItems(items);
      state.selectedMonth = DateTime.fromISO(result.month_start).toJSDate();
      console.log("State", state);
    }
  } finally {
    state.loading.budgetMonth = false;
  }
}

function renderTabTitle(type: TBudgetItem["type"]): string {
  const tab = state.tab;
  if (tab === "planned") {
    return "Planned";
  } else if (tab === "spent") {
    if (type === "income") {
      return "Received";
    } else {
      return "Spent";
    }
  } else if (tab === "remaining") {
    return "Remaining";
  }
}

function jsDateToIonMonthYear(
  date: Date,
  opts?: { asUTC?: boolean; fallbackFullDate?: boolean },
) {
  const datetime = (
    opts?.asUTC ? DateTime.fromJSDate(date).toUTC() : DateTime.fromJSDate(date)
  ).startOf("month");
  // Primary: "YYYY-MM" (month-year only)
  const monthYear = datetime.toFormat("yyyy-LL");
  if (!opts?.fallbackFullDate) return monthYear;

  // Fallback
  return datetime.toISODate(); // e.g., "2025-08-01"
}

function getMonthString(date: Date): string {
  return DateTime.fromJSDate(date).toFormat("yyyy-MM-dd");
}

function readableMonthYear(date?: Date) {
  return date
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(date)
    : "";
}

async function selectMonth(selected: any): Promise<void> {
  try {
    state.loading.budgetMonth = true;
    const monthYearString = selected.detail.value;
    const selectedMonth: Date = monthYearToDate(monthYearString);
    state.selectedMonth = selectedMonth;
    const selectedMonthString =
      DateTime.fromJSDate(selectedMonth).toFormat("yyyy-MM-dd");
    const result = await budgetMonthApi.getBudgetMonth({
      month: selectedMonthString,
    });
    if (result) {
      state.budgetMonth = result;
      fetchBudgetItems();
      return;
    }

    state.budgetMonth = null;
    state.budgetItems = [];
  } finally {
    state.loading.budgetMonth = false;
  }
}

async function fetchBudgetItems(): Promise<void> {
  const result = await budgetItemApi.getBudgetItems(state.budgetMonth.id);
  const expenses = await expenseApi.getAllMonthlyExpenses({
    budgetMonthId: state.budgetMonth.id,
  });
  state.budgetExpenses = expenses;
  state.budgetItems = result;
  state.budgetItemGroups = groupBudgetItems(result);
}

function monthYearToDate(value: string): Date {
  const [year, month] = value.split("-").map(Number); // "2025-09" -> [2025, 9]
  return new Date(year, month - 1, 1); // first day of that month (local time)
}

function groupBudgetItems(
  items: TBudgetItem[],
): { items: TBudgetItem[]; type: TBudgetItem["type"] }[] {
  const typeOrder: TBudgetItem["type"][] = [
    "income",
    "savings",
    "housing",
    "transportation",
    "food",
    "personal",
    "lifestyle",
    "health",
    "insurance",
    "debt",
  ];

  const groupMap = new Map<TBudgetItem["type"], TBudgetItem[]>();

  //create empty groups first
  typeOrder.forEach((type) => {
    groupMap.set(type, []);
  });

  items.forEach((item) => {
    groupMap.get(item.type).push(item);
  });

  const normalizedQuery = state.search.trim().toLowerCase();

  return typeOrder
    .map((type) => {
      const groupItems = groupMap.get(type)!;

      const matchesSearch =
        !normalizedQuery ||
        type.toLowerCase().includes(normalizedQuery) || // match category
        groupItems.some((item) =>
          item.name.toLowerCase().includes(normalizedQuery),
        ); // match any item in the group

      return { items: groupItems, matchesSearch, type };
    })
    .filter((group) => !normalizedQuery || group.matchesSearch)
    .map(({ items, type }) => ({ items, type }));
}
</script>
<style>
ion-modal#example-modal {
  --width: fit-content;
  --min-width: 250px;
  --height: fit-content;
  --border-radius: 6px;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
}

ion-modal#example-modal h1 {
  margin: 20px 20px 10px 20px;
}

ion-modal#example-modal ion-icon {
  margin-right: 6px;

  width: 48px;
  height: 48px;

  padding: 4px 0;

  color: #aaaaaa;
}

ion-modal#example-modal .wrapper {
  margin-bottom: 0px;
}
</style>
