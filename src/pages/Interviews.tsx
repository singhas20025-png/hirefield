import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Video, Calendar, Clock, Plus, Loader2, ExternalLink, Link2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

const statusStyles: Record<string, string> = {
  Upcoming: "bg-accent/15 text-accent",
  Scheduled: "bg-info/15 text-info",
  Completed: "bg-success/15 text-success",
};

const Interviews = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    candidate_name: "",
    role: "",
    type: "Technical",
    date: "",
    time: "",
    interviewer: "",
    meeting_url: "",
  });

  const { data: interviews = [], isLoading } = useQuery({
    queryKey: ["interviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("interviews")
        .select("*")
        .order("date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("interviews").insert({
        candidate_name: form.candidate_name,
        role: form.role || null,
        type: form.type,
        date: form.date,
        time: form.time || null,
        interviewer: form.interviewer || null,
        meeting_url: form.meeting_url || null,
        status: "Scheduled",
        user_id: user.id,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      toast({ title: "Interview Scheduled", description: `${form.candidate_name} scheduled for ${form.date}` });
      setOpen(false);
      setForm({ candidate_name: "", role: "", type: "Technical", date: "", time: "", interviewer: "", meeting_url: "" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleSubmit = () => {
    if (!form.candidate_name || !form.date) {
      toast({ title: "Missing fields", description: "Candidate name and date are required.", variant: "destructive" });
      return;
    }
    createMutation.mutate();
  };

  const getStatus = (interview: { date: string; status: string | null }) => {
    if (interview.status === "Completed") return "Completed";
    const today = new Date().toISOString().split("T")[0];
    if (interview.date >= today) return "Upcoming";
    return interview.status || "Scheduled";
  };

  const handleJoin = (interview: any) => {
    const meetingUrl = (interview as any).meeting_url;
    if (meetingUrl) {
      window.open(meetingUrl, "_blank");
    } else {
      navigate("/video-interview");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Interviews</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and track all interviews</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Interview
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule Interview</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Candidate Name *</Label>
                <Input
                  placeholder="Enter candidate name"
                  value={form.candidate_name}
                  onChange={(e) => setForm({ ...form, candidate_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input
                  placeholder="e.g. Senior Frontend Engineer"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Interview Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Technical", "Behavioral", "Portfolio Review", "Case Study", "Screening", "Final Round"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Interviewer</Label>
                <Input
                  placeholder="Interviewer name"
                  value={form.interviewer}
                  onChange={(e) => setForm({ ...form, interviewer: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Link2 className="h-3.5 w-3.5" />
                  Meeting URL (optional)
                </Label>
                <Input
                  placeholder="https://zoom.us/j/... or Google Meet link"
                  value={form.meeting_url}
                  onChange={(e) => setForm({ ...form, meeting_url: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Leave empty to use HireField's built-in video. Paste a Zoom or Google Meet link to use external.</p>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Confirm Schedule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : interviews.length === 0 ? (
        <Card className="border-none shadow-sm">
          <CardContent className="p-8 text-center text-muted-foreground">
            No interviews scheduled yet. Click "Schedule Interview" to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {interviews.map((interview) => {
            const displayStatus = getStatus(interview);
            const meetingUrl = (interview as any).meeting_url;
            return (
              <Card key={interview.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-lg bg-secondary">
                        <Video className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">{interview.candidate_name}</p>
                        <p className="text-sm text-muted-foreground">{interview.role}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {interview.date}
                          </span>
                          {interview.time && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {interview.time}
                            </span>
                          )}
                          {meetingUrl && (
                            <span className="flex items-center gap-1 text-accent">
                              <ExternalLink className="h-3 w-3" />
                              External
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-muted-foreground">Type</p>
                        <p className="text-sm font-medium">{interview.type}</p>
                      </div>
                      {interview.interviewer && (
                        <div className="text-right hidden sm:block">
                          <p className="text-xs text-muted-foreground">Interviewer</p>
                          <p className="text-sm font-medium">{interview.interviewer}</p>
                        </div>
                      )}
                      <Badge variant="secondary" className={statusStyles[displayStatus] || ""}>
                        {displayStatus}
                      </Badge>
                      {displayStatus !== "Completed" && (
                        <Button
                          size="sm"
                          className="bg-accent text-accent-foreground hover:bg-accent/90"
                          onClick={() => handleJoin(interview)}
                        >
                          {meetingUrl ? <ExternalLink className="h-3 w-3 mr-1" /> : <Video className="h-3 w-3 mr-1" />}
                          Join
                        </Button>
                      )}
                    </div>
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

export default Interviews;
