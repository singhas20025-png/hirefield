import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Users, Briefcase, Brain, BarChart3, Mail, Video,
  CheckCircle2, ArrowRight, Star, Zap, Shield, Globe,
  Clock, Target, Sparkles, ChevronRight, PlayCircle
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Candidate Management",
    description: "Track candidates through every stage with a visual Kanban pipeline. Drag-and-drop simplicity meets powerful filtering.",
  },
  {
    icon: Briefcase,
    title: "Job Posting & Career Portal",
    description: "Create branded career pages, embed apply widgets on any website, and capture applications with UTM tracking.",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Get intelligent candidate scoring, skill gap analysis, and hiring recommendations powered by advanced AI models.",
  },
  {
    icon: Video,
    title: "Video Interviews",
    description: "Built-in video interviews or integrate with Zoom & Google Meet. Schedule, conduct, and rate — all in one place.",
  },
  {
    icon: Target,
    title: "Smart Assessments",
    description: "Create custom assessments with multiple question types. Send unique links to candidates and auto-score submissions.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Track time-to-hire, source effectiveness, pipeline velocity, and diversity metrics with real-time dashboards.",
  },
  {
    icon: Mail,
    title: "Email Notifications",
    description: "Automated emails for stage changes, interview scheduling, and assessment invitations via your custom domain.",
  },
  {
    icon: Globe,
    title: "External Integration",
    description: "Replace any company's apply button with HireField. Candidates click apply on LinkedIn or any site and land on your portal.",
  },
];

const pricingPlans = [
  {
    name: "Startup",
    price: "$99",
    period: "/month",
    description: "Perfect for small teams just starting to hire",
    features: [
      "Up to 5 active job postings",
      "100 candidates/month",
      "Basic AI candidate scoring",
      "Email notifications",
      "Career page builder",
      "1 team member",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Growth",
    price: "$399",
    period: "/month",
    description: "For growing companies scaling their hiring",
    features: [
      "Unlimited job postings",
      "Unlimited candidates",
      "Advanced AI insights & recommendations",
      "Video interviews (built-in + Zoom/Meet)",
      "Custom assessments & auto-scoring",
      "Analytics & reporting dashboard",
      "External apply widget & UTM tracking",
      "Up to 10 team members",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with complex needs",
    features: [
      "Everything in Growth",
      "Unlimited team members",
      "Custom integrations & API access",
      "SSO & advanced security",
      "Dedicated account manager",
      "Custom onboarding & training",
      "SLA guarantee",
      "White-label options",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const testimonials = [
  {
    quote: "HireField cut our time-to-hire by 40%. The AI scoring alone saved our team dozens of hours each week.",
    author: "Sarah Mitchell",
    role: "VP of People",
    company: "TechScale Inc.",
    rating: 5,
  },
  {
    quote: "The external apply widget is genius. We replaced Workday links with HireField and our completion rate tripled.",
    author: "James Park",
    role: "Head of Talent",
    company: "Meridian Labs",
    rating: 5,
  },
  {
    quote: "Finally an ATS that doesn't feel like it was built in 2005. Clean, fast, and our recruiters actually enjoy using it.",
    author: "Priya Sharma",
    role: "Recruiting Manager",
    company: "Novus Digital",
    rating: 5,
  },
];

const stats = [
  { value: "40%", label: "Faster time-to-hire" },
  { value: "3x", label: "More applicant completions" },
  { value: "10k+", label: "Candidates processed" },
  { value: "98%", label: "Customer satisfaction" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">HireField</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
            <a href="#testimonials" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pb-20 pt-16 sm:pt-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-accent/8 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium">
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-accent" />
            AI-Powered Hiring Platform
          </Badge>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Hire the right people,{" "}
            <span className="text-accent">faster than ever</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            HireField is the modern applicant tracking system that combines AI insights,
            seamless workflows, and beautiful career pages to transform your hiring process.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/auth">
              <Button size="lg" className="h-12 bg-accent px-8 text-base text-accent-foreground hover:bg-accent/90">
                Start Hiring Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
              <PlayCircle className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-accent">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t bg-card py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 px-3 py-1">
              <Shield className="mr-1.5 h-3.5 w-3.5 text-accent" />
              Features
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Everything you need to hire smarter
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              From sourcing to offer, HireField streamlines every step with powerful tools
              that your whole team will love.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="group border bg-background transition-all hover:shadow-lg hover:border-accent/30">
                <CardHeader className="pb-3">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 px-3 py-1">
              <Clock className="mr-1.5 h-3.5 w-3.5 text-accent" />
              How It Works
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Up and running in minutes
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create Your Portal",
                description: "Set up your branded career page and post jobs in minutes. Customize colors, logo, and culture section.",
              },
              {
                step: "02",
                title: "Share & Collect",
                description: "Share apply links on any platform with UTM tracking. Embed widgets on your website. Applications flow into one inbox.",
              },
              {
                step: "03",
                title: "Hire with AI",
                description: "AI scores and ranks candidates automatically. Schedule interviews, send assessments, and extend offers — all from one dashboard.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-xl font-bold text-accent">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="border-t bg-card py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 px-3 py-1">
              <Zap className="mr-1.5 h-3.5 w-3.5 text-accent" />
              Pricing
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Start free. Scale as you grow. No hidden fees.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col transition-all hover:shadow-lg ${
                  plan.popular
                    ? "border-2 border-accent shadow-lg scale-[1.02]"
                    : "border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/auth" className="w-full">
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-accent text-accent-foreground hover:bg-accent/90"
                          : ""
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="border-t py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 px-3 py-1">
              <Star className="mr-1.5 h-3.5 w-3.5 text-accent" />
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Loved by hiring teams everywhere
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.author} className="border">
                <CardContent className="pt-6">
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                      {testimonial.author.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{testimonial.author}</div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-primary py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
            Ready to transform your hiring?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/70">
            Join hundreds of companies using HireField to find and hire the best talent.
            Start your free trial today — no credit card required.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/auth">
              <Button size="lg" className="h-12 bg-accent px-8 text-base text-accent-foreground hover:bg-accent/90">
                Start Hiring Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-12 border-primary-foreground/20 px-8 text-base text-primary-foreground hover:bg-primary-foreground/10">
              Talk to Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Zap className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">HireField</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                The modern ATS that makes hiring fast, fair, and delightful for everyone.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Product</h4>
              <ul className="mt-3 space-y-2">
                {["Features", "Pricing", "Integrations", "API"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Company</h4>
              <ul className="mt-3 space-y-2">
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Legal</h4>
              <ul className="mt-3 space-y-2">
                {["Privacy Policy", "Terms of Service", "Security", "GDPR"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} HireField. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
