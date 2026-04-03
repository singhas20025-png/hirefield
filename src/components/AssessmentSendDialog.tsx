import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Copy, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessmentId: string;
  assessmentName: string;
}

export const AssessmentSendDialog = ({ open, onOpenChange, assessmentId, assessmentName }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("assessment_assignments" as any)
        .insert({
          assessment_id: assessmentId,
          candidate_email: email,
          candidate_name: name || null,
          user_id: user.id,
        } as any)
        .select("token")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      const link = `${window.location.origin}/assessment/${data.token}`;
      setGeneratedLink(link);
      queryClient.invalidateQueries({ queryKey: ["assessment-assignments", assessmentId] });
      
      // Try to send email notification
      supabase.functions.invoke("send-stage-email", {
        body: {
          to: email,
          subject: `You've been invited to complete: ${assessmentName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1a1a2e;">Assessment Invitation</h2>
              <p>Hi${name ? ` ${name}` : ""},</p>
              <p>You have been invited to complete the assessment: <strong>${assessmentName}</strong></p>
              <p>Click the button below to start:</p>
              <a href="${link}" style="display: inline-block; padding: 12px 24px; background-color: #2dd4a8; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Start Assessment</a>
              <p style="margin-top: 20px; color: #666; font-size: 12px;">If the button doesn't work, copy and paste this link: ${link}</p>
            </div>
          `,
        },
      }).catch(() => {
        // Email sending is best-effort
      });

      toast({ title: "Assessment Sent", description: `Invitation sent to ${email}` });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setEmail("");
      setName("");
      setGeneratedLink("");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Assessment to Candidate</DialogTitle>
        </DialogHeader>
        {generatedLink ? (
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">Assessment link generated and email sent!</p>
            <div className="flex items-center gap-2">
              <Input value={generatedLink} readOnly className="text-xs" />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button className="w-full" variant="outline" onClick={() => { setGeneratedLink(""); setEmail(""); setName(""); }}>
              Send to Another Candidate
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Candidate Email *</Label>
              <Input placeholder="candidate@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Candidate Name</Label>
              <Input placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <Button
              onClick={() => sendMutation.mutate()}
              disabled={!email || sendMutation.isPending}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {sendMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Send Assessment
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
