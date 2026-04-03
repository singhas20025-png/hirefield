import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Code, MessageSquare, Target, Plus, Loader2, Send, Edit, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { AssessmentQuestionEditor, type Question } from "@/components/AssessmentQuestionEditor";
import { AssessmentSendDialog } from "@/components/AssessmentSendDialog";

const categoryIcons: Record<string, typeof Code> = {
  Coding: Code,
  Psychometric: Brain,
  Aptitude: Target,
  Behavioral: MessageSquare,
};

const Assessments = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Coding", max_score: "100" });
  const [editingAssessment, setEditingAssessment] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sendTarget, setSendTarget] = useState<{ id: string; name: string } | null>(null);

  const { data: assessments = [], isLoading } = useQuery({
    queryKey: ["assessments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch assignment counts
  const { data: assignmentCounts = {} } = useQuery({
    queryKey: ["assessment-assignment-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assessment_assignments" as any)
        .select("assessment_id, status");
      if (error) return {};
      const counts: Record<string, { total: number; submitted: number }> = {};
      (data as any[]).forEach((a: any) => {
        if (!counts[a.assessment_id]) counts[a.assessment_id] = { total: 0, submitted: 0 };
        counts[a.assessment_id].total++;
        if (a.status === "submitted") counts[a.assessment_id].submitted++;
      });
      return counts;
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("assessments").insert({
        name: form.name,
        category: form.category,
        max_score: parseInt(form.max_score) || 100,
        user_id: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      toast({ title: "Assessment Created", description: `"${form.name}" has been created.` });
      setOpen(false);
      setForm({ name: "", category: "Coding", max_score: "100" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const saveQuestionsMutation = useMutation({
    mutationFn: async () => {
      if (!editingAssessment) return;
      const { error } = await supabase
        .from("assessments")
        .update({ questions: questions as any })
        .eq("id", editingAssessment.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      toast({ title: "Questions Saved", description: "Assessment questions updated." });
      setEditingAssessment(null);
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleSubmit = () => {
    if (!form.name) {
      toast({ title: "Missing fields", description: "Assessment name is required.", variant: "destructive" });
      return;
    }
    createMutation.mutate();
  };

  const openQuestionEditor = (assessment: any) => {
    setEditingAssessment(assessment);
    setQuestions((assessment.questions as Question[]) || []);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assessments</h1>
          <p className="text-muted-foreground text-sm mt-1">Aptitude, psychometric & skill tests</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              Create Assessment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Assessment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Assessment Name *</Label>
                <Input
                  placeholder="e.g. Frontend Technical Assessment"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Coding", "Psychometric", "Aptitude", "Behavioral"].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Max Score</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={form.max_score}
                  onChange={(e) => setForm({ ...form, max_score: e.target.value })}
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Assessment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Question Editor Dialog */}
      <Dialog open={!!editingAssessment} onOpenChange={(o) => !o && setEditingAssessment(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Questions — {editingAssessment?.name}</DialogTitle>
          </DialogHeader>
          <AssessmentQuestionEditor questions={questions} onChange={setQuestions} />
          <Button
            onClick={() => saveQuestionsMutation.mutate()}
            disabled={saveQuestionsMutation.isPending}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {saveQuestionsMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Questions
          </Button>
        </DialogContent>
      </Dialog>

      {/* Send Dialog */}
      {sendTarget && (
        <AssessmentSendDialog
          open={!!sendTarget}
          onOpenChange={(o) => !o && setSendTarget(null)}
          assessmentId={sendTarget.id}
          assessmentName={sendTarget.name}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : assessments.length === 0 ? (
        <Card className="border-none shadow-sm">
          <CardContent className="p-8 text-center text-muted-foreground">
            No assessments yet. Click "Create Assessment" to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {assessments.map((a) => {
            const Icon = categoryIcons[a.category || "Coding"] || Code;
            const qCount = ((a as any).questions as any[] || []).length;
            const counts = (assignmentCounts as any)[a.id];
            return (
              <Card key={a.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-secondary">
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">{a.name}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{a.category}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className={a.completed_at ? "bg-success/15 text-success" : "bg-accent/15 text-accent"}>
                      {a.completed_at ? "Completed" : "Active"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6 mt-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Questions</p>
                      <p className="font-semibold">{qCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Max Score</p>
                      <p className="font-semibold">{a.max_score}</p>
                    </div>
                    {counts && (
                      <div>
                        <p className="text-xs text-muted-foreground">Submissions</p>
                        <p className="font-semibold">{counts.submitted}/{counts.total}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => openQuestionEditor(a)}>
                      <Edit className="h-3 w-3 mr-1" /> Questions
                    </Button>
                    <Button
                      size="sm"
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={() => setSendTarget({ id: a.id, name: a.name })}
                      disabled={qCount === 0}
                    >
                      <Send className="h-3 w-3 mr-1" /> Send to Candidate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Assessments;
