import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import Interviews from "./pages/Interviews";
import VideoInterview from "./pages/VideoInterview";
import Assessments from "./pages/Assessments";
import AIInsights from "./pages/AIInsights";
import CandidateDetail from "./pages/CandidateDetail";
import Scheduling from "./pages/Scheduling";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Jobs from "./pages/Jobs";
import Compare from "./pages/Compare";
import Reports from "./pages/Reports";
import CompanyProfileSetup from "./pages/CompanyProfileSetup";
import ApplicationsInbox from "./pages/ApplicationsInbox";
import CareerPage from "./pages/CareerPage";
import ApplyJob from "./pages/ApplyJob";
import CandidateAuth from "./pages/CandidateAuth";
import CandidateDashboard from "./pages/CandidateDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <Auth />} />

      {/* Public career pages (no auth required) */}
      <Route path="/careers/:slug" element={<CareerPage />} />
      <Route path="/careers/:slug/apply/:jobId" element={<ApplyJob />} />

      {/* Candidate-facing routes */}
      <Route path="/candidate/auth" element={<CandidateAuth />} />
      <Route path="/candidate/dashboard" element={<CandidateDashboard />} />

      {/* Recruiter app (protected) */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/candidates" element={<Candidates />} />
                <Route path="/candidates/:id" element={<CandidateDetail />} />
                <Route path="/interviews" element={<Interviews />} />
                <Route path="/video-interview" element={<VideoInterview />} />
                <Route path="/assessments" element={<Assessments />} />
                <Route path="/ai-insights" element={<AIInsights />} />
                <Route path="/scheduling" element={<Scheduling />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/career-portal" element={<CompanyProfileSetup />} />
                <Route path="/applications" element={<ApplicationsInbox />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
