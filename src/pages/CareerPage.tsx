import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Clock, DollarSign, Building2, Search, Briefcase, Globe } from "lucide-react";

interface CompanyProfile {
  id: string;
  company_name: string;
  slug: string;
  logo_url: string | null;
  cover_image_url: string | null;
  description: string | null;
  culture_description: string | null;
  website_url: string | null;
  industry: string | null;
  company_size: string | null;
  headquarters: string | null;
  brand_color: string;
}

interface Job {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  type: string | null;
  salary: string | null;
  description: string | null;
  posted_date: string | null;
}

export default function CareerPage() {
  const { slug } = useParams<{ slug: string }>();
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  useEffect(() => {
    async function load() {
      const { data: companyData } = await supabase
        .from("company_profiles")
        .select("*")
        .eq("slug", slug!)
        .single();

      if (companyData) {
        setCompany(companyData as CompanyProfile);

        // Get jobs owned by this company's user
        const { data: jobsData } = await supabase
          .from("jobs")
          .select("*")
          .eq("user_id", companyData.user_id)
          .eq("status", "Open")
          .order("posted_date", { ascending: false });

        setJobs((jobsData as Job[]) || []);
      }
      setLoading(false);
    }
    if (slug) load();
  }, [slug]);

  const departments = [...new Set(jobs.map((j) => j.department).filter(Boolean))] as string[];

  const filtered = jobs.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      (j.department?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchDept = departmentFilter === "All" || j.department === departmentFilter;
    return matchSearch && matchDept;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Skeleton className="h-48 w-full rounded-xl mb-6" />
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">Company not found</h1>
          <p className="text-muted-foreground">This career page doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div
        className="relative h-56 md:h-72 flex items-end"
        style={{
          background: company.cover_image_url
            ? `url(${company.cover_image_url}) center/cover`
            : `linear-gradient(135deg, ${company.brand_color}, hsl(var(--accent)))`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-5xl mx-auto w-full px-6 pb-6">
          <div className="flex items-end gap-4">
            {company.logo_url ? (
              <img src={company.logo_url} alt={company.company_name} className="h-16 w-16 rounded-xl bg-card object-cover" />
            ) : (
              <div className="h-16 w-16 rounded-xl bg-card flex items-center justify-center">
                <Building2 className="h-8 w-8 text-accent" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white">{company.company_name}</h1>
              <div className="flex items-center gap-3 text-white/80 text-sm mt-1">
                {company.industry && <span>{company.industry}</span>}
                {company.headquarters && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {company.headquarters}
                  </span>
                )}
                {company.company_size && <span>{company.company_size} employees</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* About */}
        {(company.description || company.culture_description) && (
          <div className="space-y-3">
            {company.description && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">About Us</h2>
                <p className="text-muted-foreground">{company.description}</p>
              </div>
            )}
            {company.culture_description && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Our Culture</h2>
                <p className="text-muted-foreground">{company.culture_description}</p>
              </div>
            )}
          </div>
        )}

        {/* Job Listings */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">
            Open Positions ({jobs.length})
          </h2>

          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search roles..."
                className="pl-9 h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <Badge
                variant={departmentFilter === "All" ? "default" : "secondary"}
                className={`cursor-pointer ${departmentFilter === "All" ? "bg-accent text-accent-foreground" : ""}`}
                onClick={() => setDepartmentFilter("All")}
              >
                All
              </Badge>
              {departments.map((d) => (
                <Badge
                  key={d}
                  variant={departmentFilter === d ? "default" : "secondary"}
                  className={`cursor-pointer ${departmentFilter === d ? "bg-accent text-accent-foreground" : ""}`}
                  onClick={() => setDepartmentFilter(d)}
                >
                  {d}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                      <h3 className="font-semibold text-foreground text-lg">{job.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {job.department && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5" />
                            {job.department}
                          </span>
                        )}
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {job.location}
                          </span>
                        )}
                        {job.type && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {job.type}
                          </span>
                        )}
                        {job.salary && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5" />
                            {job.salary}
                          </span>
                        )}
                      </div>
                      {job.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{job.description}</p>
                      )}
                    </div>
                    <Link to={`/careers/${slug}/apply/${job.id}`}>
                      <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                        Apply Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No open positions found
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-6 flex items-center justify-between text-sm text-muted-foreground">
          <span>Powered by HireField</span>
          {company.website_url && (
            <a href={company.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground">
              <Globe className="h-3.5 w-3.5" />
              Company Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
