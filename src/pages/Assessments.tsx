import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Code, MessageSquare, Target, Plus } from "lucide-react";

const assessments = [
  { id: "1", title: "Frontend Technical Assessment", type: "Coding", icon: Code, candidates: 12, avgScore: 74, status: "Active" },
  { id: "2", title: "Leadership & Culture Fit", type: "Psychometric", icon: Brain, candidates: 8, avgScore: 81, status: "Active" },
  { id: "3", title: "Logical Reasoning Test", type: "Aptitude", icon: Target, candidates: 24, avgScore: 68, status: "Active" },
  { id: "4", title: "Communication Skills", type: "Behavioral", icon: MessageSquare, candidates: 15, avgScore: 77, status: "Draft" },
];

const Assessments = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assessments</h1>
          <p className="text-muted-foreground text-sm mt-1">Aptitude, psychometric & skill tests</p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Assessment
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {assessments.map((a) => (
          <Card key={a.id} className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-secondary">
                    <a.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">{a.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{a.type}</p>
                  </div>
                </div>
                <Badge variant="secondary" className={a.status === "Active" ? "bg-success/15 text-success" : ""}>
                  {a.status}
                </Badge>
              </div>
              <div className="flex items-center gap-6 mt-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Candidates</p>
                  <p className="font-semibold">{a.candidates}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                  <p className="font-semibold">{a.avgScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Assessments;
