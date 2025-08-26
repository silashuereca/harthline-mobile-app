import { createClient } from "npm:@supabase/supabase-js";

import { corsHeaders } from "../_shared/cores.ts";
import { Database } from "../_shared/database-types.ts";
import { TCreateRecipeVariables } from "../_shared/types/recipe.ts";

// eslint-disable-next-line no-undef
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the session or user object
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
    const variables: TCreateRecipeVariables = await req.json();
    const { data: user } = await supabase.auth.getUser(token);

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    //need to validate the input here and if it's not valid, return an error response
    if (!variables.recipe || !variables.ingredients || !variables.instructions) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    //need to create the recipe first and get the ID
    const { data: recipeData, error: recipeError } = await supabase
      .from("kitchen_recipes")
      .insert(variables.recipe)
      .select();

    if (recipeError) {
      return new Response(JSON.stringify({ error: "Error creating recipe" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const recipeId = recipeData?.[0]?.id;
    if (!recipeId) {
      return new Response(JSON.stringify({ error: "Recipe ID not found after creation" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    // Insert ingredients
    const ingredientsWithRecipeId = variables.ingredients.map((ingredient) => ({
      ...ingredient,
      recipe_id: recipeId,
    }));

    const { error: ingredientsError } = await supabase
      .from("kitchen_recipe_ingredients")
      .insert(ingredientsWithRecipeId);

    if (ingredientsError) {
      return new Response(JSON.stringify({ error: "Error inserting ingredients" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Insert instructions
    const instructionsWithRecipeId = variables.instructions.map((instruction) => ({
      ...instruction,
      recipe_id: recipeId,
    }));

    const { error: instructionsError } = await supabase
      .from("kitchen_recipe_instructions")
      .insert(instructionsWithRecipeId);

    if (instructionsError) {
      return new Response(JSON.stringify({ error: "Error inserting instructions" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    return new Response(JSON.stringify({ recipeId: recipeData[0].id, success: true }), {
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
