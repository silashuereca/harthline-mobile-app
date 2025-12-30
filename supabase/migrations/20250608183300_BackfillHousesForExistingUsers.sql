insert into public.houses (name, owner_id)
select
  'My First House' as name,
  u.id as owner_id
from auth.users u
left join public.houses h on h.owner_id = u.id
where h.id is null;
