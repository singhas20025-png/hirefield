import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft, Mail, Phone, MapPin, Briefcase, GraduationCap, Calendar,
  Star, CheckCircle2, Clock, Circle, Save, Pencil, X, Plus, FileText, Upload, Trash2, ExternalLink,
} from "lucide-react";
import { stageColors } from "@/pages/Candidates";
import { useToast } from "@/hooks/use-toast";
import type { Candidate } from "@/pages/Candidates";

const stages = ["Screening", "Assessment", "Interview", "Offer", "Hired", "Rejected"];

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const statusIcon = (status: string) => {
  if (status === "Completed") return <CheckCircle2 className="h-3.5 w-3.5 text-success" />;
  if (status === "Upcoming" || status === "Scheduled") return <Clock className="h-3.5 w-3.5 text-warning" />;
  return <Circle className="h-3.5 w-3.5 text-muted-foreground" />;
};

const ratingStars = (rating: number) =>
  Array.from({ length: 5 }, (_, i) => (
    <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? "fill-warning text-warning" : "text-muted-foreground/30"}`} />
  ));

interface Interview {
  id: string;
  type: string | null;
  date: string;
  time: string | null;
  interviewer: string | null;
  status: string | null;
  rating: number | null;
  notes: string | null;
  candidate_name: string;
}

interface Assessment {
  id: string;
  name: string;
  category: string | null;
  score: number | null;
  max_score: number | null;
  completed_at: string | null;
}

const CandidateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    email: "", phone: "", location: "", experience: "", education: "", skills: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user && id) loadCandidate();
  }, [user, id]);

  async function loadCandidate() {
    setLoading(true);
    const [candRes, intRes, assRes] = await Promise.all([
      supabase.from("candidates").select("*").eq("id", id!).eq("user_id", user!.id).maybeSingle(),
      supabase.from("interviews").select("*").eq("candidate_id", id!).eq("user_id", user!.id).order("date", { ascending: false }),
      supabase.from("assessments").select("*").eq("candidate_id", id!).eq("user_id", user!.id).order("created_at", { ascending: false }),
    ]);

    if (candRes.error) {
      toast({ title: "Error", description: candRes.error.message, variant: "destructive" });
    } else if (candRes.data) {
      const c = candRes.data as Candidate;
      setCandidate(c);
      setNotes(c.notes || "");
      setEditForm({
        email: c.email || "",
        phone: c.phone || "",
        location: c.location || "",
        experience: c.experience || "",
        education: c.education || "",
        skills: (c.skills || []).join(", "),
      });
    }

    setInterviews((intRes.data || []) as Interview[]);
    setAssessments((assRes.data || []) as Assessment[]);

    // Load resume
    if (id) {
      const { data: files } = await supabase.storage.from("resumes").list(`${user!.id}/${id}`);
      if (files && files.length > 0) {
        const file = files[0];
        setResumeName(file.name);
        const { data: urlData } = await supabase.storage.from("resumes").createSignedUrl(`${user!.id}/${id}/${file.name}`, 3600);
        if (urlData) setResumeUrl(urlData.signedUrl);
      }
    }

    setLoading(false);
  }

  async function handleStageChange(newStage: string) {
    if (!candidate) return;
    const { error } = await supabase.from("candidates").update({ stage: newStage }).eq("id", candidate.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setCandidate({ ...candidate, stage: newStage });
    toast({ title: "Stage Updated", description: `Moved to ${newStage}` });
  }

  async function handleSaveNotes() {
    if (!candidate) return;
    setSavingNotes(true);
    const { error } = await supabase.from("candidates").update({ notes }).eq("id", candidate.id);
    setSavingNotes(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setCandidate({ ...candidate, notes });
    toast({ title: "Notes Saved" });
  }

  function startEditing() {
    if (!candidate) return;
    setEditForm({
      email: candidate.email || "",
      phone: candidate.phone || "",
      location: candidate.location || "",
      experience: candidate.experience || "",
      education: candidate.education || "",
      skills: (candidate.skills || []).join(", "),
    });
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
  }

  async function handleSaveProfile() {
    if (!candidate) return;
    setSavingProfile(true);
    const skillsArray = editForm.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const updates = {
      email: editForm.email.trim() || null,
      phone: editForm.phone.trim() || null,
      location: editForm.location.trim() || null,
      experience: editForm.experience.trim() || null,
      education: editForm.education.trim() || null,
      skills: skillsArray.length > 0 ? skillsArray : null,
    };
    const { error } = await supabase.from("candidates").update(updates).eq("id", candidate.id);
    setSavingProfile(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setCandidate({ ...candidate, ...updates });
    setEditing(false);
    toast({ title: "Profile Updated" });
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 rounded-lg" />
        <Skeleton className="h-60 rounded-lg" />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground">Candidate not found</p>
        <Button variant="outline" asChild>
          <Link to="/candidates"><ArrowLeft className="h-4 w-4 mr-2" />Back to Candidates</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/candidates"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Candidate Profile</h1>
      </div>

      {/* Profile Card */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <Avatar className="h-20 w-20 shrink-0">
              <AvatarFallback className="bg-accent/10 text-accent text-xl font-bold">
                {getInitials(candidate.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">{candidate.name}</h2>
                  <p className="text-muted-foreground">{candidate.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!editing && (
                    <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={startEditing}>
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                  )}
                  <Select value={candidate.stage} onValueChange={handleStageChange}>
                    <SelectTrigger className="w-36 h-8">
                      <Badge variant="secondary" className={stageColors[candidate.stage] || ""}>{candidate.stage}</Badge>
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className={`text-sm font-bold ${(candidate.score ?? 0) >= 80 ? "text-success" : (candidate.score ?? 0) >= 60 ? "text-warning" : "text-destructive"}`}>
                    Score: {candidate.score ?? "—"}%
                  </div>
                </div>
              </div>

              {editing ? (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Email</Label>
                      <Input
                        type="email"
                        placeholder="candidate@email.com"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Phone</Label>
                      <Input
                        placeholder="+1 (555) 123-4567"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Location</Label>
                      <Input
                        placeholder="San Francisco, CA"
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Experience</Label>
                      <Input
                        placeholder="5 years"
                        value={editForm.experience}
                        onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                        className="h-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Education</Label>
                    <Input
                      placeholder="BS Computer Science, MIT"
                      value={editForm.education}
                      onChange={(e) => setEditForm({ ...editForm, education: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Skills (comma-separated)</Label>
                    <Input
                      placeholder="React, TypeScript, Node.js"
                      value={editForm.skills}
                      onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button onClick={handleSaveProfile} disabled={savingProfile} className="bg-accent text-accent-foreground hover:bg-accent/90" size="sm">
                      <Save className="h-3.5 w-3.5 mr-1.5" />{savingProfile ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={cancelEditing}>
                      <X className="h-3.5 w-3.5 mr-1.5" />Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    {candidate.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" /> {candidate.email}
                      </div>
                    )}
                    {candidate.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" /> {candidate.phone}
                      </div>
                    )}
                    {candidate.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {candidate.location}
                      </div>
                    )}
                    {candidate.experience && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Briefcase className="h-3.5 w-3.5" /> {candidate.experience}
                      </div>
                    )}
                  </div>
                  {candidate.education && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GraduationCap className="h-3.5 w-3.5" /> {candidate.education}
                    </div>
                  )}
                  {candidate.skills && candidate.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {candidate.skills.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  )}
                  {candidate.source && (
                    <div className="text-xs text-muted-foreground">
                      Source: {candidate.source} {candidate.applied_date && `· Applied ${candidate.applied_date}`}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="interviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="interviews">Interviews ({interviews.length})</TabsTrigger>
          <TabsTrigger value="assessments">Assessments ({assessments.length})</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* Interviews Tab */}
        <TabsContent value="interviews" className="space-y-3">
          {interviews.length === 0 ? (
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 text-center text-muted-foreground text-sm">No interviews recorded yet</CardContent>
            </Card>
          ) : (
            interviews.map((iv) => (
              <Card key={iv.id} className="border-none shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {statusIcon(iv.status || "")}
                        <span className="font-medium text-sm">{iv.type || "Interview"}</span>
                        <Badge variant="secondary" className="text-xs">{iv.status || "Scheduled"}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <Calendar className="inline h-3 w-3 mr-1" />{iv.date} {iv.time && `at ${iv.time}`} {iv.interviewer && `· Interviewer: ${iv.interviewer}`}
                      </p>
                      {iv.notes && <p className="text-sm text-muted-foreground pt-1">"{iv.notes}"</p>}
                    </div>
                    {(iv.rating ?? 0) > 0 && (
                      <div className="flex gap-0.5 shrink-0">{ratingStars(iv.rating!)}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Assessments Tab */}
        <TabsContent value="assessments">
          <div className="grid gap-3 sm:grid-cols-2">
            {assessments.length === 0 ? (
              <Card className="border-none shadow-sm col-span-2">
                <CardContent className="p-6 text-center text-muted-foreground text-sm">No assessments yet</CardContent>
              </Card>
            ) : (
              assessments.map((a) => (
                <Card key={a.id} className="border-none shadow-sm">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{a.name}</p>
                        {a.category && <Badge variant="secondary" className="text-xs mt-1">{a.category}</Badge>}
                      </div>
                      <span className={`text-lg font-bold ${(a.score ?? 0) >= 80 ? "text-success" : (a.score ?? 0) >= 60 ? "text-warning" : "text-destructive"}`}>
                        {a.score ?? 0}
                      </span>
                    </div>
                    <Progress value={((a.score ?? 0) / (a.max_score ?? 100)) * 100} className="h-2" />
                    {a.completed_at && <p className="text-xs text-muted-foreground">Completed {new Date(a.completed_at).toLocaleDateString()}</p>}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 space-y-4">
              <Textarea
                placeholder="Add notes about this candidate..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <Button onClick={handleSaveNotes} disabled={savingNotes} className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Save className="h-4 w-4 mr-2" />{savingNotes ? "Saving..." : "Save Notes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CandidateDetail;
