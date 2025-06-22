
import React from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from 'react-error-boundary';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { QueryClient } from '@/components/QueryClient';
import { FigmantLayout } from '@/components/figmant/FigmantLayout';
import { ScreenshotOneConfig } from '@/components/competitor/ScreenshotOneConfig';
import { Chat2Page } from '@/components/figmant/pages/Chat2Page';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <div className="App">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AuthProvider>
          <Toaster />
          <QueryClient>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/figmant" replace />} />
                <Route path="/login" element={<div>Login Page - To be implemented</div>} />
                <Route path="/signup" element={<div>Signup Page - To be implemented</div>} />
                
                {/* Figmant Routes */}
                <Route path="/figmant/*" element={
                  <AuthGuard>
                    <FigmantLayout />
                  </AuthGuard>
                }>
                  <Route path="chat2" element={<Chat2Page />} />
                  <Route path="screenshot-config" element={<ScreenshotOneConfig />} />
                </Route>

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/figmant" replace />} />
              </Routes>
            </BrowserRouter>
          </QueryClient>
        </AuthProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
