alter table "public"."kitchen_recipe_ingredients" drop constraint "kitchen_recipe_ingredients_recipe_id_fkey";

alter table "public"."kitchen_recipe_instructions" drop constraint "kitchen_recipe_instructions_recipe_id_fkey";

alter table "public"."kitchen_recipe_ingredients" add constraint "kitchen_recipe_ingredients_recipe_id_fkey" FOREIGN KEY (recipe_id) REFERENCES kitchen_recipes(id) ON DELETE CASCADE not valid;

alter table "public"."kitchen_recipe_ingredients" validate constraint "kitchen_recipe_ingredients_recipe_id_fkey";

alter table "public"."kitchen_recipe_instructions" add constraint "kitchen_recipe_instructions_recipe_id_fkey" FOREIGN KEY (recipe_id) REFERENCES kitchen_recipes(id) ON DELETE CASCADE not valid;

alter table "public"."kitchen_recipe_instructions" validate constraint "kitchen_recipe_instructions_recipe_id_fkey";
