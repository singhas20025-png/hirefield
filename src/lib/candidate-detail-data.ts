import { mockCandidates, mockInterviews } from "./mock-data";
import { talentDNAData } from "./ai-mock-data";

export interface CandidateDetail {
  id: string;
  name: string;
  avatar: string;
  role: string;
  stage: string;
  score: number;
  source: string;
  appliedDate: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  education: string;
  skills: string[];
  interviewHistory: {
    id: string;
    type: string;
    date: string;
    interviewer: string;
    status: string;
    rating: number;
    notes: string;
  }[];
  assessments: {
    name: string;
    category: string;
    score: number;
    maxScore: number;
    completedAt: string;
  }[];
  timeline: {
    event: string;
    date: string;
    description: string;
  }[];
}

const candidateExtras: Record<string, Partial<CandidateDetail>> = {
  "1": {
    email: "sarah.chen@email.com",
    phone: "+1 (415) 555-0142",
    location: "San Francisco, CA",
    experience: "6 years",
    education: "M.S. Computer Science, Stanford",
    skills: ["React", "TypeScript", "System Design", "GraphQL", "Node.js", "AWS"],
    interviewHistory: [
      { id: "i1", type: "Phone Screening", date: "2026-03-01", interviewer: "Jordan Park", status: "Completed", rating: 4, notes: "Strong communication, clear about career goals." },
      { id: "i2", type: "Technical Round", date: "2026-03-05", interviewer: "Alex Rivera", status: "Upcoming", rating: 0, notes: "" },
    ],
    assessments: [
      { name: "Logical Reasoning", category: "Aptitude", score: 92, maxScore: 100, completedAt: "2026-03-02" },
      { name: "React Proficiency", category: "Technical", score: 95, maxScore: 100, completedAt: "2026-03-02" },
      { name: "System Design", category: "Technical", score: 82, maxScore: 100, completedAt: "2026-03-03" },
      { name: "Personality Assessment", category: "Psychometric", score: 78, maxScore: 100, completedAt: "2026-03-03" },
    ],
    timeline: [
      { event: "Applied", date: "2026-02-28", description: "Application received via LinkedIn" },
      { event: "Screening", date: "2026-03-01", description: "Phone screening completed with Jordan Park" },
      { event: "Assessment", date: "2026-03-02", description: "Completed aptitude and technical assessments" },
      { event: "Interview", date: "2026-03-05", description: "Technical interview scheduled with Alex Rivera" },
    ],
  },
  "2": {
    email: "marcus.j@email.com",
    phone: "+1 (212) 555-0198",
    location: "New York, NY",
    experience: "8 years",
    education: "MBA, Harvard Business School",
    skills: ["Product Strategy", "Roadmapping", "Data Analysis", "Agile", "Stakeholder Mgmt"],
    interviewHistory: [
      { id: "i3", type: "Phone Screening", date: "2026-03-02", interviewer: "Maya Thompson", status: "Completed", rating: 5, notes: "Exceptional communicator. Very structured thinking." },
    ],
    assessments: [
      { name: "Case Study Analysis", category: "Aptitude", score: 88, maxScore: 100, completedAt: "2026-03-03" },
      { name: "Leadership Assessment", category: "Psychometric", score: 91, maxScore: 100, completedAt: "2026-03-03" },
    ],
    timeline: [
      { event: "Applied", date: "2026-03-01", description: "Referred by internal employee" },
      { event: "Screening", date: "2026-03-02", description: "Phone screening completed" },
      { event: "Assessment", date: "2026-03-03", description: "Completed case study and psychometric tests" },
    ],
  },
  "3": {
    email: "priya.patel@email.com",
    phone: "+1 (408) 555-0167",
    location: "San Jose, CA",
    experience: "4 years",
    education: "M.S. Data Science, UC Berkeley",
    skills: ["Python", "TensorFlow", "SQL", "Spark", "Statistics", "NLP"],
    interviewHistory: [],
    assessments: [
      { name: "Quantitative Reasoning", category: "Aptitude", score: 85, maxScore: 100, completedAt: "2026-03-04" },
    ],
    timeline: [
      { event: "Applied", date: "2026-03-02", description: "Application received via Indeed" },
      { event: "Screening", date: "2026-03-04", description: "Resume screening in progress" },
    ],
  },
  "4": {
    email: "james.wilson@email.com",
    phone: "+1 (503) 555-0134",
    location: "Portland, OR",
    experience: "9 years",
    education: "B.S. Computer Engineering, MIT",
    skills: ["Go", "Kubernetes", "PostgreSQL", "gRPC", "Distributed Systems", "Terraform"],
    interviewHistory: [
      { id: "i4", type: "Phone Screening", date: "2026-02-26", interviewer: "Jordan Park", status: "Completed", rating: 5, notes: "Deep technical knowledge. Impressive systems background." },
      { id: "i5", type: "Technical Round", date: "2026-02-28", interviewer: "Alex Rivera", status: "Completed", rating: 5, notes: "Flawless system design. Excellent problem decomposition." },
      { id: "i6", type: "Culture Fit", date: "2026-03-01", interviewer: "Maya Thompson", status: "Completed", rating: 4, notes: "Good alignment. Slightly reserved in team scenarios." },
    ],
    assessments: [
      { name: "System Design", category: "Technical", score: 97, maxScore: 100, completedAt: "2026-02-27" },
      { name: "Logical Reasoning", category: "Aptitude", score: 93, maxScore: 100, completedAt: "2026-02-27" },
      { name: "Coding Challenge", category: "Technical", score: 96, maxScore: 100, completedAt: "2026-02-27" },
      { name: "Personality Assessment", category: "Psychometric", score: 74, maxScore: 100, completedAt: "2026-02-28" },
    ],
    timeline: [
      { event: "Applied", date: "2026-02-25", description: "Application received via LinkedIn" },
      { event: "Screening", date: "2026-02-26", description: "Phone screening completed" },
      { event: "Assessment", date: "2026-02-27", description: "All assessments completed — top performer" },
      { event: "Interview", date: "2026-03-01", description: "All interview rounds completed" },
      { event: "Offer", date: "2026-03-03", description: "Offer extended — awaiting response" },
    ],
  },
  "5": {
    email: "elena.r@email.com",
    phone: "+1 (310) 555-0189",
    location: "Los Angeles, CA",
    experience: "5 years",
    education: "B.F.A. Interaction Design, RISD",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Accessibility", "Motion Design"],
    interviewHistory: [
      { id: "i7", type: "Portfolio Review", date: "2026-03-05", interviewer: "Maya Thompson", status: "Upcoming", rating: 0, notes: "" },
    ],
    assessments: [
      { name: "Design Thinking", category: "Aptitude", score: 90, maxScore: 100, completedAt: "2026-03-04" },
      { name: "Creativity Assessment", category: "Psychometric", score: 96, maxScore: 100, completedAt: "2026-03-04" },
    ],
    timeline: [
      { event: "Applied", date: "2026-03-03", description: "Application received via Portfolio site" },
      { event: "Screening", date: "2026-03-04", description: "Resume and portfolio reviewed" },
      { event: "Interview", date: "2026-03-05", description: "Portfolio review scheduled" },
    ],
  },
};

// Defaults for candidates without extra data
const defaultExtra: Omit<CandidateDetail, "id" | "name" | "avatar" | "role" | "stage" | "score" | "source" | "appliedDate"> = {
  email: "candidate@email.com",
  phone: "+1 (555) 000-0000",
  location: "United States",
  experience: "3 years",
  education: "B.S. Computer Science",
  skills: ["General"],
  interviewHistory: [],
  assessments: [],
  timeline: [{ event: "Applied", date: "2026-03-01", description: "Application received" }],
};

export function getCandidateDetail(id: string): CandidateDetail | null {
  const base = mockCandidates.find((c) => c.id === id);
  if (!base) return null;
  const extras = candidateExtras[id] || {};
  return { ...defaultExtra, ...base, ...extras } as CandidateDetail;
}

export function getCandidateAI(id: string) {
  return talentDNAData.find((c) => c.candidateId === id) || null;
}
