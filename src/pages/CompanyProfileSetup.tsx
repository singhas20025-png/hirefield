import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building2, Globe, Copy, ExternalLink, Code, CheckCircle } from "lucide-react";

export default function CompanyProfileSetup() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    if (user) loadProfile();
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

  const careerPageUrl = `${window.location.origin}/careers/${profile.slug}`;

  const embedCode = `<div id="hirefield-jobs"></div>
<script src="${window.location.origin}/embed.js" data-company="${profile.slug}"></script>`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard` });
  };

  if (loading) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Smart Career Portal</h1>
        <p className="text-muted-foreground mt-1">Set up your branded career page and embed jobs on your website</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
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

        {/* Integration Panel */}
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
                    <Code className="h-4 w-4 text-accent" />
                    Embed Widget
                  </CardTitle>
                  <CardDescription className="text-xs">Paste this code into your website to show job listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-muted p-3 rounded overflow-x-auto whitespace-pre-wrap">{embedCode}</pre>
                  <Button variant="outline" size="sm" className="w-full mt-2 gap-1.5" onClick={() => copyToClipboard(embedCode, "Embed code")}>
                    <Copy className="h-3.5 w-3.5" />
                    Copy Embed Code
                  </Button>
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
                      <span className="text-muted-foreground">Public jobs</span>
                      <Badge variant="secondary">Auto-synced</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
