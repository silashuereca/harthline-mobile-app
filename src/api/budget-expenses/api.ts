import { Database } from "../../../supabase/functions/_shared/database-types";
import { supabase } from "../../supabase";
import { BaseApi } from "../base";

export type TBudgetExpenseRow =
  Database["public"]["Tables"]["budget_expenses"]["Row"];
export type TBudgetExpenseInsert =
  Database["public"]["Tables"]["budget_expenses"]["Insert"];
export type TBudgetExpenseUpdate =
  Database["public"]["Tables"]["budget_expenses"]["Update"];

export class BudgetExpenseApi extends BaseApi {
  async getAllMonthlyExpenses(variables: {
    budgetMonthId: string;
  }): Promise<TBudgetExpenseRow[]> {
    const { budgetMonthId } = variables;
    const { data, error } = await supabase
      .from("budget_expenses")
      .select("*")
      .eq("budget_month_id", budgetMonthId);

    if (error) {
      this.showError("Failed to fetch monthly expenses");
      throw new Error(error.message);
    }

    return data;
  }

  async getBudgetExpenses(variables: {
    id: string;
  }): Promise<TBudgetExpenseRow[]> {
    const { id } = variables;
    const { data, error } = await supabase
      .from("budget_expenses")
      .select("*")
      .eq("budget_item_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      this.showError("Failed to fetch expenses");
      throw new Error(error.message);
    }

    return data;
  }

  async createBudgetExpense(variables: {
    amount: number;
    budget_item_id: string;
    budget_month_id: string;
    name: string;
  }): Promise<{ success: boolean }> {
    const { amount, budget_item_id, budget_month_id, name } = variables;
    const { error } = await supabase.from("budget_expenses").insert({
      amount,
      budget_item_id,
      budget_month_id,
      house_id: this.houseId(),
      name,
    });

    if (error) {
      this.showError("Failed to create expense. Please try again.");
      throw new Error(error.message);
    }

    return { success: true };
  }

  async updateBudgetExpense(
    variables: TBudgetExpenseUpdate,
  ): Promise<{ success: boolean }> {
    const { amount, id, name } = variables;
    const { error } = await supabase
      .from("budget_expenses")
      .update({
        amount,
        name,
      })
      .eq("id", id);

    if (error) {
      this.showError(error.message);
      return;
    }

    return { success: true };
  }

  async deleteBudgetExpense(variables: {
    id: string;
  }): Promise<{ success: boolean }> {
    const { id } = variables;
    const { error } = await supabase
      .from("budget_expenses")
      .delete()
      .eq("id", id);

    if (error) {
      this.showError("Failed to delete expense");
      throw new Error(error.message);
    }

    return { success: true };
  }
}
