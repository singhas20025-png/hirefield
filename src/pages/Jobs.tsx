import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Search, MapPin, Clock, Users, Briefcase, DollarSign,
  Building2, ExternalLink, MoreHorizontal,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  type: string | null;
  salary: string | null;
  status: string | null;
  posted_date: string | null;
  description: string | null;
  user_id: string;
  created_at: string;
  pipeline_stages: string[] | null;
}

const statusColors: Record<string, string> = {
  Open: "bg-success/15 text-success",
  Paused: "bg-warning/15 text-warning",
  Closed: "bg-muted text-muted-foreground",
  Draft: "bg-info/15 text-info",
};

const departments = ["Engineering", "Product", "Design", "Data", "Marketing", "Sales", "HR"];
const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
const locations = ["Remote", "New York, NY", "San Francisco, CA", "Austin, TX", "London, UK", "Berlin, DE"];

export default function Jobs() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [candidateCounts, setCandidateCounts] = useState<Record<string, number>>({});
  const [newJob, setNewJob] = useState({
    title: "", department: "Engineering", location: "Remote",
    type: "Full-time", salary: "", description: "",
  });
  const [pipelineStages, setPipelineStages] = useState<string[]>(
    ["Applied", "Screening", "Assessment", "Video Interview", "Final Review", "Offer"]
  );

  useEffect(() => {
    if (user) loadJobs();
  }, [user]);

  async function loadJobs() {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const jobsList = (data || []) as Job[];
    setJobs(jobsList);

    // Load candidate counts from job_applications
    if (jobsList.length > 0) {
      const { data: apps } = await supabase
        .from("job_applications")
        .select("job_id")
        .in("job_id", jobsList.map((j) => j.id));

      const counts: Record<string, number> = {};
      (apps || []).forEach((a) => {
        counts[a.job_id] = (counts[a.job_id] || 0) + 1;
      });
      setCandidateCounts(counts);
    }

    setLoading(false);
  }

  const filtered = jobs.filter((j) => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      (j.department?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchStatus = statusFilter === "All" || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreate = async () => {
    if (!newJob.title || !user) return;
    const { data, error } = await supabase
      .from("jobs")
      .insert({
        user_id: user.id,
        title: newJob.title,
        department: newJob.department,
        location: newJob.location,
        type: newJob.type,
        salary: newJob.salary || null,
        description: newJob.description || null,
        status: "Draft",
        posted_date: new Date().toISOString().split("T")[0],
        pipeline_stages: pipelineStages,
      } as any)
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setJobs([data as Job, ...jobs]);
    setNewJob({ title: "", department: "Engineering", location: "Remote", type: "Full-time", salary: "", description: "" });
    setPipelineStages(["Applied", "Screening", "Assessment", "Video Interview", "Final Review", "Offer"]);
    setDialogOpen(false);
    toast({ title: "Job Created", description: `${newJob.title} saved as draft` });
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    const { error } = await supabase
      .from("jobs")
      .update({ status: newStatus })
      .eq("id", jobId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setJobs((prev) => prev.map((j) => j.id === jobId ? { ...j, status: newStatus } : j));
    if (selectedJob?.id === jobId) {
      setSelectedJob((prev) => prev ? { ...prev, status: newStatus } : null);
    }
    toast({ title: "Updated", description: `Status changed to ${newStatus}` });
  };

  const stats = {
    open: jobs.filter((j) => j.status === "Open").length,
    total: jobs.length,
    candidates: Object.values(candidateCounts).reduce((sum, c) => sum + c, 0),
    filled: jobs.filter((j) => j.status === "Closed").length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map((i) => <Skeleton key={i} className="h-20 rounded-lg" />)}</div>
        <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-20 rounded-lg" />)}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Jobs & Positions</h1>
          <p className="text-muted-foreground mt-1">Manage open roles and track hiring progress</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />New Position
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Create New Position</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input placeholder="e.g. Senior Frontend Engineer" value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={newJob.department} onValueChange={(v) => setNewJob({ ...newJob, department: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select value={newJob.location} onValueChange={(v) => setNewJob({ ...newJob, location: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{locations.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Employment Type</Label>
                  <Select value={newJob.type} onValueChange={(v) => setNewJob({ ...newJob, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{jobTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Salary Range</Label>
                  <Input placeholder="e.g. $120k – $160k" value={newJob.salary}
                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Brief role description..." rows={3} value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} />
              </div>
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleCreate}>
                Create Position
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Open Roles", value: stats.open, icon: Briefcase, color: "text-accent" },
          { label: "Total Positions", value: stats.total, icon: Building2, color: "text-info" },
          { label: "Total Applicants", value: stats.candidates, icon: Users, color: "text-success" },
          { label: "Filled This Quarter", value: stats.filled, icon: DollarSign, color: "text-warning" },
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
          <Input placeholder="Search positions..." className="pl-9 h-9 bg-card border"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5">
          {["All", "Open", "Paused", "Draft", "Closed"].map((s) => (
            <Badge key={s} variant={statusFilter === s ? "default" : "secondary"}
              className={`cursor-pointer ${statusFilter === s ? "bg-accent text-accent-foreground" : ""}`}
              onClick={() => setStatusFilter(s)}>{s}</Badge>
          ))}
        </div>
      </div>

      {/* Job list + detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((job) => (
            <Card key={job.id}
              className={`cursor-pointer transition-all hover:shadow-md ${selectedJob?.id === job.id ? "ring-1 ring-accent" : ""}`}
              onClick={() => setSelectedJob(job)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{job.title}</h3>
                      <Badge variant="secondary" className={statusColors[job.status || "Draft"]}>{job.status || "Draft"}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {job.department && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{job.department}</span>}
                      {job.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>}
                      {job.type && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.type}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    {job.salary && <p className="text-sm font-medium text-foreground">{job.salary}</p>}
                    <p className="text-xs text-muted-foreground">{candidateCounts[job.id] || 0} applicants</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <Card><CardContent className="p-8 text-center text-muted-foreground">
              {jobs.length === 0 ? "No positions yet. Create your first job posting!" : "No positions found"}
            </CardContent></Card>
          )}
        </div>

        {/* Detail panel */}
        <div>
          {selectedJob ? (
            <Card className="sticky top-6">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className={statusColors[selectedJob.status || "Draft"]}>{selectedJob.status || "Draft"}</Badge>
                  <Select value={selectedJob.status || "Draft"} onValueChange={(v) => handleStatusChange(selectedJob.id, v)}>
                    <SelectTrigger className="h-7 w-24 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Draft", "Open", "Paused", "Closed"].map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <CardTitle className="text-lg mt-2">{selectedJob.title}</CardTitle>
                <CardDescription>{selectedJob.department} · {selectedJob.location}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Type</p>
                    <p className="font-medium text-foreground">{selectedJob.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Salary</p>
                    <p className="font-medium text-foreground">{selectedJob.salary || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Posted</p>
                    <p className="font-medium text-foreground">{selectedJob.posted_date || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Applicants</p>
                    <p className="font-medium text-foreground">{candidateCounts[selectedJob.id] || 0}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Pipeline Progress</p>
                  <Progress value={Math.min(((candidateCounts[selectedJob.id] || 0) / 30) * 100, 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{candidateCounts[selectedJob.id] || 0}/30 target</p>
                </div>

                {selectedJob.description && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Description</p>
                    <p className="text-sm text-muted-foreground">{selectedJob.description}</p>
                  </div>
                )}

                <Button variant="outline" size="sm" className="w-full gap-1.5"
                  onClick={() => window.open(`/careers/`, "_blank")}>
                  <ExternalLink className="h-3.5 w-3.5" />View on Career Page
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground text-sm">
                Select a position to view details
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
