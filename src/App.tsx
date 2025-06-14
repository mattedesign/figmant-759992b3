
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { RoleRedirect } from '@/components/auth/RoleRedirect';

// Lazy load components with better error handling
const Auth = lazy(() => import('./pages/Auth').catch(err => {
  console.error('Failed to load Auth page:', err);
  return { default: () => <div>Error loading auth page</div> };
}));

const Dashboard = lazy(() => import('./pages/Dashboard').catch(err => {
  console.error('Failed to load Dashboard page:', err);
  return { default: () => <div>Error loading dashboard</div> };
}));

const SubscriberDashboard = lazy(() => import('./pages/SubscriberDashboard').catch(err => {
  console.error('Failed to load SubscriberDashboard page:', err);
  return { default: () => <div>Error loading subscriber dashboard. Please check console for details.</div> };
}));

const OwnerDashboard = lazy(() => import('./pages/OwnerDashboard').catch(err => {
  console.error('Failed to load OwnerDashboard page:', err);
  return { default: () => <div>Error loading owner dashboard. Please check console for details.</div> };
}));

const DesignAnalysis = lazy(() => import('./pages/DesignAnalysis').catch(err => {
  console.error('Failed to load DesignAnalysis page:', err);
  return { default: () => <div>Error loading design analysis page</div> };
}));

const Subscription = lazy(() => import('./pages/Subscription').catch(err => {
  console.error('Failed to load Subscription page:', err);
  return { default: () => <div>Error loading subscription page</div> };
}));

const AdminAssets = lazy(() => import('./pages/AdminAssets').catch(err => {
  console.error('Failed to load AdminAssets page:', err);
  return { default: () => <div>Error loading admin assets page</div> };
}));

const NotFound = lazy(() => import('./pages/NotFound').catch(err => {
  console.error('Failed to load NotFound page:', err);
  return { default: () => <div>Page not found</div> };
}));

const ProcessingPage = lazy(() => import('./components/design/ProcessingPage').then(module => ({ default: module.ProcessingPage })).catch(err => {
  console.error('Failed to load ProcessingPage:', err);
  return { default: () => <div>Error loading processing page</div> };
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        console.error('Query failed:', error);
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const LoadingFallback = ({ message = "Loading..." }: { message?: string }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  </div>
);

function App() {
  console.log('App component mounting...');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Auth route - accessible to all, but authenticated users see different content */}
                  <Route path="/" element={<Auth />} />
                  
                  {/* Protected dashboard routes */}
                  <Route path="/dashboard" element={
                    <AuthGuard>
                      <RoleRedirect>
                        <Suspense fallback={<LoadingFallback message="Loading dashboard..." />}>
                          <SubscriberDashboard />
                        </Suspense>
                      </RoleRedirect>
                    </AuthGuard>
                  } />
                  
                  <Route path="/processing/:batchId" element={
                    <AuthGuard>
                      <ProcessingPage />
                    </AuthGuard>
                  } />
                  
                  <Route path="/owner" element={
                    <AuthGuard requireOwner>
                      <Suspense fallback={<LoadingFallback message="Loading owner dashboard..." />}>
                        <OwnerDashboard />
                      </Suspense>
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
                  
                  <Route path="/admin/assets" element={
                    <AuthGuard>
                      <AdminAssets />
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
