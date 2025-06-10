
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { RoleRedirect } from "@/components/auth/RoleRedirect";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import DesignAnalysis from "./pages/DesignAnalysis";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/dashboard" 
                element={
                  <AuthGuard requiresSubscription={true}>
                    <RoleRedirect>
                      <Dashboard />
                    </RoleRedirect>
                  </AuthGuard>
                } 
              />
              <Route 
                path="/design-analysis" 
                element={
                  <AuthGuard requiresSubscription={true}>
                    <DesignAnalysis />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/owner-dashboard" 
                element={
                  <AuthGuard>
                    <RoleRedirect ownerOnly={true}>
                      <OwnerDashboard />
                    </RoleRedirect>
                  </AuthGuard>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
