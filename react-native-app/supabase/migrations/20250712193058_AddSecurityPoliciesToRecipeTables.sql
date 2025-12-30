create policy "Enable delete for users apart of a house"
on "public"."kitchen_recipe_ingredients"
as permissive
for delete
to authenticated
using (is_user_in_house(house_id));


create policy "Enable insert for users that are apart of a house"
on "public"."kitchen_recipe_ingredients"
as permissive
for insert
to authenticated
with check (is_user_in_house(house_id));


create policy "Enable select for users that are apart of a house"
on "public"."kitchen_recipe_ingredients"
as permissive
for select
to authenticated
using (is_user_in_house(house_id));


create policy "Enable update for users apart of a house"
on "public"."kitchen_recipe_ingredients"
as permissive
for update
to public
using (is_user_in_house(house_id));


create policy "Enable delete for users that are apart of a house"
on "public"."kitchen_recipe_instructions"
as permissive
for delete
to public
using (is_user_in_house(house_id));


create policy "Enable insert for users that are apart of a house"
on "public"."kitchen_recipe_instructions"
as permissive
for insert
to authenticated
with check (is_user_in_house(house_id));


create policy "Enable select for users that are apart of a house"
on "public"."kitchen_recipe_instructions"
as permissive
for select
to authenticated
using (is_user_in_house(house_id));


create policy "Enable update for users that are apart of a house"
on "public"."kitchen_recipe_instructions"
as permissive
for update
to authenticated
using (is_user_in_house(house_id));


create policy "Enable delete for users that art apart of house"
on "public"."kitchen_recipes"
as permissive
for delete
to authenticated
using (is_user_in_house(house_id));


create policy "Enable insert for users that are apart of a house"
on "public"."kitchen_recipes"
as permissive
for insert
to authenticated
with check (is_user_in_house(house_id));


create policy "Enable select for users that are apart of a house"
on "public"."kitchen_recipes"
as permissive
for select
to authenticated
using (is_user_in_house(house_id));


create policy "Enable update for users that are apart of a house"
on "public"."kitchen_recipes"
as permissive
for update
to authenticated
using (is_user_in_house(house_id));



