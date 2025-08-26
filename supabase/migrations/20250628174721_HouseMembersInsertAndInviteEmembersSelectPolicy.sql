drop policy "Enable insert for authenticated users only" on "public"."houses";

drop policy "Select invite members if invited user email matches email or au" on "public"."invite_members";

drop policy "The invited member can update only the status" on "public"."invite_members";

create policy "Insert member only from invited user"
on "public"."house_members"
as permissive
for insert
to authenticated
with check (((EXISTS ( SELECT 1
   FROM invite_members
  WHERE ((invite_members.email = auth.email()) AND (invite_members.status = 'pending'::invite_status) AND (invite_members.house_id = house_members.house_id) AND (invite_members.role = house_members.role)))) AND (member_id = auth.uid())));


create policy "Members of a house can select houses"
on "public"."houses"
as permissive
for select
to authenticated
using ((id IN ( SELECT house_members.house_id
   FROM house_members
  WHERE (house_members.member_id = auth.uid()))));


create policy "All authenticated members can see invites"
on "public"."invite_members"
as permissive
for select
to authenticated
using (true);


create policy "Only invited user can update the status"
on "public"."invite_members"
as permissive
for update
to public
using (((email = auth.email()) AND (status = 'pending'::invite_status)))
with check (((email = auth.email()) AND (invited_by_email = invited_by_email) AND (house_id = house_id) AND (house_name = house_name) AND (role = role) AND (created_at = created_at)));



