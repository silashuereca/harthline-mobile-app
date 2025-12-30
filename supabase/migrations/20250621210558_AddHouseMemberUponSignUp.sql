set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user_house()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  new_house_id bigint;
BEGIN
  -- Create the house and capture its ID
  INSERT INTO public.houses (name, owner_id)
  VALUES ('My First House', NEW.id)
  RETURNING id INTO new_house_id;

  -- Create the settings entry with the captured house ID
  INSERT INTO public.settings (user_id, selected_house_id)
  VALUES (NEW.id, new_house_id);

  INSERT INTO public.house_members (member_id, house_id, role)
  VALUES (NEW.id, new_house_id, 'owner');

  RETURN NEW;
END;$function$
;


