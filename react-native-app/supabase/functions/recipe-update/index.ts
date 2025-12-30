import { createClient } from "npm:@supabase/supabase-js";

import { corsHeaders } from "../_shared/cores.ts";
import { Database } from "../_shared/database-types.ts";
import { TRecipeIngredientInsert, TRecipeInstructionsInsert, TUpdateRecipeVariables } from "../_shared/types/recipe.ts";

// eslint-disable-next-line no-undef
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient<Database>(
      // eslint-disable-next-line no-undef
      Deno.env.get("SUPABASE_URL") ?? "",
      // eslint-disable-next-line no-undef
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
    );
    const variables: TUpdateRecipeVariables = await req.json();
    const { data: user } = await supabase.auth.getUser(token);

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    //need to validate the input here and if it's not valid, return an error response
    if (
      variables.house_id === undefined ||
      variables.recipe === undefined ||
      variables.ingredients === undefined ||
      variables.instructions === undefined ||
      variables.deletedIngredients === undefined ||
      variables.deletedInstructions === undefined
    ) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Update the recipe
    const { deletedIngredients, deletedInstructions, house_id, ingredients, instructions, recipe } = variables;
    const { error: recipeError } = await supabase.from("kitchen_recipes").update(recipe).eq("id", recipe.id);

    if (recipeError) {
      return new Response(JSON.stringify({ error: "Error updating recipe" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const ingredientsWithId = ingredients.filter((ingredient) => ingredient.id !== undefined);
    const instructionsWithId = instructions.filter((instruction) => instruction.id !== undefined);

    // Update ingredients
    for (const ingredient of ingredientsWithId) {
      if (!ingredient.id) {
        continue; // Skip if the ingredient does not have an ID
      }
      const { error: ingredientError } = await supabase
        .from("kitchen_recipe_ingredients")
        .update(ingredient)
        .eq("id", ingredient.id);

      if (ingredientError) {
        return new Response(JSON.stringify({ error: "Error updating ingredient: " + ingredientError.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
    }

    //Create new ingredients if they don't have an ID
    const newIngredients: TRecipeIngredientInsert[] = ingredients
      .filter((ingredient) => !ingredient.id)
      .map((ingredient) => ({
        house_id,
        ingredient: ingredient.ingredient as string,
        recipe_id: recipe.id as string,
        step_number: ingredient.step_number as number,
      }));

    if (newIngredients.length > 0) {
      const { error: insertIngredientsError } = await supabase
        .from("kitchen_recipe_ingredients")
        .insert(newIngredients);
      if (insertIngredientsError) {
        return new Response(
          JSON.stringify({ error: "Error creating new ingredients: " + insertIngredientsError.message }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          },
        );
      }
    }

    // Update instructions
    for (const instruction of instructionsWithId) {
      if (!instruction.id) {
        continue; // Skip if the instruction does not have an ID
      }

      const { error: instructionError } = await supabase
        .from("kitchen_recipe_instructions")
        .update(instruction)
        .eq("id", instruction.id);

      if (instructionError) {
        return new Response(JSON.stringify({ error: "Error updating instruction: " + instructionError.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
    }

    //Create new instructions if they don't have an ID
    const newInstructions: TRecipeInstructionsInsert[] = instructions
      .filter((instruction) => !instruction.id)
      .map((instruction) => ({
        house_id,
        instruction: instruction.instruction as string,
        recipe_id: recipe.id as string,
        step_number: instruction.step_number as number,
      }));

    if (newInstructions.length > 0) {
      const { error: insertInstructionsError } = await supabase
        .from("kitchen_recipe_instructions")
        .insert(newInstructions);
      if (insertInstructionsError) {
        return new Response(
          JSON.stringify({ error: "Error creating new instructions: " + insertInstructionsError.message }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          },
        );
      }
    }

    // Delete ingredients
    if (deletedIngredients.length > 0) {
      const { error: deleteIngredientsError } = await supabase
        .from("kitchen_recipe_ingredients")
        .delete()
        .in("id", deletedIngredients);
      if (deleteIngredientsError) {
        return new Response(
          JSON.stringify({ error: "Error deleting ingredients: " + deleteIngredientsError.message }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          },
        );
      }
    }

    // Delete instructions
    if (deletedInstructions.length > 0) {
      const { error: deleteInstructionsError } = await supabase
        .from("kitchen_recipe_instructions")
        .delete()
        .in("id", deletedInstructions);
      if (deleteInstructionsError) {
        return new Response(
          JSON.stringify({ error: "Error deleting instructions: " + deleteInstructionsError.message }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          },
        );
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
