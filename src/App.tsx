
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LeadersTree from "./pages/LeadersTree";
import Dashboard from "./pages/Dashboard";
import LeadersManagement from "./pages/LeadersManagement";
import IndividualsManagement from "./pages/IndividualsManagement";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import { AuthProvider } from "./hooks/useAuth";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const hideHeaderPaths = ['/login'];
  const { user, loading } = useAuth();

  function RequireAuth({ children }: { children: React.ReactNode }) {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      );
    }
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
  }

  return (
    <div className="formal-bg min-h-screen" dir="rtl">
      {!hideHeaderPaths.includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RequireAuth><HomePage /></RequireAuth>} />
        <Route path="/leaders-tree" element={<RequireAuth><LeadersTree /></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/leaders" element={<RequireAuth><LeadersManagement /></RequireAuth>} />
        <Route path="/individuals" element={<RequireAuth><IndividualsManagement /></RequireAuth>} />
        <Route path="*" element={<RequireAuth><NotFound /></RequireAuth>} />
      </Routes>
      <Toaster />
    </div>);

}

const App = () =>
<QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>;


export default App;