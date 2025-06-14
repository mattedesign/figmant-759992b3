
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LogoProvider } from "@/contexts/LogoContext";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DesignAnalysis from "./pages/DesignAnalysis";
import NotFound from "./pages/NotFound";
import OwnerDashboard from "./pages/OwnerDashboard";
import Subscription from "./pages/Subscription";
import AdminAssets from "./pages/AdminAssets";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { RoleRedirect } from "@/components/auth/RoleRedirect";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <LogoProvider>
              <AnalyticsProvider>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route
                    path="/dashboard"
                    element={
                      <AuthGuard>
                        <RoleRedirect />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/user/dashboard"
                    element={
                      <AuthGuard>
                        <Dashboard />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/owner/dashboard"
                    element={
                      <AuthGuard>
                        <RoleRedirect ownerOnly>
                          <OwnerDashboard />
                        </RoleRedirect>
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/admin/assets"
                    element={
                      <AuthGuard>
                        <AdminAssets />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/design-analysis"
                    element={
                      <AuthGuard>
                        <DesignAnalysis />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/subscription"
                    element={
                      <AuthGuard>
                        <Subscription />
                      </AuthGuard>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnalyticsProvider>
            </LogoProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
