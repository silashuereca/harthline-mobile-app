-- 1. Drop the existing primary key constraint
alter table kitchen_recipe_instructions drop constraint kitchen_recipe_instructions_pkey;

-- 2. Add a new bigint column with autoincrement
alter table kitchen_recipe_instructions add column new_id bigint generated always as identity;

-- 3. Promote new_id to be the primary key
alter table kitchen_recipe_instructions add primary key (new_id);

-- 4. (Optional) Drop the old uuid column
alter table kitchen_recipe_instructions drop column id;

-- 5. (Optional) Rename new_id to id
alter table kitchen_recipe_instructions rename column new_id to id;
