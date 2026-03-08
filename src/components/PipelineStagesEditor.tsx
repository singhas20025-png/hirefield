import { useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, X, GripVertical } from "lucide-react";

interface PipelineStagesEditorProps {
  stages: string[];
  onChange: (stages: string[]) => void;
}

const defaultStages = ["Applied", "Screening", "Assessment", "Video Interview", "Final Review", "Offer"];

export function PipelineStagesEditor({ stages, onChange }: PipelineStagesEditorProps) {
  const [newStage, setNewStage] = useState("");

  const addStage = () => {
    const trimmed = newStage.trim();
    if (trimmed && !stages.includes(trimmed)) {
      onChange([...stages, trimmed]);
      setNewStage("");
    }
  };

  const removeStage = (index: number) => {
    if (stages.length <= 2) return;
    onChange(stages.filter((_, i) => i !== index));
  };

  const resetToDefault = () => {
    onChange(defaultStages);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(stages);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    onChange(reordered);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Pipeline Stages</Label>
        <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground" onClick={resetToDefault}>
          Reset to default
        </Button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="pipeline-stages" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-wrap gap-1.5"
            >
              {stages.map((stage, i) => (
                <Draggable key={stage} draggableId={stage} index={i}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={provided.draggableProps.style}
                    >
                      <Badge
                        variant="secondary"
                        className={`gap-1 pr-1 select-none transition-shadow ${
                          snapshot.isDragging ? "shadow-lg ring-1 ring-accent" : ""
                        }`}
                      >
                        <span
                          {...provided.dragHandleProps}
                          className="cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="h-3 w-3 text-muted-foreground" />
                        </span>
                        {stage}
                        <button
                          onClick={() => removeStage(i)}
                          className="ml-1 p-0.5 rounded-sm hover:bg-destructive/20 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className="flex gap-2">
        <Input
          placeholder="Add stage..."
          className="h-8 text-sm"
          value={newStage}
          onChange={(e) => setNewStage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addStage()}
        />
        <Button variant="outline" size="sm" className="h-8 shrink-0" onClick={addStage}>
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Drag stages to reorder. Candidates will auto-advance through these stages.
      </p>
    </div>
  );
}
