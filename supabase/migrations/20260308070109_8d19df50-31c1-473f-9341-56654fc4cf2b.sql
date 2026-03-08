-- Company profiles for career pages
CREATE TABLE public.company_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  cover_image_url TEXT,
  description TEXT,
  culture_description TEXT,
  website_url TEXT,
  industry TEXT,
  company_size TEXT,
  headquarters TEXT,
  office_photos TEXT[] DEFAULT '{}',
  brand_color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own company" ON public.company_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create company" ON public.company_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own company" ON public.company_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Public can view companies" ON public.company_profiles FOR SELECT USING (true);
CREATE TRIGGER update_company_profiles_updated_at BEFORE UPDATE ON public.company_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Candidate accounts (separate from recruiter auth)
CREATE TABLE public.candidate_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  resume_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  headline TEXT,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  experience_years INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Candidates can view own profile" ON public.candidate_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Candidates can create profile" ON public.candidate_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Candidates can update profile" ON public.candidate_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER update_candidate_profiles_updated_at BEFORE UPDATE ON public.candidate_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Job applications
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_profile_id UUID REFERENCES public.company_profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'submitted',
  resume_url TEXT,
  cover_letter TEXT,
  answers JSONB DEFAULT '{}',
  routing_step TEXT DEFAULT 'applied',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(job_id, candidate_user_id)
);
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Candidates can view own applications" ON public.job_applications FOR SELECT USING (auth.uid() = candidate_user_id);
CREATE POLICY "Candidates can create applications" ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = candidate_user_id);
CREATE POLICY "Candidates can update own applications" ON public.job_applications FOR UPDATE USING (auth.uid() = candidate_user_id);
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Make jobs publicly viewable (for career pages)
CREATE POLICY "Public can view open jobs" ON public.jobs FOR SELECT USING (status = 'Open');

-- Storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);
CREATE POLICY "Candidates can upload resumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.uid() IS NOT NULL);
CREATE POLICY "Candidates can view own resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes' AND auth.uid() IS NOT NULL);