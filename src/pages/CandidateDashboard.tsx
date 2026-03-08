import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, Calendar, Clock, FileText, LogOut, MapPin, User } from "lucide-react";

interface Application {
  id: string;
  status: string;
  routing_step: string;
  created_at: string;
  resume_url: string | null;
  jobs: {
    title: string;
    department: string | null;
    location: string | null;
    type: string | null;
  } | null;
}

const statusColors: Record<string, string> = {
  submitted: "bg-info/15 text-info",
  reviewing: "bg-warning/15 text-warning",
  interview: "bg-accent/15 text-accent",
  offered: "bg-success/15 text-success",
  rejected: "bg-destructive/15 text-destructive",
  hired: "bg-success/15 text-success",
};

const routingLabels: Record<string, string> = {
  applied: "Application Received",
  screening: "Under Screening",
  aptitude_test: "Aptitude Test",
  psychometric_test: "Psychometric Test",
  video_interview: "Video Interview",
  final_review: "Final Review",
  completed: "Process Complete",
};

export default function CandidateDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/candidate/auth");
      return;
    }
    if (user) {
      loadApplications();
    }
  }, [user, authLoading]);

  async function loadApplications() {
    const { data } = await supabase
      .from("job_applications")
      .select("*, jobs(title, department, location, type)")
      .eq("candidate_user_id", user!.id)
      .order("created_at", { ascending: false });
    setApplications((data as Application[]) || []);
    setLoading(false);
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/candidate/auth");
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid gap-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-lg" />)}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">My Applications</h1>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-1" /> Sign Out
        </Button>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total", value: applications.length, color: "text-foreground" },
            { label: "Active", value: applications.filter((a) => !["rejected", "hired"].includes(a.status)).length, color: "text-accent" },
            { label: "Interviews", value: applications.filter((a) => a.routing_step === "video_interview").length, color: "text-info" },
            { label: "Offers", value: applications.filter((a) => a.status === "offered").length, color: "text-success" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Applications */}
        {applications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center space-y-3">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="font-semibold text-foreground">No applications yet</h3>
              <p className="text-sm text-muted-foreground">Browse career pages and apply for positions to see them here.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <Card key={app.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{app.jobs?.title || "Unknown Position"}</h3>
                        <Badge variant="secondary" className={statusColors[app.status] || ""}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {app.jobs?.department && <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{app.jobs.department}</span>}
                        {app.jobs?.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{app.jobs.location}</span>}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Applied {new Date(app.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {routingLabels[app.routing_step] || app.routing_step}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
