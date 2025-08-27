<template>
  <div>
    <IonHeader>
      <IonToolbar>
        <IonButton
          id="open-custom-dialog"
          type="button"
          color="dark"
          size="small"
          expand="full"
        >
          <span v-text="getMonthString(state.selectedMonth)" />
        </IonButton>
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



    <div class="w-full flex items-center justify-center">
      <IonSegment value="planned">
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
  </div>
</template>

<script lang="ts" setup>
import {
  IonButton,
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
import { useRoute } from "vue-router";

import {
  BudgetExpenseApi,
  TBudgetExpenseRow,
} from "../../api/budget-expenses/api";
import { BudgetItemApi, TBudgetItem } from "../../api/budget-items/api";
import { BudgetMonthApi, TBudgetMonth } from "../../api/budget-months/api";

export type TBudgetGroup = {
  items: TBudgetItem[];
  type: TBudgetItem["type"];
};

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
};

const modal = ref();
const budgetMonthApi: BudgetMonthApi = new BudgetMonthApi();
const budgetItemApi: BudgetItemApi = new BudgetItemApi();
const expenseApi: BudgetExpenseApi = new BudgetExpenseApi();
const route = useRoute();
const houseId = route.params.houseId as string;
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
});

onMounted(() => {
  console.log("House Id", houseId);
  setDefaultDate();
});

async function setDefaultDate(): Promise<void> {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  state.selectedMonth = firstOfMonth;
  state.loading.budgetMonth = true;
  try {
    const month = getMonthString(state.selectedMonth);
    const result = await budgetMonthApi.getBudgetMonth({
      month,
      monthId: route.params.id as string,
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
      // router.replace({
      //   name: "budget-month",
      //   params: { id: result.id },
      // });
    } else {
      // router.replace({
      //   name: "budget",
      // });
    }
  } finally {
    state.loading.budgetMonth = false;
  }
}

function jsDateToIonMonthYear(
  date: Date,
  opts?: { asUTC?: boolean; fallbackFullDate?: boolean },
) {
  const dt = (
    opts?.asUTC ? DateTime.fromJSDate(date).toUTC() : DateTime.fromJSDate(date)
  ).startOf("month");
  // Primary: "YYYY-MM" (month-year only)
  const monthYear = dt.toFormat("yyyy-LL");
  if (!opts?.fallbackFullDate) return monthYear;

  // Fallback: full ISO date at first of month ("YYYY-MM-01")
  return dt.toISODate(); // e.g., "2025-08-01"
}

function getMonthString(date: Date): string {
  return DateTime.fromJSDate(date).toFormat("yyyy-MM-dd");
}

function selectMonth(selected: any): void {
  const selectedDate = selected.detail.value;
  state.selectedMonth = selectedDate;
}

function getMonthAndYear(dateString: string | null): string {
  if (!dateString) {
    return "";
  }
  const date = DateTime.fromISO(dateString);
  return `${date.toFormat("MMMM")} ${date.toFormat("yyyy")}`;
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
