drop view if exists "public"."budget_month_summary";

alter table "public"."budget_expenses" alter column "house_id" set data type bigint using "house_id"::bigint;

alter table "public"."budget_items" alter column "house_id" set data type bigint using "house_id"::bigint;

alter table "public"."budget_months" alter column "house_id" set data type bigint using "house_id"::bigint;

alter table "public"."kitchen_recipe_ingredients" alter column "house_id" set data type bigint using "house_id"::bigint;

alter table "public"."kitchen_recipe_instructions" alter column "house_id" set data type bigint using "house_id"::bigint;

alter table "public"."kitchen_recipes" alter column "house_id" set data type bigint using "house_id"::bigint;

create or replace view "public"."budget_month_summary" as  SELECT bi.budget_month_id,
    bi.type,
    count(*) AS total_items,
    sum(bi.budgeted_amount) AS total_budgeted,
    sum(
        CASE
            WHEN bi.is_paid THEN 1
            ELSE 0
        END) AS paid_items,
    round(((100.0 * (sum(
        CASE
            WHEN bi.is_paid THEN 1
            ELSE 0
        END))::numeric) / (count(*))::numeric), 1) AS percent_paid
   FROM budget_items bi
  GROUP BY bi.budget_month_id, bi.type
  ORDER BY bi.budget_month_id, bi.type;



