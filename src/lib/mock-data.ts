export const mockCandidates = [
  { id: "1", name: "Sarah Chen", role: "Senior Frontend Engineer", stage: "Interview", score: 92, avatar: "SC", appliedDate: "2026-02-28", source: "LinkedIn" },
  { id: "2", name: "Marcus Johnson", role: "Product Manager", stage: "Assessment", score: 87, avatar: "MJ", appliedDate: "2026-03-01", source: "Referral" },
  { id: "3", name: "Priya Patel", role: "Data Scientist", stage: "Screening", score: 78, avatar: "PP", appliedDate: "2026-03-02", source: "Indeed" },
  { id: "4", name: "James Wilson", role: "Backend Engineer", stage: "Offer", score: 95, avatar: "JW", appliedDate: "2026-02-25", source: "LinkedIn" },
  { id: "5", name: "Elena Rodriguez", role: "UX Designer", stage: "Interview", score: 84, avatar: "ER", appliedDate: "2026-03-03", source: "Portfolio" },
  { id: "6", name: "David Kim", role: "DevOps Engineer", stage: "Screening", score: 71, avatar: "DK", appliedDate: "2026-03-04", source: "GitHub" },
  { id: "7", name: "Anna Müller", role: "Senior Frontend Engineer", stage: "Hired", score: 96, avatar: "AM", appliedDate: "2026-02-15", source: "Referral" },
  { id: "8", name: "Tom Baker", role: "QA Engineer", stage: "Rejected", score: 45, avatar: "TB", appliedDate: "2026-02-20", source: "Indeed" },
];

export const mockInterviews = [
  { id: "1", candidate: "Sarah Chen", role: "Senior Frontend Engineer", type: "Technical", date: "2026-03-05", time: "10:00 AM", interviewer: "Alex Rivera", status: "Upcoming" },
  { id: "2", candidate: "Elena Rodriguez", role: "UX Designer", type: "Portfolio Review", date: "2026-03-05", time: "2:00 PM", interviewer: "Maya Thompson", status: "Upcoming" },
  { id: "3", candidate: "Marcus Johnson", role: "Product Manager", type: "Case Study", date: "2026-03-06", time: "11:00 AM", interviewer: "Chris Lee", status: "Scheduled" },
  { id: "4", candidate: "David Kim", role: "DevOps Engineer", type: "Screening", date: "2026-03-04", time: "3:00 PM", interviewer: "Jordan Park", status: "Completed" },
  { id: "5", candidate: "Priya Patel", role: "Data Scientist", type: "Technical", date: "2026-03-07", time: "9:00 AM", interviewer: "Alex Rivera", status: "Scheduled" },
];

export const pipelineData = [
  { stage: "Applied", count: 156 },
  { stage: "Screening", count: 89 },
  { stage: "Assessment", count: 42 },
  { stage: "Interview", count: 28 },
  { stage: "Offer", count: 8 },
  { stage: "Hired", count: 5 },
];

export const hiringTrendData = [
  { month: "Sep", applications: 120, hired: 8 },
  { month: "Oct", applications: 145, hired: 12 },
  { month: "Nov", applications: 98, hired: 6 },
  { month: "Dec", applications: 167, hired: 15 },
  { month: "Jan", applications: 189, hired: 11 },
  { month: "Feb", applications: 210, hired: 18 },
];

export const stageColors: Record<string, string> = {
  Screening: "bg-info/15 text-info",
  Assessment: "bg-warning/15 text-warning",
  Interview: "bg-accent/15 text-accent",
  Offer: "bg-success/15 text-success",
  Hired: "bg-success/15 text-success",
  Rejected: "bg-destructive/15 text-destructive",
};
