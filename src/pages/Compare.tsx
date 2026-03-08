import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { mockCandidates, stageColors } from "@/lib/mock-data";
import { getCandidateDetail, type CandidateDetail } from "@/lib/candidate-detail-data";
import { GitCompareArrows, Star, X, Plus } from "lucide-react";

export default function Compare() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["1", "4"]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const candidates = selectedIds
    .map((id) => getCandidateDetail(id))
    .filter(Boolean) as CandidateDetail[];

  const toggleCandidate = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 4 ? [...prev, id] : prev,
    );
  };

  const removeCandidate = (id: string) => {
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  // Collect all unique skills across selected candidates
  const allSkills = [...new Set(candidates.flatMap((c) => c.skills))];

  // Collect all unique assessment names
  const allAssessments = [...new Set(candidates.flatMap((c) => c.assessments.map((a) => a.name)))];

  // Best score per row for highlighting
  const bestScore = candidates.reduce((best, c) => (c.score > (best?.score ?? 0) ? c : best), candidates[0]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Compare Candidates</h1>
          <p className="text-muted-foreground mt-1">Side-by-side evaluation of top candidates</p>
        </div>
        <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Candidate
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Candidates to Compare</DialogTitle>
            </DialogHeader>
            <p className="text-xs text-muted-foreground mb-3">Select up to 4 candidates</p>
            <ScrollArea className="h-[300px] pr-3">
              <div className="space-y-2">
                {mockCandidates.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={selectedIds.includes(c.id)}
                      onCheckedChange={() => toggleCandidate(c.id)}
                      disabled={!selectedIds.includes(c.id) && selectedIds.length >= 4}
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-secondary text-xs font-medium">{c.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.role}</p>
                    </div>
                    <Badge variant="secondary" className={`text-xs ${stageColors[c.stage] || ""}`}>
                      {c.stage}
                    </Badge>
                  </label>
                ))}
              </div>
            </ScrollArea>
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-2" onClick={() => setPickerOpen(false)}>
              Done
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {candidates.length < 2 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <GitCompareArrows className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">Select at least 2 candidates</p>
            <p className="text-sm text-muted-foreground mt-1">Use the "Add Candidate" button to pick candidates to compare</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Header row with candidate cards */}
            <div className="grid gap-3" style={{ gridTemplateColumns: `180px repeat(${candidates.length}, 1fr)` }}>
              <div />
              {candidates.map((c) => (
                <Card key={c.id} className="relative">
                  <button
                    onClick={() => removeCandidate(c.id)}
                    className="absolute top-2 right-2 h-5 w-5 rounded-full bg-muted flex items-center justify-center hover:bg-destructive/20 transition-colors"
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                  <CardContent className="p-4 text-center">
                    <Avatar className="h-14 w-14 mx-auto mb-2">
                      <AvatarFallback className="bg-accent/15 text-accent text-lg font-semibold">{c.avatar}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold text-foreground text-sm">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.role}</p>
                    <Badge variant="secondary" className={`mt-2 text-xs ${stageColors[c.stage] || ""}`}>
                      {c.stage}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Overall Score */}
            <SectionHeader label="Overall Score" />
            <CompareRow label="AI Score" candidates={candidates}>
              {(c) => (
                <div className="flex flex-col items-center gap-1">
                  <span className={`text-2xl font-bold ${c.id === bestScore?.id ? "text-accent" : "text-foreground"}`}>
                    {c.score}%
                  </span>
                  <Progress value={c.score} className="h-2 w-full" />
                  {c.id === bestScore?.id && (
                    <Badge variant="secondary" className="bg-accent/10 text-accent text-[10px] mt-1">
                      <Star className="h-2.5 w-2.5 mr-0.5" /> Top Scored
                    </Badge>
                  )}
                </div>
              )}
            </CompareRow>

            {/* Profile Details */}
            <SectionHeader label="Profile" />
            <CompareRow label="Experience" candidates={candidates}>
              {(c) => <span className="text-sm text-foreground font-medium">{c.experience}</span>}
            </CompareRow>
            <CompareRow label="Education" candidates={candidates}>
              {(c) => <span className="text-sm text-foreground">{c.education}</span>}
            </CompareRow>
            <CompareRow label="Location" candidates={candidates}>
              {(c) => <span className="text-sm text-muted-foreground">{c.location}</span>}
            </CompareRow>
            <CompareRow label="Source" candidates={candidates}>
              {(c) => <span className="text-sm text-muted-foreground">{c.source}</span>}
            </CompareRow>

            {/* Skills */}
            <SectionHeader label="Skills" />
            {allSkills.map((skill) => (
              <CompareRow key={skill} label={skill} candidates={candidates}>
                {(c) =>
                  c.skills.includes(skill) ? (
                    <Badge variant="secondary" className="bg-success/10 text-success text-xs">✓</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )
                }
              </CompareRow>
            ))}

            {/* Assessments */}
            {allAssessments.length > 0 && (
              <>
                <SectionHeader label="Assessments" />
                {allAssessments.map((name) => {
                  const scores = candidates.map((c) => c.assessments.find((a) => a.name === name)?.score ?? 0);
                  const maxVal = Math.max(...scores);
                  return (
                    <CompareRow key={name} label={name} candidates={candidates}>
                      {(c) => {
                        const a = c.assessments.find((x) => x.name === name);
                        if (!a) return <span className="text-xs text-muted-foreground">—</span>;
                        return (
                          <div className="flex flex-col items-center gap-1">
                            <span className={`text-sm font-bold ${a.score === maxVal ? "text-accent" : "text-foreground"}`}>
                              {a.score}/{a.maxScore}
                            </span>
                            <Progress value={a.score} className="h-1.5 w-full" />
                          </div>
                        );
                      }}
                    </CompareRow>
                  );
                })}
              </>
            )}

            {/* Interview Feedback */}
            <SectionHeader label="Interview Feedback" />
            <CompareRow label="Interviews Done" candidates={candidates}>
              {(c) => {
                const completed = c.interviewHistory.filter((i) => i.status === "Completed");
                return <span className="text-sm font-medium text-foreground">{completed.length}</span>;
              }}
            </CompareRow>
            <CompareRow label="Avg Rating" candidates={candidates}>
              {(c) => {
                const completed = c.interviewHistory.filter((i) => i.status === "Completed" && i.rating > 0);
                if (completed.length === 0) return <span className="text-xs text-muted-foreground">N/A</span>;
                const avg = completed.reduce((sum, i) => sum + i.rating, 0) / completed.length;
                return (
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-foreground">{avg.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">/5</span>
                    <div className="flex ml-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`h-3 w-3 ${s <= Math.round(avg) ? "text-warning fill-warning" : "text-muted"}`} />
                      ))}
                    </div>
                  </div>
                );
              }}
            </CompareRow>
            {candidates.some((c) => c.interviewHistory.some((i) => i.notes)) && (
              <CompareRow label="Latest Feedback" candidates={candidates}>
                {(c) => {
                  const latest = c.interviewHistory.filter((i) => i.notes).slice(-1)[0];
                  if (!latest) return <span className="text-xs text-muted-foreground">—</span>;
                  return (
                    <div>
                      <p className="text-xs text-muted-foreground italic leading-relaxed">"{latest.notes}"</p>
                      <p className="text-[10px] text-muted-foreground mt-1">— {latest.interviewer}</p>
                    </div>
                  );
                }}
              </CompareRow>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="mt-5 mb-2">
      <Separator />
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3">{label}</p>
    </div>
  );
}

function CompareRow({
  label,
  candidates,
  children,
}: {
  label: string;
  candidates: CandidateDetail[];
  children: (c: CandidateDetail) => React.ReactNode;
}) {
  return (
    <div
      className="grid gap-3 py-2.5 items-center border-b border-border/30"
      style={{ gridTemplateColumns: `180px repeat(${candidates.length}, 1fr)` }}
    >
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {candidates.map((c) => (
        <div key={c.id} className="flex justify-center">
          {children(c)}
        </div>
      ))}
    </div>
  );
}
