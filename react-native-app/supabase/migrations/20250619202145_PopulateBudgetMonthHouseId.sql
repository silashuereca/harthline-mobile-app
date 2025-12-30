update public.budget_months bm
set house_id = s.selected_house_id
from public.settings s
where bm.user_id = s.user_id
  and bm.house_id is null;
