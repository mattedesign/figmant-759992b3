
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster as Sonner } from "sonner";
import { useProfileSync } from "@/hooks/useProfileSync";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import Figmant from "./pages/Figmant";
import ProfilePage from "./pages/ProfilePage";
import Subscription from "./pages/Subscription";

const queryClient = new QueryClient();

// Component that uses the profile sync hook
const AppWithProfileSync = () => {
  useProfileSync();
  
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/owner" element={<OwnerDashboard />} />
      <Route path="/figmant" element={<Figmant />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/subscription" element={<Subscription />} />
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
          <AppWithProfileSync />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
