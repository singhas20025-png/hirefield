
-- Add questions column to assessments
ALTER TABLE public.assessments ADD COLUMN questions jsonb DEFAULT '[]'::jsonb;

-- Add meeting_url to interviews
ALTER TABLE public.interviews ADD COLUMN meeting_url text DEFAULT NULL;

-- Create assessment_assignments table
CREATE TABLE public.assessment_assignments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id uuid NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  candidate_email text NOT NULL,
  candidate_name text,
  token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  status text NOT NULL DEFAULT 'pending',
  submitted_answers jsonb DEFAULT '[]'::jsonb,
  score integer DEFAULT NULL,
  assigned_at timestamp with time zone NOT NULL DEFAULT now(),
  submitted_at timestamp with time zone DEFAULT NULL,
  user_id uuid NOT NULL
);

ALTER TABLE public.assessment_assignments ENABLE ROW LEVEL SECURITY;

-- Recruiters can manage their own assignments
CREATE POLICY "Users can view own assignments" ON public.assessment_assignments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create assignments" ON public.assessment_assignments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own assignments" ON public.assessment_assignments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own assignments" ON public.assessment_assignments FOR DELETE USING (auth.uid() = user_id);

-- Public can view assignment by token (for candidates taking the test)
CREATE POLICY "Public can view by token" ON public.assessment_assignments FOR SELECT USING (true);
-- Public can submit answers (update status and answers)
CREATE POLICY "Public can submit answers" ON public.assessment_assignments FOR UPDATE USING (true);
