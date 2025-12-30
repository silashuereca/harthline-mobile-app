alter table "public"."budget_months" drop constraint "budget_months_user_id_fkey";

alter table "public"."budget_expenses" add column "user_id" uuid not null default auth.uid();

alter table "public"."budget_expenses" enable row level security;

alter table "public"."budget_items" add column "user_id" uuid not null default auth.uid();

alter table "public"."budget_items" enable row level security;

alter table "public"."budget_months" alter column "user_id" set not null;

alter table "public"."budget_months" enable row level security;

create policy "Enable delete for users based on user_id"
on "public"."budget_expenses"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for users based on user_id"
on "public"."budget_expenses"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable update for users based on user_id"
on "public"."budget_expenses"
as permissive
for update
to authenticator
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to view their own data only"
on "public"."budget_expenses"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable delete for users based on user_id"
on "public"."budget_items"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for users based on user_id"
on "public"."budget_items"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable update for users based on user_id"
on "public"."budget_items"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to view their own data only"
on "public"."budget_items"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for authenticated users only"
on "public"."budget_months"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));


create policy "Enable users to view their own data only"
on "public"."budget_months"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



