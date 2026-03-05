import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, Mail, Phone, MapPin, Briefcase, GraduationCap, Calendar,
  Star, Brain, Sparkles, TrendingUp, CheckCircle2, Clock, Circle,
} from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { getCandidateDetail, getCandidateAI } from "@/lib/candidate-detail-data";
import { stageColors } from "@/lib/mock-data";

const statusIcon = (status: string) => {
  if (status === "Completed") return <CheckCircle2 className="h-3.5 w-3.5 text-success" />;
  if (status === "Upcoming") return <Clock className="h-3.5 w-3.5 text-warning" />;
  return <Circle className="h-3.5 w-3.5 text-muted-foreground" />;
};

const ratingStars = (rating: number) =>
  Array.from({ length: 5 }, (_, i) => (
    <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? "fill-warning text-warning" : "text-muted-foreground/30"}`} />
  ));

const CandidateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const candidate = getCandidateDetail(id || "");
  const aiData = getCandidateAI(id || "");

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
                {candidate.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">{candidate.name}</h2>
                  <p className="text-muted-foreground">{candidate.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={stageColors[candidate.stage] || ""}>{candidate.stage}</Badge>
                  <div className={`text-sm font-bold ${candidate.score >= 80 ? "text-success" : candidate.score >= 60 ? "text-warning" : "text-destructive"}`}>
                    AI Score: {candidate.score}%
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" /> {candidate.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" /> {candidate.phone}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {candidate.location}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-3.5 w-3.5" /> {candidate.experience}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="h-3.5 w-3.5" /> {candidate.education}
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {candidate.skills.map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="interviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="ai">AI Evaluation</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Interviews Tab */}
        <TabsContent value="interviews" className="space-y-3">
          {candidate.interviewHistory.length === 0 ? (
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 text-center text-muted-foreground text-sm">No interviews yet</CardContent>
            </Card>
          ) : (
            candidate.interviewHistory.map((iv) => (
              <Card key={iv.id} className="border-none shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {statusIcon(iv.status)}
                        <span className="font-medium text-sm">{iv.type}</span>
                        <Badge variant="secondary" className="text-xs">{iv.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <Calendar className="inline h-3 w-3 mr-1" />{iv.date} · Interviewer: {iv.interviewer}
                      </p>
                      {iv.notes && <p className="text-sm text-muted-foreground pt-1">"{iv.notes}"</p>}
                    </div>
                    {iv.rating > 0 && (
                      <div className="flex gap-0.5 shrink-0">{ratingStars(iv.rating)}</div>
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
            {candidate.assessments.length === 0 ? (
              <Card className="border-none shadow-sm col-span-2">
                <CardContent className="p-6 text-center text-muted-foreground text-sm">No assessments yet</CardContent>
              </Card>
            ) : (
              candidate.assessments.map((a) => (
                <Card key={a.name} className="border-none shadow-sm">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{a.name}</p>
                        <Badge variant="secondary" className="text-xs mt-1">{a.category}</Badge>
                      </div>
                      <span className={`text-lg font-bold ${a.score >= 80 ? "text-success" : a.score >= 60 ? "text-warning" : "text-destructive"}`}>
                        {a.score}
                      </span>
                    </div>
                    <Progress value={(a.score / a.maxScore) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground">Completed {a.completedAt}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* AI Evaluation Tab */}
        <TabsContent value="ai">
          {aiData ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Metrics */}
              <div className="lg:col-span-2 grid gap-4 sm:grid-cols-3">
                <Card className="border-none shadow-sm">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-accent/10 text-accent"><TrendingUp className="h-5 w-5" /></div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Predicted Success</p>
                      <p className="text-2xl font-bold">{aiData.predictedSuccess}%</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-info/10 text-info"><Brain className="h-5 w-5" /></div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Overall AI Score</p>
                      <p className="text-2xl font-bold">{aiData.overallScore}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-success/10 text-success"><Sparkles className="h-5 w-5" /></div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Recommendation</p>
                      <Badge variant="secondary" className={
                        aiData.recommendation === "Strong Hire" ? "bg-success/15 text-success" :
                        aiData.recommendation === "Hire" ? "bg-accent/15 text-accent" :
                        "bg-destructive/15 text-destructive"
                      }>{aiData.recommendation}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Radar */}
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Brain className="h-4 w-4 text-accent" /> Talent DNA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={aiData.dimensions} cx="50%" cy="50%" outerRadius="75%">
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="trait" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                      <Radar dataKey="score" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.2} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Personality + Insights */}
              <div className="space-y-4">
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">Personality Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(aiData.personality).map(([key, val]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium">{key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}</span>
                          <span className="text-muted-foreground">{val}/100</span>
                        </div>
                        <Progress value={val} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-accent" /> Key Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {aiData.insights.map((insight, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="mt-0.5 h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                          <Sparkles className="h-2.5 w-2.5 text-accent" />
                        </div>
                        <p className="text-sm text-muted-foreground">{insight}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 text-center text-muted-foreground text-sm">
                AI evaluation not yet available for this candidate.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="relative pl-6 space-y-6">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
                {candidate.timeline.map((t, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-6 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-accent bg-background" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{t.event}</span>
                        <span className="text-xs text-muted-foreground">{t.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{t.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CandidateDetail;
