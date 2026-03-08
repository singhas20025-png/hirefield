import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import type { Candidate } from "@/pages/Candidates";
import { stageColors } from "@/pages/Candidates";

const PIPELINE_STAGES = ["Screening", "Assessment", "Interview", "Offer", "Hired", "Rejected"] as const;

const stageHeaderColors: Record<string, string> = {
  Screening: "bg-info",
  Assessment: "bg-warning",
  Interview: "bg-accent",
  Offer: "bg-success",
  Hired: "bg-success",
  Rejected: "bg-destructive",
};

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

interface CandidateKanbanProps {
  candidates: Candidate[];
  onStageChange: (candidateId: string, newStage: string) => Promise<void>;
}

export function CandidateKanban({ candidates, onStageChange }: CandidateKanbanProps) {
  const { toast } = useToast();

  const grouped = PIPELINE_STAGES.reduce(
    (acc, stage) => {
      acc[stage] = candidates.filter((c) => c.stage === stage);
      return acc;
    },
    {} as Record<string, Candidate[]>,
  );

  const onDragEnd = async (result: DropResult) => {
    const { draggableId, destination } = result;
    if (!destination) return;

    const newStage = destination.droppableId;
    const candidate = candidates.find((c) => c.id === draggableId);
    if (!candidate || candidate.stage === newStage) return;

    await onStageChange(draggableId, newStage);
    toast({
      title: "Stage Updated",
      description: `${candidate.name} moved to ${newStage}`,
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-4 min-h-[60vh]">
        {PIPELINE_STAGES.map((stage) => (
          <div key={stage} className="flex-shrink-0 w-[260px]">
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className={`h-2.5 w-2.5 rounded-full ${stageHeaderColors[stage]}`} />
              <h3 className="text-sm font-semibold text-foreground">{stage}</h3>
              <Badge variant="secondary" className="ml-auto text-xs h-5 px-1.5">
                {grouped[stage]?.length || 0}
              </Badge>
            </div>

            <Droppable droppableId={stage}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-2 p-2 rounded-lg min-h-[200px] transition-colors ${
                    snapshot.isDraggingOver ? "bg-accent/10 ring-1 ring-accent/30" : "bg-muted/30"
                  }`}
                >
                  {grouped[stage]?.map((candidate, index) => (
                    <Draggable key={candidate.id} draggableId={candidate.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`${snapshot.isDragging ? "rotate-2 scale-105" : ""} transition-transform`}
                        >
                          <Link to={`/candidates/${candidate.id}`}>
                            <Card className="border shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
                              <CardContent className="p-3 space-y-2">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-secondary text-xs font-medium">
                                      {getInitials(candidate.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                      {candidate.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {candidate.role}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">{candidate.source || "—"}</span>
                                  <span
                                    className={`text-xs font-bold ${
                                      (candidate.score ?? 0) >= 80
                                        ? "text-success"
                                        : (candidate.score ?? 0) >= 60
                                          ? "text-warning"
                                          : "text-destructive"
                                    }`}
                                  >
                                    {candidate.score ?? "—"}%
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
