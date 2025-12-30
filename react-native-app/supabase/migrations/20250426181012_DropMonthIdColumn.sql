DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'budget_expenses_budget_month_id_fkey'
      AND table_name = 'budget_expenses'
  ) THEN
    ALTER TABLE public.budget_expenses DROP CONSTRAINT budget_expenses_budget_month_id_fkey;
  END IF;
END
$$;

ALTER TABLE IF EXISTS public.budget_expenses DROP COLUMN IF EXISTS budget_month_id;

