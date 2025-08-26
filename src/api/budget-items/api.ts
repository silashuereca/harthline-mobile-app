import { Database } from "../../../supabase/functions/_shared/database-types";
import { supabase } from "../../supabase";
import { BaseApi } from "../base";

export type TBudgetItem = Database["public"]["Tables"]["budget_items"]["Row"];
export type TBudgetItemCategory =
  Database["public"]["Tables"]["budget_items"]["Row"]["type"];

export class BudgetItemApi extends BaseApi {
  async getBudgetItem(variables: { id: string }): Promise<TBudgetItem> {
    const { id } = variables;
    const { data, error } = await supabase
      .from("budget_items")
      .select("*")
      .eq("id", id);

    if (error) {
      this.showError("Failed to fetch budget item");
      throw new Error(error.message);
    }

    return data[0];
  }

  async getBudgetItems(budgetMonthId: string): Promise<TBudgetItem[]> {
    const { data, error } = await supabase
      .from("budget_items")
      .select("*")
      .eq("budget_month_id", budgetMonthId)
      .order("created_at", { ascending: true }); // oldest at top, newest at bottom

    if (error) {
      this.showError("Failed to fetch budget items");
      throw new Error(error.message);
    }

    return data;
  }

  async createBudgetItem(variables: {
    amount: number;
    category: TBudgetItemCategory;
    monthId: string;
    name: string;
  }): Promise<{ success: boolean }> {
    const { amount, category, monthId, name } = variables;
    const { error } = await supabase.from("budget_items").insert({
      budget_month_id: monthId,
      budgeted_amount: amount,
      house_id: this.houseId(),
      name,
      type: category,
    });

    if (error) {
      this.showError("Failed to create budget item. Please try again.");
      throw new Error(error.message);
    }

    return { success: true };
  }

  async updateBudgetItem(variables: {
    amount: number;
    id: string;
    name: string;
  }): Promise<{ success: boolean }> {
    const { amount, id, name } = variables;
    const { error } = await supabase
      .from("budget_items")
      .update({
        budgeted_amount: amount,
        name,
      })
      .eq("id", id);

    if (error) {
      this.showError("Failed to update budget item. Please try again.");
      throw new Error(error.message);
    }

    return { success: true };
  }

  async deleteBudgetItem(variables: {
    id: string;
  }): Promise<{ success: boolean }> {
    const { id } = variables;
    const { error } = await supabase.from("budget_items").delete().eq("id", id);

    if (error) {
      this.showError("Failed to delete budget item. Please try again.");
      throw new Error(error.message);
    }

    return { success: true };
  }
}
