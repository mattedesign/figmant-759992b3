
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { RoleRedirect } from '@/components/auth/RoleRedirect';

// Lazy load components
const Index = lazy(() => import('./pages/Index'));
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const OwnerDashboard = lazy(() => import('./pages/OwnerDashboard'));
const DesignAnalysis = lazy(() => import('./pages/DesignAnalysis'));
const Subscription = lazy(() => import('./pages/Subscription'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ProcessingPage = lazy(() => import('./components/design/ProcessingPage').then(module => ({ default: module.ProcessingPage })));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={
                    <AuthGuard>
                      <RoleRedirect>
                        <Dashboard />
                      </RoleRedirect>
                    </AuthGuard>
                  } />
                  <Route path="/processing/:batchId" element={
                    <AuthGuard>
                      <ProcessingPage />
                    </AuthGuard>
                  } />
                  <Route path="/owner" element={
                    <AuthGuard requiredRole="owner">
                      <OwnerDashboard />
                    </AuthGuard>
                  } />
                  <Route path="/design-analysis" element={
                    <AuthGuard>
                      <DesignAnalysis />
                    </AuthGuard>
                  } />
                  <Route path="/subscription" element={
                    <AuthGuard>
                      <Subscription />
                    </AuthGuard>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <Toaster />
              <Sonner />
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
