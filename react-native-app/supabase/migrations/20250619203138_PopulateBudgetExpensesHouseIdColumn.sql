update public.budget_expenses be
set house_id = s.selected_house_id
from public.settings s
where be.user_id = s.user_id
  and be.house_id is null;
