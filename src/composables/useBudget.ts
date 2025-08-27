import { computed, ComputedRef } from "vue";

import { TBudgetExpenseRow } from "../api/budget-expenses/api";
import { TBudgetItem } from "../api/budget-items/api";

export type TBudget = {
  budgetExpenses: TBudgetExpenseRow[];
  budgetItems: TBudgetItem[];
};

export function getTotal(amounts: number[]): number {
  return amounts.reduce((acc, amount) => acc + amount, 0);
}

export function useBudget(state: TBudget): {
  isNegativeBudget: ComputedRef<boolean>;
  leftToBudget: ComputedRef<number>;
  monthlyBudgetTotal: ComputedRef<number>;
  overSpentOnTotalIncome: ComputedRef<boolean>;
  percentageIsOverBudget: ComputedRef<boolean>;
  percentageOfBudgetSpent: ComputedRef<number>;
  remainingBudgetNotSpentYet: ComputedRef<number>;
  remainingToSpendTotal: ComputedRef<number>;
  totalExpenses: ComputedRef<number>;
  totalIncome: ComputedRef<number>;
} {
  function getIncomeItemIds(budgetItems: TBudgetItem[]): string[] {
    const incomeItemIds = budgetItems
      .filter((item) => item.type === "income")
      .map((item) => item.id);
    return incomeItemIds;
  }

  const totalIncome = computed(() => {
    const incomes = state.budgetItems
      .filter((item) => item.type === "income")
      .map((item) => item.budgeted_amount);
    return getTotal(incomes);
  });

  const monthlyBudgetTotal = computed(() => {
    return getTotal(
      state.budgetItems
        .filter((item) => item.type !== "income")
        .map((item) => item.budgeted_amount),
    );
  });

  const leftToBudget = computed(() => {
    return totalIncome.value - monthlyBudgetTotal.value;
  });

  const isNegativeBudget = computed(() => {
    return leftToBudget.value < 0;
  });

  const totalExpenses = computed(() => {
    const expenses = state.budgetExpenses
      .filter((expense) => {
        // Filter out income items from expenses
        const incomeIds = getIncomeItemIds(state.budgetItems);
        return incomeIds.includes(expense.budget_item_id) === false;
      })
      .map((item) => item.amount);
    return getTotal(expenses);
  });

  const remainingToSpendTotal = computed(() => {
    return totalIncome.value - totalExpenses.value;
  });

  const percentageOfBudgetSpent = computed(() => {
    if (monthlyBudgetTotal.value === 0) {
      return 0;
    }
    return (totalExpenses.value / monthlyBudgetTotal.value) * 100;
  });

  const percentageIsOverBudget = computed(() => {
    if (monthlyBudgetTotal.value === 0) {
      return false;
    }
    const percentage = (totalExpenses.value / monthlyBudgetTotal.value) * 100;
    return percentage > 100;
  });

  const overSpentOnTotalIncome = computed(() => {
    return totalExpenses.value > totalIncome.value;
  });

  const remainingBudgetNotSpentYet = computed(() => {
    let moneyLeftToSpend = 0;
    const totelExpenses = state.budgetExpenses;
    const budgetItems = state.budgetItems;

    for (const item of budgetItems) {
      if (item.type === "income") {
        continue; // Skip income items
      }

      const spent = totelExpenses
        .filter((expense) => expense.budget_item_id === item.id)
        .reduce((acc, expense) => acc + expense.amount, 0);
      if (
        !isNaN(item.budgeted_amount) &&
        item.budgeted_amount > spent &&
        item.budgeted_amount !== null
      ) {
        moneyLeftToSpend += item.budgeted_amount - spent;
      }
    }
    return moneyLeftToSpend;
  });

  return {
    isNegativeBudget,
    leftToBudget,
    monthlyBudgetTotal,
    overSpentOnTotalIncome,
    percentageIsOverBudget,
    percentageOfBudgetSpent,
    remainingBudgetNotSpentYet,
    remainingToSpendTotal,
    totalExpenses,
    totalIncome,
  };
}
