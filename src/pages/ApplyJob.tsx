import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Clock, DollarSign, Building2, Upload, CheckCircle, Briefcase } from "lucide-react";

interface Job {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  type: string | null;
  salary: string | null;
  description: string | null;
  posted_date: string | null;
  user_id: string;
}

export default function ApplyJob() {
  const { slug, jobId } = useParams<{ slug: string; jobId: string }>();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    async function loadJob() {
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId!)
        .eq("status", "Open")
        .single();
      setJob(data as Job | null);
      setLoading(false);
    }
    if (jobId) loadJob();
  }, [jobId]);

  // Redirect to candidate auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/candidate/auth?redirect=/careers/${slug}/apply/${jobId}`);
    }
  }, [authLoading, user, navigate, slug, jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !job) return;
    setSubmitting(true);

    try {
      let resumeUrl: string | null = null;

      // Upload resume if provided
      if (resumeFile) {
        const fileExt = resumeFile.name.split(".").pop();
        const filePath = `${user.id}/${job.id}/resume.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(filePath, resumeFile, { upsert: true });
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage.from("resumes").getPublicUrl(filePath);
        resumeUrl = urlData.publicUrl;
      }

      // Get company profile
      const { data: companyData } = await supabase
        .from("company_profiles")
        .select("id")
        .eq("user_id", job.user_id)
        .single();

      // Create application with UTM tracking
      const { error } = await supabase.from("job_applications").insert({
        job_id: job.id,
        candidate_user_id: user.id,
        company_profile_id: companyData?.id || null,
        resume_url: resumeUrl,
        cover_letter: coverLetter || null,
        status: "submitted",
        routing_step: "applied",
        utm_source: searchParams.get("utm_source") || null,
        utm_medium: searchParams.get("utm_medium") || null,
        utm_campaign: searchParams.get("utm_campaign") || null,
      } as any);

      if (error) {
        if (error.code === "23505") {
          toast({ title: "Already applied", description: "You've already applied for this position.", variant: "destructive" });
        } else {
          throw error;
        }
      } else {
        setSubmitted(true);

        // Also create a candidate record for the recruiter
        await supabase.from("candidates").upsert({
          user_id: job.user_id,
          name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Applicant",
          email: user.email,
          role: job.title,
          stage: "Screening",
          source: "Career Page",
          applied_date: new Date().toISOString().split("T")[0],
        }, { onConflict: "id" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Skeleton className="h-96 w-full max-w-2xl rounded-xl" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">Job not found</h1>
          <p className="text-muted-foreground">This position may no longer be available.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-accent mx-auto" />
            <h2 className="text-2xl font-bold text-foreground">Application Submitted!</h2>
            <p className="text-muted-foreground">
              Your application for <strong>{job.title}</strong> has been received. You'll be notified about next steps.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <Button variant="outline" onClick={() => navigate(`/careers/${slug}`)}>
                View More Jobs
              </Button>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => navigate("/candidate/dashboard")}>
                My Applications
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Job Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-accent/15 text-accent">Open</Badge>
            </div>
            <CardTitle className="text-2xl">{job.title}</CardTitle>
            <CardDescription className="flex items-center gap-3 text-sm">
              {job.department && <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{job.department}</span>}
              {job.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>}
              {job.type && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{job.type}</span>}
              {job.salary && <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{job.salary}</span>}
            </CardDescription>
          </CardHeader>
          {job.description && (
            <CardContent>
              <p className="text-sm text-muted-foreground">{job.description}</p>
            </CardContent>
          )}
        </Card>

        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Apply for this Position</CardTitle>
            <CardDescription>Complete the form below to submit your application</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Resume / CV</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-accent/50 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    {resumeFile ? (
                      <p className="text-sm font-medium text-foreground">{resumeFile.name}</p>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-foreground">Click to upload your resume</p>
                        <p className="text-xs text-muted-foreground mt-1">PDF, DOC, or DOCX (max 20MB)</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover-letter">Cover Letter (optional)</Label>
                <Textarea
                  id="cover-letter"
                  placeholder="Tell us why you're a great fit for this role..."
                  rows={5}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
