alter table "public"."invite_members" add column "role" member_role not null;

create policy "Enable delete for owners only"
on "public"."invite_members"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM house_members
  WHERE ((house_members.house_id = invite_members.house_id) AND (house_members.member_id = ( SELECT auth.uid() AS uid)) AND (house_members.role = 'owner'::member_role)))));


create policy "Only allow owners to invite members"
on "public"."invite_members"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM house_members
  WHERE ((house_members.house_id = invite_members.house_id) AND (house_members.member_id = ( SELECT auth.uid() AS uid)) AND (house_members.role = 'owner'::member_role)))));


create policy "Select invite members if invited user email matches email or authed user's email"
on "public"."invite_members"
as permissive
for select
to authenticated
using (((email = ( SELECT auth.email() AS email)) OR (EXISTS ( SELECT 1
   FROM house_members
  WHERE ((house_members.house_id = invite_members.house_id) AND (house_members.member_id = ( SELECT auth.uid() AS uid)))))));



