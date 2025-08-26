drop trigger if exists on_auth_user_created on auth.users;

drop function if exists "public"."handle_new_user"();

alter table "public"."budget_expenses" add column "budget_month_id" uuid not null;

alter table "public"."budget_expenses" add column "name" text not null;

alter table "public"."budget_expenses" add constraint "budget_expenses_budget_month_id_fkey" FOREIGN KEY (budget_month_id) REFERENCES budget_months(id) ON DELETE CASCADE not valid;

alter table "public"."budget_expenses" validate constraint "budget_expenses_budget_month_id_fkey";


