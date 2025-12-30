alter table "public"."kitchen_recipe_ingredients" alter column "house_id" set data type numeric using "house_id"::numeric;

alter table "public"."kitchen_recipe_instructions" alter column "house_id" set data type numeric using "house_id"::numeric;

alter table "public"."kitchen_recipes" alter column "house_id" set data type numeric using "house_id"::numeric;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_user_in_house(target_house_id bigint)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  select exists (
    select 1
    from house_members
    where member_id = auth.uid()
    and house_id = target_house_id
  );
$function$
;


