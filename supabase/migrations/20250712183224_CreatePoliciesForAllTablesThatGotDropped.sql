create policy "Enable delete for users apart of house id"
on "public"."budget_expenses"
as permissive
for delete
to authenticated
using (is_user_in_house(house_id));


create policy "Enable insert for users apart of house id"
on "public"."budget_expenses"
as permissive
for select
to authenticated
using (is_user_in_house(house_id));


create policy "Enable insert for users apart of house"
on "public"."budget_expenses"
as permissive
for insert
to authenticated
with check (is_user_in_house(house_id));


create policy "Enable update for members apart of house id"
on "public"."budget_expenses"
as permissive
for update
to authenticated
using (is_user_in_house(house_id));


create policy "Enable insert when users are apart of house id"
on "public"."budget_items"
as permissive
for insert
to authenticated
with check (is_user_in_house(house_id));


create policy "Enable users to delete when apart of house id"
on "public"."budget_items"
as permissive
for delete
to authenticated
using (is_user_in_house(house_id));


create policy "Enable users to select when apart of house id"
on "public"."budget_items"
as permissive
for select
to authenticated
using (is_user_in_house(house_id));


create policy "enable update when user is apart of house id"
on "public"."budget_items"
as permissive
for update
to authenticated
using (is_user_in_house(house_id));


create policy "Enable insert for authenticated users with house id"
on "public"."budget_months"
as permissive
for insert
to authenticated
with check (is_user_in_house(house_id));


create policy "Enable select for members apart of house id"
on "public"."budget_months"
as permissive
for select
to authenticated
using (is_user_in_house(house_id));



