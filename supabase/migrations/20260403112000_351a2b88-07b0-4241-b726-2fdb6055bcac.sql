
DROP POLICY "Public can submit answers" ON public.assessment_assignments;
CREATE POLICY "Public can submit pending assignments" ON public.assessment_assignments FOR UPDATE USING (status = 'pending');
