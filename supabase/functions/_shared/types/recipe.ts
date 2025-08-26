import { Database } from "../database-types.ts";

export type TRecipeRow = Database["public"]["Tables"]["kitchen_recipes"]["Row"];
export type TRecipeInsert = Database["public"]["Tables"]["kitchen_recipes"]["Insert"];
export type TRecipeUpdate = Database["public"]["Tables"]["kitchen_recipes"]["Update"];

export type TRecipeIngredientRow = Database["public"]["Tables"]["kitchen_recipe_ingredients"]["Row"];
export type TRecipeIngredientInsert = Database["public"]["Tables"]["kitchen_recipe_ingredients"]["Insert"];
export type TRecipeIngredientUpdate = Database["public"]["Tables"]["kitchen_recipe_ingredients"]["Update"];

export type TRecipeInstructionsRow = Database["public"]["Tables"]["kitchen_recipe_instructions"]["Row"];
export type TRecipeInstructionsInsert = Database["public"]["Tables"]["kitchen_recipe_instructions"]["Insert"];
export type TRecipeInstructionsUpdate = Database["public"]["Tables"]["kitchen_recipe_instructions"]["Update"];

export type TCreateRecipeVariables = {
  ingredients: TRecipeIngredientInsert[];
  instructions: TRecipeInstructionsInsert[];
  recipe: TRecipeInsert;
};

export type TUpdateRecipeVariables = {
  deletedIngredients: number[];
  deletedInstructions: number[];
  house_id: number;
  ingredients: TRecipeIngredientUpdate[];
  instructions: TRecipeInstructionsUpdate[];
  recipe: {
    cook_time_minutes?: number | null;
    id: string;
    image_url?: string;
    prep_time_minutes?: number | null;
    servings?: number | null;
    source_url?: string;
    title: string;
  };
};

export type TFullRecipe = {
  ingredients: TRecipeIngredientRow[];
  instructions: TRecipeInstructionsRow[];
  recipe: TRecipeRow;
};

export type TImportRecipeVariables = {
  images: { alt?: string; src: string }[];
  recipe: string; // This will be the HTML content of the recipe
};
