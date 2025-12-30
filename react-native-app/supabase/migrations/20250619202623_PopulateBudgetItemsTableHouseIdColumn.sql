update public.budget_items bi
set house_id = s.selected_house_id
from public.settings s
where bi.user_id = s.user_id
  and bi.house_id is null;
