drop policy "Select invite members if invited user email matches email or au" on "public"."invite_members";

create policy "Select invite members if invited user email matches email or authenticated user"
on "public"."invite_members"
as permissive
for select
to authenticated
using (((email = ( SELECT auth.email() AS email)) OR (EXISTS ( SELECT 1
   FROM house_members
  WHERE ((house_members.house_id = invite_members.house_id) AND (house_members.member_id = ( SELECT auth.uid() AS uid)))))));


create policy "The invited member can update only the status"
on "public"."invite_members"
as permissive
for update
to authenticated
using (((email = auth.email()) AND (status = 'pending'::invite_status)))
with check (((email = auth.email()) AND (invited_by_email = invited_by_email) AND (house_id = house_id) AND (house_name = house_name) AND (role = role) AND (created_at = created_at)));



