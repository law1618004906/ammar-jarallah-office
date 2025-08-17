
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Header from "./components/Header";
import { AuthProvider } from "./hooks/useAuth";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAuth } from "./hooks/useAuth";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load heavy components
const LeadersTree = lazy(() => import("./pages/LeadersTree"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const LeadersManagement = lazy(() => import("./pages/LeadersManagement"));
const IndividualsManagement = lazy(() => import("./pages/IndividualsManagement"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const hideHeaderPaths = ['/login'];
  const { user, loading } = useAuth();

  function RequireAuth({ children }: { children: React.ReactNode }) {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" text="جارٍ التحقق من الهوية..." />
        </div>
      );
    }
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return (
      <Suspense fallback={<LoadingSpinner size="lg" text="جارٍ تحميل الصفحة..." />}>
        {children}
      </Suspense>
    );
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