alter table "public"."budget_months" drop constraint "budget_months_user_id_month_start_key";

drop index if exists "public"."budget_months_user_id_month_start_key";

CREATE UNIQUE INDEX budget_months_unique_house_month ON public.budget_months USING btree (house_id, month_start);

alter table "public"."budget_months" add constraint "budget_months_unique_house_month" UNIQUE using index "budget_months_unique_house_month";


