import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from 'react-error-boundary';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { QueryClient } from '@/components/QueryClientProvider';
import { DesignUploadPage } from '@/components/design/DesignUploadPage';
import { DesignDetailsPage } from '@/components/design/DesignDetailsPage';
import { BatchUploadPage } from '@/components/batch-upload/BatchUploadPage';
import { FigmantAnalysisPage } from '@/components/figmant/pages/analysis/FigmantAnalysisPage';
import { FigmantLayout } from '@/components/figmant/FigmantLayout';
import { ScreenshotOneConfig } from '@/components/competitor/ScreenshotOneConfig';
import { FigmantSettingsPage } from '@/components/figmant/pages/FigmantSettingsPage';
import { FigmantPromptsPage } from '@/components/figmant/pages/FigmantPromptsPage';
import { FigmantPromptDetailsPage } from '@/components/figmant/pages/FigmantPromptDetailsPage';
import { FigmantPromptCreatePage } from '@/components/figmant/pages/FigmantPromptCreatePage';
import { FigmantPromptEditPage } from '@/components/figmant/pages/FigmantPromptEditPage';
import { PricingPage } from '@/components/pricing/PricingPage';
import { SubscriptionPage } from '@/components/pricing/SubscriptionPage';
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
            <Routes>
              <Route path="/" element={<Navigate to="/design" replace />} />
              <Route path="/login" element={<DesignUploadPage />} />
              <Route path="/signup" element={<DesignUploadPage />} />
              <Route path="/design" element={
                <AuthGuard>
                  <DesignUploadPage />
                </AuthGuard>
              } />
              <Route path="/design/:id" element={
                <AuthGuard>
                  <DesignDetailsPage />
                </AuthGuard>
              } />
              <Route path="/batch" element={
                <AuthGuard>
                  <BatchUploadPage />
                </AuthGuard>
              } />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/subscribe" element={
                <AuthGuard>
                  <SubscriptionPage />
                </AuthGuard>
              } />
              
              {/* Figmant Routes */}
              <Route path="/figmant/*" element={
                <AuthGuard>
                  <FigmantLayout />
                </AuthGuard>
              }>
                <Route path="analysis" element={<FigmantAnalysisPage />} />
                <Route path="settings" element={<FigmantSettingsPage />} />
                <Route path="screenshot-config" element={<ScreenshotOneConfig />} />
                <Route path="prompts" element={<FigmantPromptsPage />} />
                <Route path="prompts/:id" element={<FigmantPromptDetailsPage />} />
                <Route path="prompts/:id/edit" element={<FigmantPromptEditPage />} />
                <Route path="prompts/create" element={<FigmantPromptCreatePage />} />
                <Route path="chat2" element={<Chat2Page />} />
              </Route>

              {/* Public Figmant Analysis Route (no auth) */}
              <Route path="/public/figmant/analysis/:uploadId" element={<FigmantAnalysisPage />} />
            </Routes>
          </QueryClient>
        </AuthProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
