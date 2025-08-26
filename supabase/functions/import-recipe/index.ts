import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";
import { createClient } from "npm:@supabase/supabase-js";

import { corsHeaders } from "../_shared/cores.ts";
import { Database } from "../_shared/database-types.ts";
import { TImportRecipeVariables } from "../_shared/types/recipe.ts";

type TImportRecipeResponse = {
  cook_time_minutes?: number;
  image_url?: string;
  ingredients: { group_label?: string; name: string; quantity?: string }[];
  instructions: { body: string; group_label?: string; step_number: number }[];
  prep_time_minutes?: number;
  servings?: number;
  title: string;
};

// eslint-disable-next-line no-undef
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const openAi = new OpenAI({
      // eslint-disable-next-line no-undef
      apiKey: Deno.env.get("OPENAI_API_KEY") ?? "",
    });
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
    const requestData: TImportRecipeVariables = await req.json();
    const { recipe } = requestData;
    const { data: user } = await supabase.auth.getUser(token);

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    if (!recipe || !recipe.trim()) {
      return new Response(JSON.stringify({ error: "Invalid input, no recipe" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const completion = await openAi.chat.completions.create({
      messages: [
        {
          content: prompt,
          role: "user",
        },
        {
          content: recipe.slice(0, 75000), // Avoid token overflow, truncate if needed
          role: "user",
        },
      ],
      model: "gpt-4o-mini-2024-07-18",
      temperature: 0.2,
    });

    if (!completion.choices || completion.choices.length === 0) {
      return new Response(JSON.stringify({ error: "No response from OpenAI" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const rawText = completion.choices[0]?.message?.content ?? "";
    let importedRecipeObject: TImportRecipeResponse;
    try {
      const match = rawText.match(/```json\n([\s\S]+?)\n```/);
      const jsonString = match ? match[1].trim() : rawText.trim(); // fallback if no code block found
      importedRecipeObject = JSON.parse(jsonString);
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to parse recipe: " + error }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    if (!validateImportRecipeResponse(importedRecipeObject)) {
      return new Response(JSON.stringify({ error: "Invalid recipe format" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const recipeData: {
      cook_time_minutes: number | null;
      image_url?: string;
      ingredients: { ingredient: string }[];
      instructions: { instruction: string }[];
      prep_time_minutes: number | null;
      servings: number | null;
      title: string;
    } = {
      cook_time_minutes: importedRecipeObject?.cook_time_minutes ?? null,
      image_url: importedRecipeObject?.image_url || undefined,
      ingredients: [],
      instructions: [],
      prep_time_minutes: importedRecipeObject?.prep_time_minutes ?? null,
      servings: importedRecipeObject?.servings ?? null,
      title: importedRecipeObject.title,
    };

    for (const ingredient of importedRecipeObject.ingredients) {
      recipeData.ingredients.push({
        ingredient: ingredient?.quantity ? `${ingredient.quantity} ${ingredient.name}` : ingredient.name,
      });
    }

    for (const instruction of importedRecipeObject.instructions) {
      recipeData.instructions.push({
        instruction: instruction.body,
      });
    }

    return new Response(JSON.stringify({ recipe: recipeData, success: true }), {
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

function validateImportRecipeResponse(response: TImportRecipeResponse): boolean {
  if (!response.title || typeof response.title !== "string") {
    return false;
  }
  if (!Array.isArray(response.ingredients)) {
    return false;
  }
  if (!Array.isArray(response.instructions)) {
    return false;
  }
  for (const ingredient of response.ingredients) {
    if (typeof ingredient.name !== "string") {
      return false;
    }
    if (ingredient.quantity && typeof ingredient.quantity !== "string") {
      return false;
    }
  }
  for (const instruction of response.instructions) {
    if (typeof instruction.body !== "string") {
      return false;
    }
    if (typeof instruction.step_number !== "number") {
      return false;
    }
  }
  return true;
}

const prompt = `
You are a helpful assistant that extracts structured recipe data from HTML pages.

---

🔹 Ingredients:

Only extract ingredients that appear explicitly in the ingredients section of the page. Do not infer or guess missing quantities.

Return ingredients in the following format:
- "quantity" (optional): only if a quantity or unit are clearly specified next to the ingredient
- "name": the full name of the ingredient without the quantity

Examples:
- "3/4 cup whole milk" → { "quantity": "3/4 cup", "name": "whole milk" }
- "Kosher salt" → { "name": "Kosher salt" }  ← no quantity
- "Vegetable oil" (if no quantity provided in list) → { "name": "Vegetable oil" }

Do NOT add a quantity if it is only mentioned in the instructions or body text.

Do NOT add a quantity if it is only mentioned in the instructions or context.

---

🔹 Instructions:

If instructions are written in paragraph form, break them into numbered steps where each step represents a clearly distinct action or logical group of actions that happen together.

Split steps when:

A sentence describes a new, separate stage in the recipe (e.g., moving from prep to cooking).

Two or more sentences represent clearly different physical actions, like “Shred the chicken. Then return it to the pot.”

A semicolon or “then/next” indicates a meaningful progression to a different step.

Do NOT split:

Just because there is a period. Only split if the action changes.

When a sentence describes a sequence of related actions that belong together, like mixing ingredients and pouring them immediately.

Examples:
✅ Split:

Preheat the oven to 400°F.

In a bowl, whisk together the eggs, sugar, and milk.

🚫 Don’t split:

Add flour to the bowl, then slowly whisk in the milk until smooth. ← keep this together

---

---
Prep time, cooking time, serving size

If the recipe includes information about preparation time, cooking time, or number of servings, extract them using the following rules:

- **prep_time_minutes**: Total estimated preparation time *before cooking*, in minutes only (e.g., chopping, mixing).
- **cook_time_minutes**: Total estimated cooking or baking time, in minutes only.
- **servings**: The number of servings or people the recipe is designed to serve. This should be a number (e.g., "4", not "serves four").

Only include these fields if the information is explicitly mentioned or clearly inferable from the page. If not present, omit the field from the response.
---

Extract the primary recipe URL from the page if available. ONLY include the URL if it is a valid https URL.

Here is the full format:

Return the result as a JSON object in this format:
{
  title: string,
  ingredients: { quantity?: string; name: string; }[],
  instructions: { step_number: number; body: string; }[],
  prep_time_minutes?: number,
  cook_time_minutes?: number,
  servings?: number,
  image_url?: string,
}
`;
