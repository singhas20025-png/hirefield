import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Building2, Globe, Copy, ExternalLink, Code, CheckCircle, Link2, Briefcase } from "lucide-react";

interface JobListing {
  id: string;
  title: string;
  department: string | null;
  status: string | null;
}

export default function CompanyProfileSetup() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [profile, setProfile] = useState({
    company_name: "",
    slug: "",
    description: "",
    culture_description: "",
    website_url: "",
    industry: "",
    company_size: "",
    headquarters: "",
    brand_color: "#6366f1",
  });
  const [existingId, setExistingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadJobs();
    }
  }, [user]);

  async function loadProfile() {
    const { data } = await supabase
      .from("company_profiles")
      .select("*")
      .eq("user_id", user!.id)
      .single();
    if (data) {
      setProfile({
        company_name: data.company_name || "",
        slug: data.slug || "",
        description: data.description || "",
        culture_description: data.culture_description || "",
        website_url: data.website_url || "",
        industry: data.industry || "",
        company_size: data.company_size || "",
        headquarters: data.headquarters || "",
        brand_color: data.brand_color || "#6366f1",
      });
      setExistingId(data.id);
    }
    setLoading(false);
  }

  async function loadJobs() {
    const { data } = await supabase
      .from("jobs")
      .select("id, title, department, status")
      .eq("user_id", user!.id)
      .eq("status", "Open")
      .order("created_at", { ascending: false });
    setJobs((data as JobListing[]) || []);
  }

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSave = async () => {
    if (!user || !profile.company_name || !profile.slug) {
      toast({ title: "Required", description: "Company name and slug are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (existingId) {
        const { error } = await supabase
          .from("company_profiles")
          .update({ ...profile })
          .eq("id", existingId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("company_profiles")
          .insert({ ...profile, user_id: user.id })
          .select()
          .single();
        if (error) throw error;
        setExistingId(data.id);
      }
      toast({ title: "Saved!", description: "Your career page has been updated." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const origin = window.location.origin;
  const careerPageUrl = `${origin}/careers/${profile.slug}`;

  const getApplyUrl = (jobId: string) => `${origin}/careers/${profile.slug}/apply/${jobId}`;

  const getApplyButtonSnippet = (job: JobListing) =>
    `<!-- HireField Apply Button for "${job.title}" -->\n<a href="${getApplyUrl(job.id)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:12px 28px;background:${profile.brand_color};color:#fff;font-family:system-ui,sans-serif;font-size:16px;font-weight:600;border-radius:8px;text-decoration:none;transition:opacity 0.2s" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">Apply on HireField</a>`;

  const getAllJobsSnippet = () =>
    `<!-- HireField Career Page Widget -->\n<div style="font-family:system-ui,sans-serif">\n  <h3 style="margin-bottom:16px;font-size:20px;font-weight:700">Open Positions</h3>\n${jobs.map(j => `  <a href="${getApplyUrl(j.id)}" target="_blank" rel="noopener noreferrer" style="display:block;padding:16px;margin-bottom:8px;border:1px solid #e5e7eb;border-radius:8px;text-decoration:none;color:inherit;transition:box-shadow 0.2s" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'" onmouseout="this.style.boxShadow='none'">\n    <div style="font-weight:600;font-size:16px;color:#111">${j.title}</div>\n    ${j.department ? `<div style="font-size:13px;color:#6b7280;margin-top:4px">${j.department}</div>` : ''}\n    <span style="display:inline-block;margin-top:8px;padding:6px 16px;background:${profile.brand_color};color:#fff;border-radius:6px;font-size:14px;font-weight:500">Apply Now →</span>\n  </a>`).join('\n')}\n  <p style="margin-top:16px;font-size:12px;color:#9ca3af">Powered by <a href="${origin}" style="color:${profile.brand_color};text-decoration:none">HireField</a></p>\n</div>`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard` });
  };

  if (loading) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Smart Career Portal</h1>
        <p className="text-muted-foreground mt-1">Set up your branded career page and let candidates apply through HireField</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Company Profile</TabsTrigger>
          <TabsTrigger value="integrate" disabled={!existingId}>External Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Company Profile</CardTitle>
                  <CardDescription>This information will appear on your public career page</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input
                        value={profile.company_name}
                        onChange={(e) => {
                          const name = e.target.value;
                          setProfile({ ...profile, company_name: name, slug: profile.slug || generateSlug(name) });
                        }}
                        placeholder="Acme Inc."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>URL Slug</Label>
                      <Input
                        value={profile.slug}
                        onChange={(e) => setProfile({ ...profile, slug: generateSlug(e.target.value) })}
                        placeholder="acme-inc"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Industry</Label>
                      <Input value={profile.industry} onChange={(e) => setProfile({ ...profile, industry: e.target.value })} placeholder="Technology" />
                    </div>
                    <div className="space-y-2">
                      <Label>Company Size</Label>
                      <Input value={profile.company_size} onChange={(e) => setProfile({ ...profile, company_size: e.target.value })} placeholder="50-200" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Headquarters</Label>
                      <Input value={profile.headquarters} onChange={(e) => setProfile({ ...profile, headquarters: e.target.value })} placeholder="San Francisco, CA" />
                    </div>
                    <div className="space-y-2">
                      <Label>Website</Label>
                      <Input value={profile.website_url} onChange={(e) => setProfile({ ...profile, website_url: e.target.value })} placeholder="https://company.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>About the Company</Label>
                    <Textarea value={profile.description} onChange={(e) => setProfile({ ...profile, description: e.target.value })} rows={3} placeholder="Brief company description..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Culture & Values</Label>
                    <Textarea value={profile.culture_description} onChange={(e) => setProfile({ ...profile, culture_description: e.target.value })} rows={3} placeholder="What makes your company a great place to work..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Brand Color</Label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={profile.brand_color} onChange={(e) => setProfile({ ...profile, brand_color: e.target.value })} className="h-9 w-12 rounded cursor-pointer" />
                      <Input value={profile.brand_color} onChange={(e) => setProfile({ ...profile, brand_color: e.target.value })} className="w-28" />
                    </div>
                  </div>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : existingId ? "Update Career Page" : "Create Career Page"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {existingId && (
                <>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Globe className="h-4 w-4 text-accent" />
                        Career Page URL
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">{careerPageUrl}</code>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => copyToClipboard(careerPageUrl, "URL")}>
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <a href={careerPageUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="w-full gap-1.5">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Preview Career Page
                        </Button>
                      </a>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Career page</span>
                          <Badge className="bg-success/15 text-success">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Open jobs</span>
                          <Badge variant="secondary">{jobs.length}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="integrate">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-accent" />
                  How External Apply Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-accent/15 text-accent flex items-center justify-center text-sm font-bold shrink-0">1</div>
                    <div>
                      <p className="font-medium text-foreground text-sm">Add button to your site</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Copy the HTML snippet and paste it on your company's careers page</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-accent/15 text-accent flex items-center justify-center text-sm font-bold shrink-0">2</div>
                    <div>
                      <p className="font-medium text-foreground text-sm">Candidate clicks Apply</p>
                      <p className="text-xs text-muted-foreground mt-0.5">They're redirected to HireField to create an account and fill in their details</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-accent/15 text-accent flex items-center justify-center text-sm font-bold shrink-0">3</div>
                    <div>
                      <p className="font-medium text-foreground text-sm">Application arrives</p>
                      <p className="text-xs text-muted-foreground mt-0.5">You receive the application in your HireField inbox with resume and cover letter</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-accent" />
                  Per-Job Apply Links & Buttons
                </CardTitle>
                <CardDescription>Copy a direct link or embeddable button for each open position</CardDescription>
              </CardHeader>
              <CardContent>
                {jobs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No open jobs. Create a job and set its status to "Open" to generate apply links.</p>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div key={job.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-foreground">{job.title}</p>
                            {job.department && <p className="text-xs text-muted-foreground">{job.department}</p>}
                          </div>
                          <Badge className="bg-success/15 text-success">Open</Badge>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Direct Apply Link</Label>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted px-2 py-1.5 rounded flex-1 truncate">{getApplyUrl(job.id)}</code>
                            <Button variant="outline" size="sm" className="gap-1.5 shrink-0" onClick={() => copyToClipboard(getApplyUrl(job.id), "Apply link")}>
                              <Copy className="h-3.5 w-3.5" />
                              Copy Link
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Embeddable HTML Button</Label>
                          <pre className="text-xs bg-muted p-3 rounded overflow-x-auto whitespace-pre-wrap max-h-24">{getApplyButtonSnippet(job)}</pre>
                          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => copyToClipboard(getApplyButtonSnippet(job), "HTML button code")}>
                            <Code className="h-3.5 w-3.5" />
                            Copy HTML
                          </Button>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Button Preview</Label>
                          <div className="bg-muted/50 border rounded-lg p-4">
                            <a
                              href={getApplyUrl(job.id)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block px-7 py-3 text-white font-semibold rounded-lg text-sm transition-opacity hover:opacity-90"
                              style={{ background: profile.brand_color }}
                            >
                              Apply on HireField
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="h-5 w-5 text-accent" />
                  Full Jobs Widget
                </CardTitle>
                <CardDescription>Embed all open positions as a widget on your website — each with an Apply button linking to HireField</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <pre className="text-xs bg-muted p-3 rounded overflow-x-auto whitespace-pre-wrap max-h-48">{getAllJobsSnippet()}</pre>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => copyToClipboard(getAllJobsSnippet(), "Widget HTML")}>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Widget HTML
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
