import { useState } from "react";
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
    if (stages.length <= 2) return; // Keep at least 2 stages
    onChange(stages.filter((_, i) => i !== index));
  };

  const resetToDefault = () => {
    onChange(defaultStages);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Pipeline Stages</Label>
        <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground" onClick={resetToDefault}>
          Reset to default
        </Button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {stages.map((stage, i) => (
          <Badge key={i} variant="secondary" className="gap-1 pr-1">
            <GripVertical className="h-3 w-3 text-muted-foreground" />
            {stage}
            <button
              onClick={() => removeStage(i)}
              className="ml-1 p-0.5 rounded-sm hover:bg-destructive/20 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
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
        Candidates will auto-advance through these stages when their application is processed.
      </p>
    </div>
  );
}
