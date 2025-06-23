
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Auth from '@/pages/Auth';
import { FigmantLayout } from '@/components/figmant/FigmantLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { EnhancedProfileSync } from '@/components/auth/EnhancedProfileSync';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/Toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider delayDuration={300}>
            <EnhancedProfileSync />
            <div className="min-h-screen bg-gray-50">
              <Router>
                <Routes>
                  {/* Auth Route - No Guard */}
                  <Route path="/auth" element={<Auth />} />
                  
                  {/* Main Figmant Application */}
                  <Route
                    path="/figmant/*"
                    element={
                      <AuthGuard>
                        <FigmantLayout />
                      </AuthGuard>
                    }
                  />
                  
                  {/* Root Redirect */}
                  <Route path="/" element={<Navigate to="/figmant" replace />} />
                  
                  {/* Legacy Routes - Redirect to Figmant */}
                  <Route path="/dashboard/*" element={<Navigate to="/figmant" replace />} />
                  <Route path="/competitor-analysis/*" element={<Navigate to="/figmant/analysis" replace />} />
                  
                  {/* Catch All - Redirect to Figmant */}
                  <Route path="*" element={<Navigate to="/figmant" replace />} />
                </Routes>
              </Router>
            </div>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
