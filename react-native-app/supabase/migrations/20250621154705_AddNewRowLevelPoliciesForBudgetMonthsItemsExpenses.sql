drop policy "Enable delete for users based on user_id" on "public"."budget_expenses";

drop policy "Enable insert for users based on user_id" on "public"."budget_expenses";

drop policy "Enable update for users based on user_id" on "public"."budget_expenses";

drop policy "Enable users to view their own data only" on "public"."budget_expenses";

drop policy "Enable delete for users based on user_id" on "public"."budget_items";

drop policy "Enable insert for users based on user_id" on "public"."budget_items";

drop policy "Enable update for users based on user_id" on "public"."budget_items";

drop policy "Enable users to view their own data only" on "public"."budget_items";

drop policy "Enable insert for authenticated users only" on "public"."budget_months";

drop policy "Enable users to view their own data only" on "public"."budget_months";

create policy "Enable delete for users based on house_id"
on "public"."budget_expenses"
as permissive
for delete
to public
using ((house_id = (( SELECT settings.selected_house_id
   FROM settings
  WHERE (settings.user_id = auth.uid())))::numeric));


create policy "Enable insert for users based on house_id"
on "public"."budget_expenses"
as permissive
for insert
to public
with check ((house_id = (( SELECT settings.selected_house_id
   FROM settings
  WHERE (settings.user_id = auth.uid())))::numeric));


create policy "Enable update for users based on house_id"
on "public"."budget_expenses"
as permissive
for update
to authenticated
using ((house_id = (( SELECT settings.selected_house_id
   FROM settings
  WHERE (settings.user_id = auth.uid())))::numeric));


create policy "Enable users to view data based on house_id"
on "public"."budget_expenses"
as permissive
for select
to authenticated
using ((house_id = (( SELECT settings.selected_house_id
   FROM settings
  WHERE (settings.user_id = auth.uid())))::numeric));


create policy "Enable delete for users based on house_id"
on "public"."budget_items"
as permissive
for delete
to public
using ((house_id = (( SELECT settings.selected_house_id
   FROM settings
  WHERE (settings.user_id = auth.uid())))::numeric));


create policy "Enable insert for users based on house_id"
on "public"."budget_items"
as permissive
for insert
to public
with check ((house_id = (( SELECT settings.selected_house_id
   FROM settings
  WHERE (settings.user_id = auth.uid())))::numeric));


create policy "Enable update for users based on house_id"
on "public"."budget_items"
as permissive
for update
to authenticated
using ((house_id = (( SELECT settings.selected_house_id
   FROM settings
  WHERE (settings.user_id = auth.uid())))::numeric));


create policy "Enable users to view data based on house_id"
on "public"."budget_items"
as permissive
for select
to authenticated
using ((house_id = (( SELECT settings.selected_house_id
   FROM settings
  WHERE (settings.user_id = auth.uid())))::numeric));


create policy "Enable insert for users based on house_id"
on "public"."budget_months"
as permissive
for insert
to authenticated
with check ((house_id = (( SELECT settings.selected_house_id
   FROM settings
  WHERE (settings.user_id = auth.uid())))::numeric));


create policy "Enable users to view data based on house_id"
on "public"."budget_months"
as permissive
for select
to authenticated
using ((house_id = (( SELECT settings.selected_house_id
   FROM settings
  WHERE (settings.user_id = auth.uid())))::numeric));



