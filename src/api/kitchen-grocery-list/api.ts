import { Database } from "../../../supabase/functions/_shared/database-types";
import { TRecipeRow } from "../../../supabase/functions/_shared/types/recipe";
import { supabase } from "../../supabase";
import { BaseApi } from "../base";

export type TGroceryList =
  Database["public"]["Tables"]["kitchen_grocery_lists"]["Row"];

const successMessage = "Successfully saved!";
export class KitchenGroceryListApi extends BaseApi {
  async getGroceryList(): Promise<TGroceryList | null> {
    //there will only be one list that the user reuses every week for now
    const { data, error } = await supabase
      .from("kitchen_grocery_lists")
      .select("*");

    if (error) {
      this.showError("Error fetching your grocery list");
      console.error("Error fetching your grocery list:", error);
      return null;
    }

    return data?.[0] ?? null;
  }

  async createGroceryList(variables: {
    content: string;
    house_id: number;
  }): Promise<TRecipeRow[]> {
    console.log("Variables", variables);
    const { data, error } = await supabase
      .from("kitchen_grocery_lists")
      .insert({
        content: variables.content,
        house_id: variables.house_id,
      });

    if (error) {
      this.showError("Error creating grocery list");
      console.error("Error creating grocery list:", error);
      return [];
    }

    this.showSuccess(successMessage);
    return data || [];
  }

  async updateGroceryList(variables: {
    content: string;
    id: number;
  }): Promise<{ success: boolean }> {
    const { error } = await supabase
      .from("kitchen_grocery_lists")
      .update({
        content: variables.content,
      })
      .eq("id", variables.id);

    if (error) {
      this.showError("Error updating grocery list");
      console.error("Error updating grocery list:", error);
      return { success: false };
    }

    this.showSuccess(successMessage);
    return { success: true };
  }
}
