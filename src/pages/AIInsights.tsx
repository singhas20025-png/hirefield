import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Sparkles, TrendingUp, Shield, CheckCircle2, XCircle } from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { talentDNAData, skillVerificationResults } from "@/lib/ai-mock-data";

const recommendationColors: Record<string, string> = {
  "Strong Hire": "bg-success/15 text-success",
  Hire: "bg-accent/15 text-accent",
  "No Hire": "bg-destructive/15 text-destructive",
};

const AIInsights = () => {
  const [selected, setSelected] = useState(talentDNAData[0]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Insights</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Talent DNA profiles, predictive scoring & personality analysis
        </p>
      </div>

      {/* Candidate Selector */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {talentDNAData.map((c) => (
          <button
            key={c.candidateId}
            onClick={() => setSelected(c)}
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors min-w-[200px] ${
              selected.candidateId === c.candidateId
                ? "border-accent bg-accent/5"
                : "border-border hover:border-accent/40"
            }`}
          >
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarFallback className="bg-secondary text-xs font-medium">
                {c.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.role}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Top metrics row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-none shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Predicted Success</p>
              <p className="text-2xl font-bold">{selected.predictedSuccess}%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-info/10 text-info">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Overall AI Score</p>
              <p className="text-2xl font-bold">{selected.overallScore}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-success/10 text-success">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Recommendation</p>
              <Badge variant="secondary" className={recommendationColors[selected.recommendation] || ""}>
                {selected.recommendation}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Radar + Personality */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Talent DNA Radar */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Brain className="h-4 w-4 text-accent" /> Talent DNA Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={selected.dimensions} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="trait"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                />
                <Radar
                  dataKey="score"
                  stroke="hsl(var(--accent))"
                  fill="hsl(var(--accent))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Personality Analysis */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" /> Personality Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-2">
            {Object.entries(selected.personality).map(([key, value]) => {
              const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">{label}</span>
                    <span className="text-muted-foreground">{value}/100</span>
                  </div>
                  <Progress value={value} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Skill Verification + AI Insights */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Skill Verification */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 text-accent" /> Skill Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={skillVerificationResults} barSize={28} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis dataKey="skill" type="category" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={90} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-2">
              {skillVerificationResults.map((s) => (
                <div key={s.skill} className="flex items-center justify-between text-xs">
                  <span className="font-medium">{s.skill}</span>
                  <span className="flex items-center gap-1">
                    {s.verified ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-destructive" />
                    )}
                    {s.verified ? "Verified" : "Not Verified"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Key Insights */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Brain className="h-4 w-4 text-accent" /> AI Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {selected.insights.map((insight, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="mt-0.5 h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Sparkles className="h-3 w-3 text-accent" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
              </div>
            ))}

            <div className="mt-6 rounded-lg border border-accent/20 bg-accent/5 p-4">
              <p className="text-xs font-semibold text-accent mb-1">Predictive Intelligence</p>
              <p className="text-sm">
                {selected.name} has a{" "}
                <span className="font-bold text-foreground">{selected.predictedSuccess}%</span>{" "}
                predicted success rate for the {selected.role} position based on behavioral analysis, 
                skill verification, and historical hiring patterns.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIInsights;
