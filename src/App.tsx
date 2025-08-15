import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LeadersTree from "./pages/LeadersTree";
import Dashboard from "./pages/Dashboard";
import LeadersManagement from "./pages/LeadersManagement";
import IndividualsManagement from "./pages/IndividualsManagement";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import { AuthProvider } from "./hooks/useAuth";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const hideHeaderPaths = ['/login'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50" dir="rtl">
      {!hideHeaderPaths.includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/leaders-tree" element={<LeadersTree />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaders" element={<LeadersManagement />} />
        <Route path="/individuals" element={<IndividualsManagement />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;