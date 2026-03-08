import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Search, Inbox, FileText, User, MapPin, Briefcase, Calendar,
  Clock, Download, ChevronRight, Filter, Eye,
} from "lucide-react";

interface Application {
  id: string;
  status: string;
  routing_step: string;
  resume_url: string | null;
  cover_letter: string | null;
  created_at: string;
  updated_at: string;
  candidate_user_id: string;
  job_id: string;
  jobs: {
    title: string;
    department: string | null;
    location: string | null;
    type: string | null;
  } | null;
  candidate_profiles: {
    full_name: string;
    email: string;
    phone: string | null;
    location: string | null;
    headline: string | null;
    linkedin_url: string | null;
    portfolio_url: string | null;
    skills: string[];
    experience_years: number | null;
  } | null;
}

const statusOptions = [
  { value: "submitted", label: "Submitted", color: "bg-muted text-muted-foreground" },
  { value: "reviewing", label: "Reviewing", color: "bg-info/15 text-info" },
  { value: "shortlisted", label: "Shortlisted", color: "bg-accent/15 text-accent" },
  { value: "interview", label: "Interview", color: "bg-warning/15 text-warning" },
  { value: "offered", label: "Offered", color: "bg-success/15 text-success" },
  { value: "hired", label: "Hired", color: "bg-success/15 text-success" },
  { value: "rejected", label: "Rejected", color: "bg-destructive/15 text-destructive" },
];

const routingSteps = [
  { value: "applied", label: "Applied" },
  { value: "screening", label: "Screening" },
  { value: "aptitude_test", label: "Aptitude Test" },
  { value: "psychometric_test", label: "Psychometric Test" },
  { value: "video_interview", label: "Video Interview" },
  { value: "final_review", label: "Final Review" },
  { value: "completed", label: "Completed" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getStatusInfo(status: string) {
  return statusOptions.find((s) => s.value === status) || statusOptions[0];
}

export default function ApplicationsInbox() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    if (user) loadApplications();
  }, [user]);

  async function loadApplications() {
    // Get applications for jobs owned by this recruiter
    const { data: jobs } = await supabase
      .from("jobs")
      .select("id")
      .eq("user_id", user!.id);

    if (!jobs || jobs.length === 0) {
      setApplications([]);
      setLoading(false);
      return;
    }

    const jobIds = jobs.map((j) => j.id);

    const { data, error } = await supabase
      .from("job_applications")
      .select(`
        *,
        jobs(title, department, location, type),
        candidate_profiles!job_applications_candidate_user_id_fkey(
          full_name, email, phone, location, headline, linkedin_url, portfolio_url, skills, experience_years
        )
      `)
      .in("job_id", jobIds)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading applications:", error);
      // Fallback: load without the join that might fail
      const { data: fallbackData } = await supabase
        .from("job_applications")
        .select("*, jobs(title, department, location, type)")
        .in("job_id", jobIds)
        .order("created_at", { ascending: false });
      setApplications((fallbackData as Application[]) || []);
    } else {
      setApplications((data as Application[]) || []);
    }
    setLoading(false);
  }

  async function updateStatus(appId: string, newStatus: string) {
    const { error } = await supabase
      .from("job_applications")
      .update({ status: newStatus })
      .eq("id", appId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );
    if (selectedApp?.id === appId) {
      setSelectedApp((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    toast({ title: "Updated", description: `Application status changed to ${newStatus}` });
  }

  async function updateRoutingStep(appId: string, step: string) {
    const { error } = await supabase
      .from("job_applications")
      .update({ routing_step: step })
      .eq("id", appId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, routing_step: step } : a))
    );
    if (selectedApp?.id === appId) {
      setSelectedApp((prev) => (prev ? { ...prev, routing_step: step } : null));
    }
    toast({ title: "Updated", description: `Routing step changed to ${step}` });
  }

  const filtered = applications.filter((a) => {
    const name = a.candidate_profiles?.full_name || "";
    const jobTitle = a.jobs?.title || "";
    const matchSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      jobTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: applications.length,
    new: applications.filter((a) => a.status === "submitted").length,
    reviewing: applications.filter((a) => a.status === "reviewing").length,
    shortlisted: applications.filter((a) => a.status === "shortlisted" || a.status === "interview").length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Applications Inbox</h1>
        <p className="text-muted-foreground mt-1">Review and manage incoming job applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Applications", value: stats.total, icon: Inbox, color: "text-foreground" },
          { label: "New / Unreviewed", value: stats.new, icon: FileText, color: "text-info" },
          { label: "In Review", value: stats.reviewing, icon: Eye, color: "text-warning" },
          { label: "Shortlisted", value: stats.shortlisted, icon: User, color: "text-accent" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or job title..."
            className="pl-9 h-9 bg-card border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {[{ value: "all", label: "All" }, ...statusOptions].map((s) => (
            <Badge
              key={s.value}
              variant={statusFilter === s.value ? "default" : "secondary"}
              className={`cursor-pointer ${statusFilter === s.value ? "bg-accent text-accent-foreground" : ""}`}
              onClick={() => setStatusFilter(s.value)}
            >
              {s.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Application list */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center space-y-3">
            <Inbox className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="font-semibold text-foreground">
              {applications.length === 0 ? "No applications yet" : "No matching applications"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {applications.length === 0
                ? "Applications from your career page will appear here."
                : "Try adjusting your search or filters."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((app) => {
            const name = app.candidate_profiles?.full_name || "Unknown Applicant";
            const statusInfo = getStatusInfo(app.status);

            return (
              <Card
                key={app.id}
                className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => {
                  setSelectedApp(app);
                  setDetailOpen(true);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-secondary text-xs font-medium">
                        {getInitials(name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground truncate">{name}</h3>
                        <Badge variant="secondary" className={statusInfo.color}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {app.jobs?.title || "Unknown Job"}
                        </span>
                        {app.candidate_profiles?.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {app.candidate_profiles.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(app.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {app.resume_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(app.resume_url!, "_blank");
                          }}
                        >
                          <Download className="h-3.5 w-3.5" />
                          Resume
                        </Button>
                      )}
                      <Select
                        value={app.status}
                        onValueChange={(v) => {
                          updateStatus(app.id, v);
                        }}
                      >
                        <SelectTrigger
                          className="h-8 w-28 text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedApp && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">Application Details</DialogTitle>
              </DialogHeader>

              <div className="space-y-6 pt-2">
                {/* Candidate info */}
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-secondary text-sm font-medium">
                      {getInitials(selectedApp.candidate_profiles?.full_name || "?")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-foreground">
                      {selectedApp.candidate_profiles?.full_name || "Unknown"}
                    </h2>
                    {selectedApp.candidate_profiles?.headline && (
                      <p className="text-sm text-muted-foreground">{selectedApp.candidate_profiles.headline}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span>{selectedApp.candidate_profiles?.email}</span>
                      {selectedApp.candidate_profiles?.phone && <span>{selectedApp.candidate_profiles.phone}</span>}
                      {selectedApp.candidate_profiles?.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />{selectedApp.candidate_profiles.location}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-2">
                      {selectedApp.candidate_profiles?.linkedin_url && (
                        <a href={selectedApp.candidate_profiles.linkedin_url} target="_blank" rel="noopener noreferrer">
                          <Badge variant="outline" className="text-xs cursor-pointer hover:bg-muted">LinkedIn</Badge>
                        </a>
                      )}
                      {selectedApp.candidate_profiles?.portfolio_url && (
                        <a href={selectedApp.candidate_profiles.portfolio_url} target="_blank" rel="noopener noreferrer">
                          <Badge variant="outline" className="text-xs cursor-pointer hover:bg-muted">Portfolio</Badge>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Job & meta */}
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Applied For</p>
                        <p className="font-medium text-foreground">{selectedApp.jobs?.title}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Department</p>
                        <p className="font-medium text-foreground">{selectedApp.jobs?.department || "—"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Applied On</p>
                        <p className="font-medium text-foreground">{new Date(selectedApp.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Experience</p>
                        <p className="font-medium text-foreground">
                          {selectedApp.candidate_profiles?.experience_years
                            ? `${selectedApp.candidate_profiles.experience_years} years`
                            : "—"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Skills */}
                {selectedApp.candidate_profiles?.skills && selectedApp.candidate_profiles.skills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedApp.candidate_profiles.skills.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cover letter */}
                {selectedApp.cover_letter && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Cover Letter</p>
                    <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground whitespace-pre-wrap">
                      {selectedApp.cover_letter}
                    </div>
                  </div>
                )}

                {/* Resume */}
                {selectedApp.resume_url && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Resume</p>
                    <a href={selectedApp.resume_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Download className="h-3.5 w-3.5" />
                        Download Resume
                      </Button>
                    </a>
                  </div>
                )}

                {/* Status & Routing controls */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Application Status</p>
                    <Select value={selectedApp.status} onValueChange={(v) => updateStatus(selectedApp.id, v)}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((s) => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Routing Step</p>
                    <Select value={selectedApp.routing_step} onValueChange={(v) => updateRoutingStep(selectedApp.id, v)}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {routingSteps.map((s) => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
