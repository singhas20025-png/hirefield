import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import {
  FileText, Download, FileSpreadsheet, Calendar, TrendingUp, Users,
  Clock, Target, Printer, Share2,
} from "lucide-react";
import { mockCandidates, pipelineData, hiringTrendData } from "@/lib/mock-data";

// Report data
const timeToHireByRole = [
  { role: "Frontend Engineer", days: 22, target: 28 },
  { role: "Product Manager", days: 30, target: 28 },
  { role: "Data Scientist", days: 26, target: 28 },
  { role: "UX Designer", days: 18, target: 28 },
  { role: "Backend Engineer", days: 24, target: 28 },
  { role: "DevOps Engineer", days: 32, target: 28 },
];

const sourceBreakdown = [
  { name: "LinkedIn", value: 38, color: "hsl(var(--info))" },
  { name: "Referral", value: 25, color: "hsl(var(--accent))" },
  { name: "Indeed", value: 18, color: "hsl(var(--warning))" },
  { name: "GitHub", value: 12, color: "hsl(var(--success))" },
  { name: "Other", value: 7, color: "hsl(var(--muted-foreground))" },
];

const teamPerformance = [
  { name: "Alex Rivera", role: "Engineering Manager", interviews: 45, hires: 12, avgDays: 21, satisfaction: 94 },
  { name: "Maya Thompson", role: "Design Lead", interviews: 38, hires: 8, avgDays: 18, satisfaction: 98 },
  { name: "Chris Lee", role: "Product Director", interviews: 52, hires: 15, avgDays: 28, satisfaction: 82 },
  { name: "Jordan Park", role: "Tech Lead", interviews: 29, hires: 7, avgDays: 24, satisfaction: 90 },
  { name: "Sam Nguyen", role: "Senior Engineer", interviews: 34, hires: 10, avgDays: 22, satisfaction: 92 },
];

const monthlyHiringData = [
  { month: "Sep", opened: 12, filled: 8, cancelled: 1 },
  { month: "Oct", opened: 15, filled: 12, cancelled: 2 },
  { month: "Nov", opened: 8, filled: 6, cancelled: 0 },
  { month: "Dec", opened: 18, filled: 15, cancelled: 3 },
  { month: "Jan", opened: 20, filled: 11, cancelled: 1 },
  { month: "Feb", opened: 22, filled: 18, cancelled: 2 },
];

const chartConfig: ChartConfig = {
  days: { label: "Days", color: "hsl(var(--accent))" },
  target: { label: "Target", color: "hsl(var(--muted-foreground))" },
  opened: { label: "Opened", color: "hsl(var(--info))" },
  filled: { label: "Filled", color: "hsl(var(--accent))" },
  cancelled: { label: "Cancelled", color: "hsl(var(--destructive))" },
};

function generateCSV(headers: string[], rows: string[][]): string {
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const { toast } = useToast();
  const [period, setPeriod] = useState("6months");

  const exportCSV = (reportName: string) => {
    let csv = "";
    switch (reportName) {
      case "hiring-metrics":
        csv = generateCSV(
          ["Month", "Applications", "Hired"],
          hiringTrendData.map((d) => [d.month, String(d.applications), String(d.hired)]),
        );
        break;
      case "pipeline":
        csv = generateCSV(
          ["Stage", "Count"],
          pipelineData.map((d) => [d.stage, String(d.count)]),
        );
        break;
      case "team":
        csv = generateCSV(
          ["Name", "Role", "Interviews", "Hires", "Avg Days to Hire", "Satisfaction %"],
          teamPerformance.map((t) => [t.name, t.role, String(t.interviews), String(t.hires), String(t.avgDays), String(t.satisfaction)]),
        );
        break;
      case "candidates":
        csv = generateCSV(
          ["Name", "Role", "Stage", "Score", "Source", "Applied Date"],
          mockCandidates.map((c) => [c.name, c.role, c.stage, String(c.score), c.source, c.appliedDate]),
        );
        break;
    }
    downloadFile(csv, `${reportName}-report.csv`, "text/csv");
    toast({ title: "CSV Exported", description: `${reportName}-report.csv downloaded` });
  };

  const exportPDF = (reportName: string) => {
    // Generate a printable HTML document
    let html = `<!DOCTYPE html><html><head><title>${reportName} Report</title>
    <style>
      body { font-family: -apple-system, sans-serif; padding: 40px; color: #1a1a2e; }
      h1 { font-size: 24px; margin-bottom: 4px; }
      .subtitle { color: #666; font-size: 14px; margin-bottom: 24px; }
      table { width: 100%; border-collapse: collapse; margin-top: 16px; }
      th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; font-size: 13px; }
      th { background: #f5f5f5; font-weight: 600; }
      .metric { display: inline-block; margin-right: 32px; margin-bottom: 16px; }
      .metric-value { font-size: 28px; font-weight: 700; }
      .metric-label { font-size: 12px; color: #666; }
    </style></head><body>`;

    const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    switch (reportName) {
      case "hiring-metrics":
        html += `<h1>Hiring Metrics Report</h1><p class="subtitle">Generated ${date}</p>`;
        html += `<div><div class="metric"><div class="metric-value">${hiringTrendData.reduce((s, d) => s + d.hired, 0)}</div><div class="metric-label">Total Hires</div></div>`;
        html += `<div class="metric"><div class="metric-value">${hiringTrendData.reduce((s, d) => s + d.applications, 0)}</div><div class="metric-label">Total Applications</div></div></div>`;
        html += `<table><tr><th>Month</th><th>Applications</th><th>Hired</th><th>Conversion</th></tr>`;
        hiringTrendData.forEach((d) => {
          html += `<tr><td>${d.month}</td><td>${d.applications}</td><td>${d.hired}</td><td>${((d.hired / d.applications) * 100).toFixed(1)}%</td></tr>`;
        });
        html += `</table>`;
        break;
      case "pipeline":
        html += `<h1>Pipeline Status Report</h1><p class="subtitle">Generated ${date}</p>`;
        html += `<table><tr><th>Stage</th><th>Count</th><th>% of Total</th></tr>`;
        const total = pipelineData.reduce((s, d) => s + d.count, 0);
        pipelineData.forEach((d) => {
          html += `<tr><td>${d.stage}</td><td>${d.count}</td><td>${((d.count / total) * 100).toFixed(1)}%</td></tr>`;
        });
        html += `</table>`;
        break;
      case "team":
        html += `<h1>Team Performance Report</h1><p class="subtitle">Generated ${date}</p>`;
        html += `<table><tr><th>Name</th><th>Role</th><th>Interviews</th><th>Hires</th><th>Avg Days</th><th>Satisfaction</th></tr>`;
        teamPerformance.forEach((t) => {
          html += `<tr><td>${t.name}</td><td>${t.role}</td><td>${t.interviews}</td><td>${t.hires}</td><td>${t.avgDays}</td><td>${t.satisfaction}%</td></tr>`;
        });
        html += `</table>`;
        break;
      case "candidates":
        html += `<h1>Candidate Report</h1><p class="subtitle">Generated ${date}</p>`;
        html += `<table><tr><th>Name</th><th>Role</th><th>Stage</th><th>Score</th><th>Source</th></tr>`;
        mockCandidates.forEach((c) => {
          html += `<tr><td>${c.name}</td><td>${c.role}</td><td>${c.stage}</td><td>${c.score}%</td><td>${c.source}</td></tr>`;
        });
        html += `</table>`;
        break;
    }

    html += `</body></html>`;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }
    toast({ title: "PDF Ready", description: "Print dialog opened for PDF export" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1">Generate and export hiring reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick export cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: "hiring-metrics", label: "Hiring Metrics", icon: TrendingUp, desc: "Applications, hires, conversion rates" },
          { name: "pipeline", label: "Pipeline Status", icon: Target, desc: "Candidate distribution by stage" },
          { name: "team", label: "Team Performance", icon: Users, desc: "Interviewer stats and satisfaction" },
          { name: "candidates", label: "Candidate Export", icon: FileText, desc: "Full candidate list with scores" },
        ].map((report) => (
          <Card key={report.name} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
                  <report.icon className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{report.label}</p>
                  <p className="text-[10px] text-muted-foreground">{report.desc}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={() => exportCSV(report.name)}>
                  <FileSpreadsheet className="h-3 w-3 mr-1" /> CSV
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={() => exportPDF(report.name)}>
                  <Printer className="h-3 w-3 mr-1" /> PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="hiring" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hiring">Hiring Metrics</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="team">Team Performance</TabsTrigger>
        </TabsList>

        {/* Hiring Metrics */}
        <TabsContent value="hiring" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">Monthly Hiring Activity</CardTitle>
                  <CardDescription>Roles opened, filled, and cancelled</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => exportCSV("hiring-metrics")}>
                  <Download className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                  <BarChart data={monthlyHiringData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="opened" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="filled" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="cancelled" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">Time to Hire by Role</CardTitle>
                  <CardDescription>Average days to fill each position type</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                  <BarChart data={timeToHireByRole} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" className="text-muted-foreground" />
                    <YAxis dataKey="role" type="category" width={120} className="text-muted-foreground" tick={{ fontSize: 11 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="days" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pipeline */}
        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-1">
              <CardHeader className="flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">Source Distribution</CardTitle>
                  <CardDescription>Where candidates come from</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ value: { label: "Candidates" } }} className="h-[250px] w-full">
                  <PieChart>
                    <Pie data={sourceBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {sourceBreakdown.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">Pipeline Breakdown</CardTitle>
                  <CardDescription>Current candidates by stage</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => exportCSV("pipeline")}>
                  <Download className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {pipelineData.map((stage) => {
                  const pct = Math.round((stage.count / pipelineData[0].count) * 100);
                  return (
                    <div key={stage.stage} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{stage.stage}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{stage.count}</span>
                          <Badge variant="secondary" className="text-xs">{pct}%</Badge>
                        </div>
                      </div>
                      <Progress value={pct} className="h-2.5" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Team Performance */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg">Team Performance Summary</CardTitle>
                <CardDescription>Interviewer effectiveness and satisfaction scores</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs" onClick={() => exportCSV("team")}>
                  <FileSpreadsheet className="h-3.5 w-3.5 mr-1" /> Export CSV
                </Button>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => exportPDF("team")}>
                  <Printer className="h-3.5 w-3.5 mr-1" /> Print PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="text-left py-3 px-2 font-medium">Team Member</th>
                      <th className="text-center py-3 px-2 font-medium">Interviews</th>
                      <th className="text-center py-3 px-2 font-medium">Hires</th>
                      <th className="text-center py-3 px-2 font-medium">Conversion</th>
                      <th className="text-center py-3 px-2 font-medium">Avg Days</th>
                      <th className="text-center py-3 px-2 font-medium">Satisfaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamPerformance.map((t) => {
                      const conversion = Math.round((t.hires / t.interviews) * 100);
                      return (
                        <tr key={t.name} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-2">
                            <p className="font-medium text-foreground">{t.name}</p>
                            <p className="text-xs text-muted-foreground">{t.role}</p>
                          </td>
                          <td className="py-3 px-2 text-center text-muted-foreground">{t.interviews}</td>
                          <td className="py-3 px-2 text-center font-medium text-foreground">{t.hires}</td>
                          <td className="py-3 px-2 text-center">
                            <Badge variant="secondary" className={conversion >= 25 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>
                              {conversion}%
                            </Badge>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span className={t.avgDays <= 25 ? "text-success" : "text-warning"}>{t.avgDays}d</span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Progress value={t.satisfaction} className="h-1.5 w-14" />
                              <span className="text-xs text-muted-foreground">{t.satisfaction}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
