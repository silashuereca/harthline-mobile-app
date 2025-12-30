create or replace view "public"."house_members_with_user" as  SELECT hm.id AS house_member_id,
    hm.house_id,
    hm.member_id,
    hm.role,
    hm.created_at,
    u.email,
    (u.raw_user_meta_data ->> 'full_name'::text) AS full_name,
    (u.raw_user_meta_data ->> 'avatar_url'::text) AS avatar_url
   FROM (house_members hm
     JOIN auth.users u ON ((u.id = hm.member_id)));


create policy "Members who belong to a house should see all members"
on "public"."house_members"
as permissive
for select
to authenticated
using ((house_id IN ( SELECT house_members_1.house_id
   FROM house_members house_members_1
  WHERE (house_members_1.member_id = auth.uid()))));



