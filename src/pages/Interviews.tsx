import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Clock, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockInterviews } from "@/lib/mock-data";

const statusStyles: Record<string, string> = {
  Upcoming: "bg-accent/15 text-accent",
  Scheduled: "bg-info/15 text-info",
  Completed: "bg-success/15 text-success",
};

const Interviews = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Interviews</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and track all interviews</p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Interview
        </Button>
      </div>

      <div className="grid gap-3">
        {mockInterviews.map((interview) => (
          <Card key={interview.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-lg bg-secondary">
                    <Video className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">{interview.candidate}</p>
                    <p className="text-sm text-muted-foreground">{interview.role}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {interview.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {interview.time}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="text-sm font-medium">{interview.type}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">Interviewer</p>
                    <p className="text-sm font-medium">{interview.interviewer}</p>
                  </div>
                  <Badge variant="secondary" className={statusStyles[interview.status] || ""}>
                    {interview.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Interviews;
