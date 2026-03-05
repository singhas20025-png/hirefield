import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus } from "lucide-react";
import { mockCandidates, stageColors } from "@/lib/mock-data";

const stages = ["All", "Screening", "Assessment", "Interview", "Offer", "Hired", "Rejected"];

const Candidates = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Candidates</h1>
          <p className="text-muted-foreground text-sm mt-1">{mockCandidates.length} candidates in pipeline</p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Candidate
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search candidates..." className="pl-9 h-9 bg-card border" />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {stages.map((s) => (
          <Badge
            key={s}
            variant={s === "All" ? "default" : "secondary"}
            className={`cursor-pointer ${s === "All" ? "bg-accent text-accent-foreground" : ""}`}
          >
            {s}
          </Badge>
        ))}
      </div>

      <div className="space-y-2">
        {mockCandidates.map((c) => (
          <Link to={`/candidates/${c.id}`} key={c.id}>
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-secondary text-sm font-medium">
                      {c.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-muted-foreground">{c.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">Source</p>
                    <p className="text-sm font-medium">{c.source}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">AI Score</p>
                    <p className={`text-sm font-bold ${c.score >= 80 ? "text-success" : c.score >= 60 ? "text-warning" : "text-destructive"}`}>
                      {c.score}%
                    </p>
                  </div>
                  <Badge variant="secondary" className={stageColors[c.stage] || ""}>
                    {c.stage}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          </Link>
      </div>
    </div>
  );
};

export default Candidates;
