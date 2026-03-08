import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Search, MapPin, Clock, Users, Briefcase, DollarSign,
  Building2, ExternalLink, MoreHorizontal,
} from "lucide-react";
import { mockCandidates } from "@/lib/mock-data";

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  status: "Open" | "Paused" | "Closed" | "Draft";
  postedDate: string;
  candidates: number;
  description: string;
  linkedCandidateIds: string[];
}

const initialJobs: Job[] = [
  {
    id: "j1", title: "Senior Frontend Engineer", department: "Engineering", location: "Remote",
    type: "Full-time", salary: "$140k – $180k", status: "Open", postedDate: "2026-02-20",
    candidates: 24, description: "We're looking for a senior frontend engineer to lead our UI efforts.",
    linkedCandidateIds: ["1", "7"],
  },
  {
    id: "j2", title: "Product Manager", department: "Product", location: "New York, NY",
    type: "Full-time", salary: "$130k – $165k", status: "Open", postedDate: "2026-02-25",
    candidates: 18, description: "Join our product team to drive roadmap and strategy.",
    linkedCandidateIds: ["2"],
  },
  {
    id: "j3", title: "Data Scientist", department: "Data", location: "San Francisco, CA",
    type: "Full-time", salary: "$150k – $190k", status: "Open", postedDate: "2026-03-01",
    candidates: 12, description: "Build ML models and derive insights from large datasets.",
    linkedCandidateIds: ["3"],
  },
  {
    id: "j4", title: "UX Designer", department: "Design", location: "Remote",
    type: "Contract", salary: "$90k – $120k", status: "Paused", postedDate: "2026-02-10",
    candidates: 8, description: "Design intuitive experiences across our product suite.",
    linkedCandidateIds: ["5"],
  },
  {
    id: "j5", title: "Backend Engineer", department: "Engineering", location: "Austin, TX",
    type: "Full-time", salary: "$135k – $175k", status: "Open", postedDate: "2026-02-18",
    candidates: 15, description: "Build scalable APIs and microservices infrastructure.",
    linkedCandidateIds: ["4"],
  },
  {
    id: "j6", title: "DevOps Engineer", department: "Engineering", location: "Remote",
    type: "Full-time", salary: "$130k – $160k", status: "Draft", postedDate: "2026-03-05",
    candidates: 0, description: "Manage CI/CD pipelines and cloud infrastructure.",
    linkedCandidateIds: ["6"],
  },
];

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
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "", department: "Engineering", location: "Remote",
    type: "Full-time", salary: "", description: "",
  });

  const filtered = jobs.filter((j) => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreate = () => {
    if (!newJob.title) return;
    const job: Job = {
      id: `j${Date.now()}`,
      ...newJob,
      status: "Draft",
      postedDate: new Date().toISOString().split("T")[0],
      candidates: 0,
      linkedCandidateIds: [],
    };
    setJobs([job, ...jobs]);
    setNewJob({ title: "", department: "Engineering", location: "Remote", type: "Full-time", salary: "", description: "" });
    setDialogOpen(false);
    toast({ title: "Job Created", description: `${job.title} saved as draft` });
  };

  const stats = {
    open: jobs.filter((j) => j.status === "Open").length,
    total: jobs.length,
    candidates: jobs.reduce((sum, j) => sum + j.candidates, 0),
    filled: jobs.filter((j) => j.status === "Closed").length,
  };

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
              <Plus className="h-4 w-4 mr-2" />
              New Position
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Position</DialogTitle>
            </DialogHeader>
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
          { label: "Total Candidates", value: stats.candidates, icon: Users, color: "text-success" },
          { label: "Filled This Quarter", value: stats.filled, icon: DollarSign, color: "text-warning" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-9 w-9 rounded-lg bg-muted flex items-center justify-center`}>
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
            <Badge
              key={s}
              variant={statusFilter === s ? "default" : "secondary"}
              className={`cursor-pointer ${statusFilter === s ? "bg-accent text-accent-foreground" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </Badge>
          ))}
        </div>
      </div>

      {/* Job list + detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((job) => (
            <Card
              key={job.id}
              className={`cursor-pointer transition-all hover:shadow-md ${selectedJob?.id === job.id ? "ring-1 ring-accent" : ""}`}
              onClick={() => setSelectedJob(job)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{job.title}</h3>
                      <Badge variant="secondary" className={statusColors[job.status]}>{job.status}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{job.department}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.type}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{job.salary}</p>
                    <p className="text-xs text-muted-foreground">{job.candidates} candidates</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <Card><CardContent className="p-8 text-center text-muted-foreground">No positions found</CardContent></Card>
          )}
        </div>

        {/* Detail panel */}
        <div>
          {selectedJob ? (
            <Card className="sticky top-6">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className={statusColors[selectedJob.status]}>{selectedJob.status}</Badge>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
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
                    <p className="font-medium text-foreground">{selectedJob.salary}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Posted</p>
                    <p className="font-medium text-foreground">{selectedJob.postedDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Candidates</p>
                    <p className="font-medium text-foreground">{selectedJob.candidates}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Pipeline Progress</p>
                  <Progress value={Math.min((selectedJob.candidates / 30) * 100, 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{selectedJob.candidates}/30 target</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Description</p>
                  <p className="text-sm text-muted-foreground">{selectedJob.description}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Linked Candidates</p>
                  {selectedJob.linkedCandidateIds.length > 0 ? (
                    <div className="space-y-2">
                      {selectedJob.linkedCandidateIds.map((cid) => {
                        const c = mockCandidates.find((mc) => mc.id === cid);
                        if (!c) return null;
                        return (
                          <div key={c.id} className="flex items-center justify-between p-2 rounded-md bg-muted/40">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="bg-secondary text-[10px] font-medium">{c.avatar}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-xs font-medium text-foreground">{c.name}</p>
                                <p className="text-[10px] text-muted-foreground">{c.stage}</p>
                              </div>
                            </div>
                            <span className={`text-xs font-bold ${c.score >= 80 ? "text-success" : c.score >= 60 ? "text-warning" : "text-destructive"}`}>
                              {c.score}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No candidates linked yet</p>
                  )}
                </div>

                <Button variant="outline" size="sm" className="w-full gap-1.5">
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Full Posting
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
