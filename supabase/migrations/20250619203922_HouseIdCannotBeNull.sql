alter table "public"."budget_expenses" alter column "house_id" set not null;

alter table "public"."budget_items" alter column "house_id" set not null;

alter table "public"."budget_months" alter column "house_id" set not null;


