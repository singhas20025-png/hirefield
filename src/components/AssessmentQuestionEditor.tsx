import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, GripVertical } from "lucide-react";

export interface Question {
  id: string;
  text: string;
  type: "multiple_choice" | "text" | "rating";
  options?: string[];
  required: boolean;
}

interface Props {
  questions: Question[];
  onChange: (questions: Question[]) => void;
}

export const AssessmentQuestionEditor = ({ questions, onChange }: Props) => {
  const addQuestion = () => {
    onChange([
      ...questions,
      { id: crypto.randomUUID(), text: "", type: "multiple_choice", options: ["", ""], required: true },
    ]);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeQuestion = (index: number) => {
    onChange(questions.filter((_, i) => i !== index));
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    const options = [...(updated[qIndex].options || [])];
    options[oIndex] = value;
    updated[qIndex] = { ...updated[qIndex], options };
    onChange(updated);
  };

  const addOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex] = { ...updated[qIndex], options: [...(updated[qIndex].options || []), ""] };
    onChange(updated);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    updated[qIndex] = { ...updated[qIndex], options: (updated[qIndex].options || []).filter((_, i) => i !== oIndex) };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {questions.map((q, qi) => (
        <Card key={q.id} className="border shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <GripVertical className="h-4 w-4" />
                <span className="text-sm font-medium">Q{qi + 1}</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeQuestion(qi)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Question</Label>
              <Textarea
                placeholder="Enter your question..."
                value={q.text}
                onChange={(e) => updateQuestion(qi, { text: e.target.value })}
                className="min-h-[60px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={q.type} onValueChange={(v) => updateQuestion(qi, { type: v as Question["type"], options: v === "multiple_choice" ? (q.options?.length ? q.options : ["", ""]) : undefined })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                    <SelectItem value="text">Text Answer</SelectItem>
                    <SelectItem value="rating">Rating (1-10)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={q.required} onChange={(e) => updateQuestion(qi, { required: e.target.checked })} className="rounded" />
                  Required
                </label>
              </div>
            </div>
            {q.type === "multiple_choice" && (
              <div className="space-y-2">
                <Label>Options</Label>
                {(q.options || []).map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <Input
                      placeholder={`Option ${oi + 1}`}
                      value={opt}
                      onChange={(e) => updateOption(qi, oi, e.target.value)}
                    />
                    {(q.options || []).length > 2 && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeOption(qi, oi)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addOption(qi)}>
                  <Plus className="h-3 w-3 mr-1" /> Add Option
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" className="w-full" onClick={addQuestion}>
        <Plus className="h-4 w-4 mr-2" /> Add Question
      </Button>
    </div>
  );
};
