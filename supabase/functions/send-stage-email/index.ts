import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { candidate_name, candidate_email, old_stage, new_stage, recruiter_email } = await req.json();

    if (!candidate_email && !recruiter_email) {
      return new Response(
        JSON.stringify({ success: false, error: "No email recipients provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emails: Promise<Response>[] = [];

    // Email to recruiter about the stage change
    if (recruiter_email) {
      emails.push(
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "HireFlow <onboarding@resend.dev>",
            to: [recruiter_email],
            subject: `Stage Update: ${candidate_name} moved to ${new_stage}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                  <h2 style="margin: 0 0 8px; color: #166534;">Pipeline Update</h2>
                  <p style="margin: 0; color: #15803d;">A candidate has moved to a new stage</p>
                </div>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; width: 140px;">Candidate</td>
                    <td style="padding: 8px 0; font-weight: 600;">${candidate_name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Previous Stage</td>
                    <td style="padding: 8px 0;"><span style="background: #f3f4f6; padding: 2px 10px; border-radius: 12px;">${old_stage}</span></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">New Stage</td>
                    <td style="padding: 8px 0;"><span style="background: #dcfce7; color: #166534; padding: 2px 10px; border-radius: 12px; font-weight: 600;">${new_stage}</span></td>
                  </tr>
                </table>
                <p style="margin-top: 24px; color: #9ca3af; font-size: 13px;">Sent by HireFlow</p>
              </div>
            `,
          }),
        })
      );
    }

    // Email to candidate about their progress
    if (candidate_email) {
      emails.push(
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "HireFlow <onboarding@resend.dev>",
            to: [candidate_email],
            subject: `Your application status has been updated`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                  <h2 style="margin: 0 0 8px; color: #1e40af;">Application Update</h2>
                  <p style="margin: 0; color: #1d4ed8;">Great news! Your application has progressed.</p>
                </div>
                <p style="color: #374151; line-height: 1.6;">
                  Hi <strong>${candidate_name}</strong>,<br><br>
                  Your application has moved from <strong>${old_stage}</strong> to <strong>${new_stage}</strong>.
                  We'll keep you updated as things progress.
                </p>
                <p style="margin-top: 24px; color: #9ca3af; font-size: 13px;">Sent by HireFlow</p>
              </div>
            `,
          }),
        })
      );
    }

    const results = await Promise.all(emails);
    const failures = results.filter((r) => !r.ok);

    if (failures.length > 0) {
      const errorBodies = await Promise.all(failures.map((r) => r.text()));
      console.error("Email send failures:", errorBodies);
      throw new Error(`Failed to send ${failures.length} email(s): ${errorBodies.join(", ")}`);
    }

    return new Response(
      JSON.stringify({ success: true, sent: results.length }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in send-stage-email:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
