import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  BarChart, Bar, LineChart, Line, FunnelChart, Funnel, LabelList,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import { TrendingDown, TrendingUp, Clock, Users, Target, Award } from "lucide-react";

const timeToHireData = [
  { month: "Sep", days: 34, target: 30 },
  { month: "Oct", days: 31, target: 30 },
  { month: "Nov", days: 28, target: 30 },
  { month: "Dec", days: 32, target: 30 },
  { month: "Jan", days: 26, target: 28 },
  { month: "Feb", days: 24, target: 28 },
  { month: "Mar", days: 22, target: 28 },
];

const sourcePerformanceData = [
  { source: "LinkedIn", applicants: 320, interviewed: 85, hired: 18, quality: 82, cost: 4200 },
  { source: "Referral", applicants: 95, interviewed: 52, hired: 22, quality: 94, cost: 1500 },
  { source: "Indeed", applicants: 480, interviewed: 62, hired: 10, quality: 58, cost: 3800 },
  { source: "GitHub", applicants: 65, interviewed: 30, hired: 8, quality: 88, cost: 800 },
  { source: "Portfolio", applicants: 42, interviewed: 18, hired: 5, quality: 85, cost: 200 },
  { source: "Career Fair", applicants: 110, interviewed: 25, hired: 4, quality: 62, cost: 6500 },
];

const interviewerData = [
  { name: "Alex Rivera", interviews: 45, avgScore: 4.6, onTime: 98, feedback: 92, hireRate: 38 },
  { name: "Maya Thompson", interviews: 38, avgScore: 4.8, onTime: 100, feedback: 96, hireRate: 42 },
  { name: "Chris Lee", interviews: 52, avgScore: 4.3, onTime: 92, feedback: 78, hireRate: 28 },
  { name: "Jordan Park", interviews: 29, avgScore: 4.5, onTime: 96, feedback: 88, hireRate: 35 },
  { name: "Sam Nguyen", interviews: 34, avgScore: 4.7, onTime: 94, feedback: 90, hireRate: 40 },
];

const funnelData = [
  { stage: "Applied", value: 1240, fill: "hsl(var(--info))" },
  { stage: "Screened", value: 680, fill: "hsl(var(--accent))" },
  { stage: "Assessed", value: 320, fill: "hsl(var(--warning))" },
  { stage: "Interviewed", value: 156, fill: "hsl(var(--success))" },
  { stage: "Offered", value: 42, fill: "hsl(var(--primary))" },
  { stage: "Hired", value: 28, fill: "hsl(174 62% 35%)" },
];

const radarData = [
  { metric: "Speed", A: 85, B: 70 },
  { metric: "Quality", A: 78, B: 88 },
  { metric: "Cost", A: 65, B: 80 },
  { metric: "Diversity", A: 72, B: 75 },
  { metric: "Retention", A: 90, B: 82 },
  { metric: "Satisfaction", A: 88, B: 76 },
];

const timeToHireConfig: ChartConfig = {
  days: { label: "Days to Hire", color: "hsl(var(--accent))" },
  target: { label: "Target", color: "hsl(var(--muted-foreground))" },
};

const sourceConfig: ChartConfig = {
  hired: { label: "Hired", color: "hsl(var(--accent))" },
  interviewed: { label: "Interviewed", color: "hsl(var(--info))" },
};

const kpis = [
  { label: "Avg Time to Hire", value: "24 days", change: -12, icon: Clock },
  { label: "Offer Acceptance", value: "87%", change: 5, icon: Target },
  { label: "Active Candidates", value: "342", change: 18, icon: Users },
  { label: "Quality of Hire", value: "4.6/5", change: 8, icon: Award },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Recruitment performance metrics and insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <kpi.icon className="h-5 w-5 text-accent" />
                </div>
                <Badge
                  variant="secondary"
                  className={kpi.change > 0 ? "text-success bg-success/10" : "text-destructive bg-destructive/10"}
                >
                  {kpi.change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {Math.abs(kpi.change)}%
                </Badge>
              </div>
              <p className="text-2xl font-bold text-foreground mt-3">{kpi.value}</p>
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="time-to-hire" className="space-y-4">
        <TabsList>
          <TabsTrigger value="time-to-hire">Time to Hire</TabsTrigger>
          <TabsTrigger value="sources">Source Performance</TabsTrigger>
          <TabsTrigger value="interviewers">Interviewers</TabsTrigger>
          <TabsTrigger value="funnel">Drop-off Funnel</TabsTrigger>
        </TabsList>

        {/* Time to Hire */}
        <TabsContent value="time-to-hire">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Time to Hire Trend</CardTitle>
                <CardDescription>Average days from application to offer acceptance</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={timeToHireConfig} className="h-[300px] w-full">
                  <AreaChart data={timeToHireData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="days" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.15} strokeWidth={2} />
                    <Line type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" strokeWidth={1.5} dot={false} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hiring Efficiency</CardTitle>
                <CardDescription>Current quarter vs. last quarter</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ A: { label: "This Quarter", color: "hsl(var(--accent))" }, B: { label: "Last Quarter", color: "hsl(var(--muted-foreground))" } }} className="h-[300px] w-full">
                  <RadarChart data={radarData}>
                    <PolarGrid className="stroke-border" />
                    <PolarAngleAxis dataKey="metric" className="text-muted-foreground text-xs" />
                    <PolarRadiusAxis className="text-muted-foreground" />
                    <Radar name="This Quarter" dataKey="A" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.2} />
                    <Radar name="Last Quarter" dataKey="B" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground))" fillOpacity={0.1} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </RadarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Source Performance */}
        <TabsContent value="sources">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Hires by Source</CardTitle>
                <CardDescription>Candidates interviewed and hired per source</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={sourceConfig} className="h-[300px] w-full">
                  <BarChart data={sourcePerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="source" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="interviewed" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="hired" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Source Quality Score</CardTitle>
                <CardDescription>Quality rating per hiring source</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sourcePerformanceData
                  .sort((a, b) => b.quality - a.quality)
                  .map((s) => (
                    <div key={s.source} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground font-medium">{s.source}</span>
                        <span className="text-muted-foreground">{s.quality}%</span>
                      </div>
                      <Progress value={s.quality} className="h-2" />
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Interviewer Effectiveness */}
        <TabsContent value="interviewers">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Interviewer Effectiveness</CardTitle>
              <CardDescription>Performance metrics for each interviewer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="text-left py-3 px-2 font-medium">Interviewer</th>
                      <th className="text-center py-3 px-2 font-medium">Interviews</th>
                      <th className="text-center py-3 px-2 font-medium">Avg Score</th>
                      <th className="text-center py-3 px-2 font-medium">On-Time %</th>
                      <th className="text-center py-3 px-2 font-medium">Feedback Rate</th>
                      <th className="text-center py-3 px-2 font-medium">Hire Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interviewerData.map((i) => (
                      <tr key={i.name} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-2 font-medium text-foreground">{i.name}</td>
                        <td className="py-3 px-2 text-center text-muted-foreground">{i.interviews}</td>
                        <td className="py-3 px-2 text-center">
                          <Badge variant="secondary" className="bg-accent/10 text-accent">{i.avgScore}</Badge>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className={i.onTime >= 95 ? "text-success" : "text-warning"}>{i.onTime}%</span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Progress value={i.feedback} className="h-1.5 w-16" />
                            <span className="text-muted-foreground text-xs">{i.feedback}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center font-medium text-foreground">{i.hireRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Drop-off Funnel */}
        <TabsContent value="funnel">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Candidate Drop-off Funnel</CardTitle>
                <CardDescription>Where candidates exit the pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {funnelData.map((stage, idx) => {
                    const pct = Math.round((stage.value / funnelData[0].value) * 100);
                    const dropOff = idx > 0 ? Math.round(((funnelData[idx - 1].value - stage.value) / funnelData[idx - 1].value) * 100) : 0;
                    return (
                      <div key={stage.stage} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-foreground">{stage.stage}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground">{stage.value.toLocaleString()}</span>
                            {idx > 0 && (
                              <Badge variant="secondary" className="text-destructive bg-destructive/10 text-xs">
                                -{dropOff}%
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="h-8 rounded-md overflow-hidden bg-muted/50">
                          <div
                            className="h-full rounded-md transition-all duration-500 flex items-center justify-end pr-2"
                            style={{ width: `${pct}%`, backgroundColor: stage.fill }}
                          >
                            {pct > 10 && <span className="text-xs font-medium text-accent-foreground">{pct}%</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Conversion Rates</CardTitle>
                <CardDescription>Stage-to-stage conversion</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {funnelData.slice(1).map((stage, idx) => {
                  const rate = Math.round((stage.value / funnelData[idx].value) * 100);
                  return (
                    <div key={stage.stage} className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-muted-foreground">{funnelData[idx].stage}</span>
                        <span className="text-muted-foreground mx-1">→</span>
                        <span className="text-foreground font-medium">{stage.stage}</span>
                      </div>
                      <Badge variant="secondary" className={rate >= 50 ? "bg-success/10 text-success" : rate >= 25 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}>
                        {rate}%
                      </Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
