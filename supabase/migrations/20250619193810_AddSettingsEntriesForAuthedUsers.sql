insert into public.settings (user_id, selected_house_id)
select
  u.id as user_id,
  h.id as selected_house_id
from auth.users u
join public.houses h on h.owner_id = u.id
left join public.settings s on s.user_id = u.id
where s.user_id is null;
