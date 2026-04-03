import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertCircle, Brain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Question {
  id: string;
  text: string;
  type: "multiple_choice" | "text" | "rating";
  options?: string[];
  required: boolean;
}

const TakeAssessment = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [assignment, setAssignment] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!token) { setError("Invalid link"); setLoading(false); return; }

      // Fetch assignment by token
      const { data: assignData, error: assignErr } = await supabase
        .from("assessment_assignments" as any)
        .select("*")
        .eq("token", token)
        .single();

      if (assignErr || !assignData) {
        setError("Assessment not found or link is invalid.");
        setLoading(false);
        return;
      }

      const a = assignData as any;
      if (a.status === "submitted") {
        setSubmitted(true);
        setLoading(false);
        return;
      }

      setAssignment(a);

      // Fetch the assessment details
      const { data: assessData, error: assessErr } = await supabase
        .from("assessments")
        .select("*")
        .eq("id", a.assessment_id)
        .single();

      if (assessErr || !assessData) {
        setError("Assessment details not found.");
        setLoading(false);
        return;
      }

      setAssessment(assessData);
      setLoading(false);
    };

    fetchAssessment();
  }, [token]);

  const handleSubmit = async () => {
    if (!assignment || !assessment) return;

    const questions: Question[] = (assessment.questions as any) || [];
    const missing = questions.filter((q) => q.required && !answers[q.id]?.trim());
    if (missing.length > 0) {
      setError(`Please answer all required questions (${missing.length} remaining)`);
      return;
    }

    setSubmitting(true);
    setError("");

    const submittedAnswers = questions.map((q) => ({
      question_id: q.id,
      question_text: q.text,
      answer: answers[q.id] || "",
    }));

    const { error: updateErr } = await supabase
      .from("assessment_assignments" as any)
      .update({
        status: "submitted",
        submitted_answers: submittedAnswers,
        submitted_at: new Date().toISOString(),
      } as any)
      .eq("token", token);

    if (updateErr) {
      setError("Failed to submit. Please try again.");
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full border-none shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-accent mx-auto" />
            <h1 className="text-2xl font-bold">Assessment Submitted!</h1>
            <p className="text-muted-foreground">Thank you for completing the assessment. The recruiter will review your responses.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full border-none shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold">Oops!</h1>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const questions: Question[] = (assessment?.questions as any) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-8 w-8 text-accent" />
            <span className="text-xl font-bold">HireField</span>
          </div>
          <h1 className="text-2xl font-bold">{assessment?.name}</h1>
          <div className="flex items-center justify-center gap-3">
            <Badge variant="secondary">{assessment?.category}</Badge>
            <span className="text-sm text-muted-foreground">{questions.length} questions</span>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">{error}</div>
        )}

        {/* Questions */}
        <div className="space-y-4">
          {questions.map((q, i) => (
            <Card key={q.id} className="border shadow-sm">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-sm font-semibold text-accent">Q{i + 1}.</span>
                  <p className="font-medium text-sm">
                    {q.text} {q.required && <span className="text-destructive">*</span>}
                  </p>
                </div>

                {q.type === "multiple_choice" && (
                  <div className="space-y-2 pl-6">
                    {(q.options || []).map((opt, oi) => (
                      <label key={oi} className="flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer hover:bg-secondary/50 transition-colors">
                        <input
                          type="radio"
                          name={q.id}
                          value={opt}
                          checked={answers[q.id] === opt}
                          onChange={() => setAnswers({ ...answers, [q.id]: opt })}
                          className="accent-accent"
                        />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === "text" && (
                  <div className="pl-6">
                    <Textarea
                      placeholder="Type your answer here..."
                      value={answers[q.id] || ""}
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      className="min-h-[80px]"
                    />
                  </div>
                )}

                {q.type === "rating" && (
                  <div className="pl-6 flex items-center gap-2">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        onClick={() => setAnswers({ ...answers, [q.id]: String(n) })}
                        className={`w-9 h-9 rounded-lg text-sm font-medium border transition-colors ${
                          answers[q.id] === String(n) ? "bg-accent text-accent-foreground border-accent" : "hover:bg-secondary"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {questions.length > 0 && (
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 text-base"
          >
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Submit Assessment
          </Button>
        )}

        {questions.length === 0 && (
          <Card className="border-none shadow-sm">
            <CardContent className="p-8 text-center text-muted-foreground">
              This assessment has no questions yet. Please contact the recruiter.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TakeAssessment;
