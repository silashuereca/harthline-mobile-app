import {
  TRecipeIngredientRow,
  TRecipeInstructionsRow,
  TRecipeRow,
} from "../../../supabase/functions/_shared/types/recipe";
import { supabase } from "../../supabase";
import { BaseApi } from "../base";

export type TFullRecipe = {
  ingredients: TRecipeIngredientRow[];
  instructions: TRecipeInstructionsRow[];
  recipe: TRecipeRow;
};

export class KitchenRecipesApi extends BaseApi {
  async getRecipe(variables: { id: string }): Promise<TFullRecipe> {
    const recipe: TFullRecipe = {
      ingredients: [],
      instructions: [],
      recipe: null,
    };
    const { data, error } = await supabase
      .from("kitchen_recipes")
      .select("*")
      .eq("id", variables.id)
      .single();

    if (error) {
      this.showError("Error fetching recipe");
      console.error("Error fetching recipe:", error);
      return null;
    }

    recipe.recipe = data;

    const { data: ingredientsData, error: ingredientsError } = await supabase
      .from("kitchen_recipe_ingredients")
      .select("*")
      .eq("recipe_id", variables.id);
    recipe.ingredients = ingredientsData || [];

    if (ingredientsError) {
      this.showError("Error fetching recipe ingredients");
      console.error("Error fetching recipe ingredients:", ingredientsError);
      return null;
    }

    const { data: instructionsData, error: instructionsError } = await supabase
      .from("kitchen_recipe_instructions")
      .select("*")
      .eq("recipe_id", variables.id);
    recipe.instructions = instructionsData || [];

    if (instructionsError) {
      this.showError("Error fetching recipe instructions");
      console.error("Error fetching recipe instructions:", instructionsError);
      return null;
    }

    return recipe;
  }

  async getRecipes(variables: { houseId: number }): Promise<TRecipeRow[]> {
    const { data, error } = await supabase
      .from("kitchen_recipes")
      .select("*")
      .eq("house_id", variables.houseId);

    if (error) {
      this.showError("Error fetching recipes");
      console.error("Error fetching recipes:", error);
      return [];
    }

    return data || [];
  }

  async deleteRecipe(variables: { id: string }): Promise<boolean> {
    const { error } = await supabase
      .from("kitchen_recipes")
      .delete()
      .eq("id", variables.id);

    if (error) {
      this.showError("Error deleting recipe");
      console.error("Error deleting recipe:", error);
      return false;
    }

    return true;
  }
}
