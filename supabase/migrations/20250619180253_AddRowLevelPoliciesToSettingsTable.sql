create policy "Enable update for users based on auth ID"
on "public"."settings"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to view their own data only"
on "public"."settings"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



