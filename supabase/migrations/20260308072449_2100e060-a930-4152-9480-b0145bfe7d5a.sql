
-- Fix: Replace overly permissive INSERT policy with a restrictive one
DROP POLICY "System can insert notifications" ON public.notifications;

-- Allow inserts only via triggers (SECURITY DEFINER functions)
-- No direct INSERT policy needed since triggers use SECURITY DEFINER

-- Create function to notify recruiter when a candidate applies
CREATE OR REPLACE FUNCTION public.notify_on_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _job_title text;
  _recruiter_id uuid;
  _candidate_name text;
BEGIN
  -- Get job info
  SELECT title, user_id INTO _job_title, _recruiter_id
  FROM public.jobs WHERE id = NEW.job_id;

  -- Get candidate name
  SELECT full_name INTO _candidate_name
  FROM public.candidate_profiles WHERE user_id = NEW.candidate_user_id;

  -- Notify recruiter
  INSERT INTO public.notifications (user_id, type, title, message, link, metadata)
  VALUES (
    _recruiter_id,
    'new_application',
    'New Application',
    COALESCE(_candidate_name, 'A candidate') || ' applied for ' || COALESCE(_job_title, 'a position'),
    '/applications',
    jsonb_build_object('job_id', NEW.job_id, 'application_id', NEW.id, 'candidate_user_id', NEW.candidate_user_id)
  );

  -- Auto-advance routing to first pipeline stage
  UPDATE public.job_applications SET routing_step = 'screening' WHERE id = NEW.id AND routing_step = 'applied';

  RETURN NEW;
END;
$$;

-- Create function to notify on status change
CREATE OR REPLACE FUNCTION public.notify_on_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _job_title text;
  _recruiter_id uuid;
  _candidate_name text;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    SELECT title, user_id INTO _job_title, _recruiter_id
    FROM public.jobs WHERE id = NEW.job_id;

    SELECT full_name INTO _candidate_name
    FROM public.candidate_profiles WHERE user_id = NEW.candidate_user_id;

    -- Notify candidate about status change
    INSERT INTO public.notifications (user_id, type, title, message, link, metadata)
    VALUES (
      NEW.candidate_user_id,
      'status_change',
      'Application Update',
      'Your application for ' || COALESCE(_job_title, 'a position') || ' has been updated to: ' || NEW.status,
      '/candidate/dashboard',
      jsonb_build_object('job_id', NEW.job_id, 'application_id', NEW.id, 'new_status', NEW.status)
    );

    -- Notify recruiter about status change
    INSERT INTO public.notifications (user_id, type, title, message, link, metadata)
    VALUES (
      _recruiter_id,
      'status_change',
      'Status Updated',
      COALESCE(_candidate_name, 'An applicant') || '''s application for ' || COALESCE(_job_title, 'a position') || ' changed to: ' || NEW.status,
      '/applications',
      jsonb_build_object('job_id', NEW.job_id, 'application_id', NEW.id, 'new_status', NEW.status)
    );
  END IF;

  -- Notify on routing step change
  IF OLD.routing_step IS DISTINCT FROM NEW.routing_step THEN
    SELECT title, user_id INTO _job_title, _recruiter_id
    FROM public.jobs WHERE id = NEW.job_id;

    INSERT INTO public.notifications (user_id, type, title, message, link, metadata)
    VALUES (
      NEW.candidate_user_id,
      'routing_update',
      'Application Progress',
      'Your application for ' || COALESCE(_job_title, 'a position') || ' has moved to: ' || REPLACE(NEW.routing_step, '_', ' '),
      '/candidate/dashboard',
      jsonb_build_object('job_id', NEW.job_id, 'application_id', NEW.id, 'routing_step', NEW.routing_step)
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create triggers
CREATE TRIGGER on_application_created
  AFTER INSERT ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_application();

CREATE TRIGGER on_application_updated
  AFTER UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_status_change();
