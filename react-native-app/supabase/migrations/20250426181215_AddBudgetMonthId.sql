alter table "public"."budget_expenses" add column "budget_month_id" uuid not null;

alter table "public"."budget_expenses" add constraint "budget_expenses_budget_month_id_fkey" FOREIGN KEY (budget_month_id) REFERENCES budget_months(id) not valid;

alter table "public"."budget_expenses" validate constraint "budget_expenses_budget_month_id_fkey";


