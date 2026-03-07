import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Video, VideoOff, Mic, MicOff, Monitor, PhoneOff,
  Circle, Square, Brain, MessageSquare, Clock, User,
  Sparkles, AlertTriangle, ThumbsUp, ChevronRight,
} from "lucide-react";

const mockTranscript = [
  { time: "00:12", speaker: "Interviewer", text: "Thanks for joining us today. Could you walk me through your experience with distributed systems?" },
  { time: "00:28", speaker: "Sarah Chen", text: "Absolutely. At my previous role at Stripe, I led the migration of our payment processing pipeline to a microservices architecture. We handled over 2 million transactions per day." },
  { time: "01:05", speaker: "Interviewer", text: "That's impressive. What were the main challenges you faced during that migration?" },
  { time: "01:18", speaker: "Sarah Chen", text: "The biggest challenge was maintaining data consistency across services. We implemented an event-driven architecture using Kafka, with saga patterns for distributed transactions." },
  { time: "02:01", speaker: "Interviewer", text: "How did you handle failure scenarios in that system?" },
  { time: "02:15", speaker: "Sarah Chen", text: "We built comprehensive retry mechanisms with exponential backoff, circuit breakers using Hystrix, and a dead letter queue for unprocessable messages. We also implemented distributed tracing with Jaeger." },
];

const aiSuggestions = [
  { type: "follow-up", text: "Ask about monitoring and observability strategies for the distributed system" },
  { type: "follow-up", text: "Explore experience with container orchestration (Kubernetes)" },
  { type: "insight", text: "Candidate shows strong system design knowledge — probe for trade-off analysis" },
  { type: "warning", text: "Haven't covered team collaboration yet — important for senior role" },
];

const aiScores = {
  technicalDepth: 92,
  communication: 88,
  problemSolving: 85,
  confidence: 90,
  clarity: 87,
};

const VideoInterview = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [elapsed, setElapsed] = useState(156);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Video Interview</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Sarah Chen — Senior Software Engineer · Technical Round
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-destructive/15 text-destructive gap-1">
            <Circle className="h-2 w-2 fill-current animate-pulse" /> Live
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" /> {formatTime(elapsed)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Video Area */}
        <div className="lg:col-span-2 space-y-3">
          <Card className="border-none shadow-md overflow-hidden">
            <div className="relative bg-foreground/95 aspect-video flex items-center justify-center">
              {/* Main video placeholder */}
              <div className="text-center space-y-3">
                <div className="mx-auto h-20 w-20 rounded-full bg-accent/20 flex items-center justify-center">
                  <User className="h-10 w-10 text-accent" />
                </div>
                <p className="text-background/70 text-sm font-medium">Sarah Chen</p>
              </div>

              {/* Self view */}
              <div className="absolute bottom-3 right-3 w-36 h-24 rounded-lg bg-foreground/80 border border-background/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-8 w-8 rounded-full bg-primary/30 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground/70" />
                  </div>
                  <p className="text-background/50 text-[10px] mt-1">You</p>
                </div>
              </div>

              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-destructive/90 text-destructive-foreground px-2 py-1 rounded text-xs font-medium">
                  <Circle className="h-2 w-2 fill-current animate-pulse" /> REC
                </div>
              )}
            </div>
          </Card>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant={micOn ? "secondary" : "destructive"}
              size="icon"
              onClick={() => setMicOn(!micOn)}
              className="rounded-full h-11 w-11"
            >
              {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
            <Button
              variant={videoOn ? "secondary" : "destructive"}
              size="icon"
              onClick={() => setVideoOn(!videoOn)}
              className="rounded-full h-11 w-11"
            >
              {videoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
            <Button variant="secondary" size="icon" className="rounded-full h-11 w-11">
              <Monitor className="h-5 w-5" />
            </Button>
            <Button
              variant={isRecording ? "destructive" : "secondary"}
              size="icon"
              onClick={() => setIsRecording(!isRecording)}
              className="rounded-full h-11 w-11"
            >
              {isRecording ? <Square className="h-4 w-4" /> : <Circle className="h-5 w-5" />}
            </Button>
            <Button variant="destructive" size="icon" className="rounded-full h-11 w-11">
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-3">
          <Tabs defaultValue="transcript" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="transcript" className="flex-1 text-xs gap-1">
                <MessageSquare className="h-3 w-3" /> Transcript
              </TabsTrigger>
              <TabsTrigger value="copilot" className="flex-1 text-xs gap-1">
                <Brain className="h-3 w-3" /> AI Co-Pilot
              </TabsTrigger>
              <TabsTrigger value="scores" className="flex-1 text-xs gap-1">
                <Sparkles className="h-3 w-3" /> Scores
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transcript">
              <Card className="border-none shadow-sm">
                <CardContent className="p-0">
                  <ScrollArea className="h-[420px] p-4">
                    <div className="space-y-4">
                      {mockTranscript.map((entry, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground font-mono">{entry.time}</span>
                            <span className={`text-xs font-semibold ${entry.speaker === "Interviewer" ? "text-primary" : "text-accent"}`}>
                              {entry.speaker}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/80 pl-12">{entry.text}</p>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                        <span className="text-[10px] font-mono">{formatTime(elapsed)}</span>
                        <span className="text-xs">Listening...</span>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="copilot">
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <Brain className="h-4 w-4 text-accent" /> AI Interview Co-Pilot
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <ScrollArea className="h-[370px]">
                    <div className="space-y-3">
                      {aiSuggestions.map((s, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg text-sm border ${
                            s.type === "warning"
                              ? "border-destructive/20 bg-destructive/5"
                              : s.type === "insight"
                              ? "border-accent/20 bg-accent/5"
                              : "border-border bg-secondary/50"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {s.type === "follow-up" && <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />}
                            {s.type === "insight" && <ThumbsUp className="h-4 w-4 text-accent mt-0.5 shrink-0" />}
                            {s.type === "warning" && <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />}
                            <span className="text-foreground/80">{s.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scores">
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-accent" /> Live AI Scoring
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="space-y-4">
                    {Object.entries(aiScores).map(([key, value]) => (
                      <div key={key} className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <span className="font-semibold">{value}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full bg-accent transition-all duration-1000"
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
                      <p className="text-sm font-medium text-accent">Overall: Strong Hire</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Candidate demonstrates exceptional technical depth and clear communication.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VideoInterview;
