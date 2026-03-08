import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Briefcase, Clock, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";

const stageColors: Record<string, string> = {
  Applied: "bg-info/15 text-info",
  Screening: "bg-accent/15 text-accent",
  Assessment: "bg-warning/15 text-warning",
  "Video Interview": "bg-primary/15 text-primary",
  "Final Review": "bg-success/15 text-success",
  Offer: "bg-destructive/15 text-destructive",
};

interface DashboardCandidate {
  id: string;
  name: string;
  role: string;
  stage: string;
  created_at: string;
}

interface DashboardInterview {
  id: string;
  candidate_name: string;
  type: string | null;
  time: string | null;
  date: string;
  interviewer: string | null;
  status: string | null;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [openPositions, setOpenPositions] = useState(0);
  const [recentCandidates, setRecentCandidates] = useState<DashboardCandidate[]>([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState<DashboardInterview[]>([]);
  const [pipelineData, setPipelineData] = useState<{ stage: string; count: number }[]>([]);
  const [applicationTrend, setApplicationTrend] = useState<{ month: string; applications: number }[]>([]);

  useEffect(() => {
    if (user) loadDashboard();
  }, [user]);

  async function loadDashboard() {
    const uid = user!.id;

    const [candidatesRes, jobsRes, interviewsRes, applicationsRes] = await Promise.all([
      supabase.from("candidates").select("id, name, role, stage, created_at").eq("user_id", uid).order("created_at", { ascending: false }),
      supabase.from("jobs").select("id, status").eq("user_id", uid),
      supabase.from("interviews").select("id, candidate_name, type, time, date, interviewer, status").eq("user_id", uid).order("date", { ascending: true }),
      supabase.from("job_applications").select("id, created_at, job_id, status").order("created_at", { ascending: false }),
    ]);

    const candidates = (candidatesRes.data || []) as DashboardCandidate[];
    const jobs = jobsRes.data || [];
    const interviews = (interviewsRes.data || []) as DashboardInterview[];

    // Metrics
    setTotalCandidates(candidates.length);
    setOpenPositions(jobs.filter((j) => j.status === "Open").length);
    setRecentCandidates(candidates.slice(0, 5));

    // Upcoming interviews (not completed)
    const today = new Date().toISOString().split("T")[0];
    setUpcomingInterviews(
      interviews.filter((i) => i.status !== "Completed" && i.date >= today).slice(0, 4)
    );

    // Pipeline chart - count candidates per stage
    const stageCounts: Record<string, number> = {};
    candidates.forEach((c) => {
      stageCounts[c.stage] = (stageCounts[c.stage] || 0) + 1;
    });
    const stages = ["Applied", "Screening", "Assessment", "Video Interview", "Final Review", "Offer"];
    setPipelineData(stages.map((s) => ({ stage: s, count: stageCounts[s] || 0 })));

    // Application trend - group by month (last 6 months)
    const apps = applicationsRes.data || [];
    const monthCounts: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleDateString("en-US", { month: "short" });
      monthCounts[key] = 0;
    }
    apps.forEach((a) => {
      const d = new Date(a.created_at);
      const key = d.toLocaleDateString("en-US", { month: "short" });
      if (key in monthCounts) monthCounts[key]++;
    });
    setApplicationTrend(Object.entries(monthCounts).map(([month, applications]) => ({ month, applications })));

    setLoading(false);
  }

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {[1, 2].map((i) => <Skeleton key={i} className="h-72 rounded-lg" />)}
        </div>
      </div>
    );
  }

  const metrics = [
    { label: "Total Candidates", value: totalCandidates.toString(), icon: Users, color: "text-accent" },
    { label: "Open Positions", value: openPositions.toString(), icon: Briefcase, color: "text-info" },
    { label: "Pipeline Stages", value: pipelineData.filter((p) => p.count > 0).length.toString(), icon: Clock, color: "text-success" },
    { label: "Upcoming Interviews", value: upcomingInterviews.length.toString(), icon: TrendingUp, color: "text-warning" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your hiring pipeline</p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label} className="border-none shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
                  <p className="text-2xl font-bold mt-1">{m.value}</p>
                </div>
                <div className={`p-2.5 rounded-lg bg-secondary ${m.color}`}>
                  <m.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Hiring Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={pipelineData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="stage" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Application Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={applicationTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="applications" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Recent Candidates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentCandidates.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No candidates yet</p>
            ) : (
              recentCandidates.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-secondary text-xs font-medium">
                        {getInitials(c.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.role}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className={stageColors[c.stage] || ""}>
                    {c.stage}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingInterviews.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No upcoming interviews</p>
            ) : (
              upcomingInterviews.map((i) => (
                <div key={i.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">{i.candidate_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {i.type} · {i.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">{i.date}</p>
                    <p className="text-xs text-muted-foreground">{i.interviewer}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
