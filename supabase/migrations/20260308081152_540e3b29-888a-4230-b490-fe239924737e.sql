
CREATE OR REPLACE FUNCTION public.notify_on_candidate_stage_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF OLD.stage IS DISTINCT FROM NEW.stage THEN
    INSERT INTO public.notifications (user_id, type, title, message, link, metadata)
    VALUES (
      NEW.user_id,
      'stage_change',
      'Stage Updated',
      NEW.name || ' moved from ' || OLD.stage || ' to ' || NEW.stage,
      '/candidates/' || NEW.id,
      jsonb_build_object('candidate_id', NEW.id, 'old_stage', OLD.stage, 'new_stage', NEW.stage, 'candidate_name', NEW.name)
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_candidate_stage_change
  AFTER UPDATE ON public.candidates
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_candidate_stage_change();
