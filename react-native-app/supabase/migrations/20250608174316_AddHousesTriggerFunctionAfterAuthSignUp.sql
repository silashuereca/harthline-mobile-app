set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user_house()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.houses (name, owner_id)
  values ('My First House', new.id);
  return new;
end;
$function$
;


