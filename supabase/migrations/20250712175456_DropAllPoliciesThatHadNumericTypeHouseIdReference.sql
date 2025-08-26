drop policy "Enable delete for users based on house_id" on "public"."budget_expenses";

drop policy "Enable insert for users based on house_id" on "public"."budget_expenses";

drop policy "Enable update for users based on house_id" on "public"."budget_expenses";

drop policy "Enable users to view their data based on house_id" on "public"."budget_expenses";

drop policy "Enable delete for users based on house_id" on "public"."budget_items";

drop policy "Enable insert for users based on house_id" on "public"."budget_items";

drop policy "Enable update for users based on house_id" on "public"."budget_items";

drop policy "Enable users to view their data based on house_id" on "public"."budget_items";

drop policy "Enable insert for authenticated with house_id check" on "public"."budget_months";

drop policy "Enable users to view their data based on house_id" on "public"."budget_months";

alter table "public"."house_members" drop constraint "house_members_house_id_fkey";


