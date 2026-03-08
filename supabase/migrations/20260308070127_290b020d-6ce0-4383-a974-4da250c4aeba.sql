-- Recruiters can view applications for their jobs
CREATE POLICY "Recruiters can view job applications" ON public.job_applications 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = job_applications.job_id AND jobs.user_id = auth.uid())
);

-- Recruiters can update application status
CREATE POLICY "Recruiters can update job applications" ON public.job_applications 
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = job_applications.job_id AND jobs.user_id = auth.uid())
);

-- Recruiters can view candidate profiles for their applicants
CREATE POLICY "Recruiters can view applicant profiles" ON public.candidate_profiles 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.job_applications ja 
    JOIN public.jobs j ON j.id = ja.job_id 
    WHERE ja.candidate_user_id = candidate_profiles.user_id AND j.user_id = auth.uid()
  )
);