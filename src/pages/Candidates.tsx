import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, LayoutList, Columns3, ArrowRight, Trash2, X, CheckSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CandidateKanban } from "@/components/CandidateKanban";

export const stageColors: Record<string, string> = {
  Screening: "bg-info/15 text-info",
  Assessment: "bg-warning/15 text-warning",
  Interview: "bg-accent/15 text-accent",
  Offer: "bg-success/15 text-success",
  Hired: "bg-success/15 text-success",
  Rejected: "bg-destructive/15 text-destructive",
};

const stages = ["All", "Screening", "Assessment", "Interview", "Offer", "Hired", "Rejected"];

export interface Candidate {
  id: string;
  name: string;
  role: string;
  stage: string;
  score: number | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  location: string | null;
  applied_date: string | null;
  skills: string[] | null;
  education: string | null;
  experience: string | null;
  notes: string | null;
  user_id: string;
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const Candidates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [view, setView] = useState<"list" | "kanban">("list");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: "", role: "", email: "", source: "LinkedIn", stage: "Screening",
  });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStage, setBulkStage] = useState("");
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    if (user) loadCandidates();
  }, [user]);

  async function loadCandidates() {
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setCandidates((data || []) as Candidate[]);
    }
    setLoading(false);
  }

  async function handleCreate() {
    if (!newCandidate.name || !newCandidate.role || !user) return;
    const { data, error } = await supabase
      .from("candidates")
      .insert({
        user_id: user.id,
        name: newCandidate.name,
        role: newCandidate.role,
        email: newCandidate.email || null,
        source: newCandidate.source,
        stage: newCandidate.stage,
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setCandidates([data as Candidate, ...candidates]);
    setNewCandidate({ name: "", role: "", email: "", source: "LinkedIn", stage: "Screening" });
    setDialogOpen(false);
    toast({ title: "Candidate Added", description: `${newCandidate.name} added to pipeline` });
  }

  async function updateStage(candidateId: string, newStage: string) {
    const { error } = await supabase
      .from("candidates")
      .update({ stage: newStage })
      .eq("id", candidateId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage: newStage } : c))
    );
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((c) => c.id)));
    }
  }

  async function handleBulkMove() {
    if (!bulkStage || selected.size === 0) return;
    const ids = Array.from(selected);
    const { error } = await supabase
      .from("candidates")
      .update({ stage: bulkStage })
      .in("id", ids);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setCandidates((prev) =>
      prev.map((c) => (ids.includes(c.id) ? { ...c, stage: bulkStage } : c))
    );
    setSelected(new Set());
    setBulkStage("");
    toast({ title: "Candidates Moved", description: `${ids.length} candidate(s) moved to ${bulkStage}` });
  }

  async function handleBulkDelete() {
    const ids = Array.from(selected);
    const { error } = await supabase
      .from("candidates")
      .delete()
      .in("id", ids);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setCandidates((prev) => prev.filter((c) => !ids.includes(c.id)));
    setSelected(new Set());
    setBulkDeleteOpen(false);
    toast({ title: "Deleted", description: `${ids.length} candidate(s) removed` });
  }

  const filtered = candidates.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === "All" || c.stage === stageFilter;
    return matchSearch && matchStage;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Candidates</h1>
          <p className="text-muted-foreground text-sm mt-1">{candidates.length} candidates in pipeline</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border bg-card p-0.5">
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="sm"
              className="h-7 px-2"
              onClick={() => setView("list")}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "kanban" ? "default" : "ghost"}
              size="sm"
              className="h-7 px-2"
              onClick={() => setView("kanban")}
            >
              <Columns3 className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Candidate
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle>Add Candidate</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input placeholder="e.g. Sarah Chen" value={newCandidate.name}
                    onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Role / Position</Label>
                  <Input placeholder="e.g. Senior Frontend Engineer" value={newCandidate.role}
                    onChange={(e) => setNewCandidate({ ...newCandidate, role: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="candidate@email.com" value={newCandidate.email}
                    onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Source</Label>
                    <Select value={newCandidate.source} onValueChange={(v) => setNewCandidate({ ...newCandidate, source: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["LinkedIn", "Referral", "Indeed", "Career Page", "GitHub", "Portfolio", "Other"].map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Stage</Label>
                    <Select value={newCandidate.stage} onValueChange={(v) => setNewCandidate({ ...newCandidate, stage: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {stages.filter((s) => s !== "All").map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleCreate}>
                  Add Candidate
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search candidates..." className="pl-9 h-9 bg-card border"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {view === "list" ? (
        <>
          <div className="flex gap-2 flex-wrap">
            {stages.map((s) => (
              <Badge
                key={s}
                variant={stageFilter === s ? "default" : "secondary"}
                className={`cursor-pointer ${stageFilter === s ? "bg-accent text-accent-foreground" : ""}`}
                onClick={() => setStageFilter(s)}
              >
                {s}
              </Badge>
            ))}
          </div>

          {filtered.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                {candidates.length === 0
                  ? "No candidates yet. Add your first candidate or wait for applications."
                  : "No matching candidates found."}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filtered.map((c) => (
                <Link to={`/candidates/${c.id}`} key={c.id}>
                  <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-secondary text-sm font-medium">
                              {getInitials(c.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{c.name}</p>
                            <p className="text-sm text-muted-foreground">{c.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                            <p className="text-xs text-muted-foreground">Source</p>
                            <p className="text-sm font-medium">{c.source || "—"}</p>
                          </div>
                          <div className="text-right hidden sm:block">
                            <p className="text-xs text-muted-foreground">Score</p>
                            <p className={`text-sm font-bold ${(c.score ?? 0) >= 80 ? "text-success" : (c.score ?? 0) >= 60 ? "text-warning" : "text-destructive"}`}>
                              {c.score ?? "—"}%
                            </p>
                          </div>
                          <Badge variant="secondary" className={stageColors[c.stage] || ""}>
                            {c.stage}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <CandidateKanban candidates={candidates} onStageChange={updateStage} />
      )}
    </div>
  );
};

export default Candidates;
