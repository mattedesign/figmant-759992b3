
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Subscription from '@/pages/Subscription';
import PaymentSuccess from '@/pages/PaymentSuccess';
import OwnerDashboard from '@/pages/OwnerDashboard';
import DesignAnalysis from '@/pages/DesignAnalysis';
import StripeWebhookTest from '@/pages/StripeWebhookTest';
import AdminAssets from '@/pages/AdminAssets';
import { FigmantLayout } from '@/components/figmant/FigmantLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import ProfilePage from './pages/ProfilePage';
import { EnhancedProfileSync } from '@/components/auth/EnhancedProfileSync';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/Toaster';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <EnhancedProfileSync />
          <div className="min-h-screen bg-gray-50">
            <Router>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/figmant"
                  element={
                    <AuthGuard>
                      <FigmantLayout />
                    </AuthGuard>
                  }
                />
                <Route path="/" element={<Navigate to="/figmant" replace />} />
                <Route
                  path="/dashboard"
                  element={
                    <AuthGuard>
                      <Dashboard />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/analysis"
                  element={
                    <AuthGuard>
                      <DesignAnalysis />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <AuthGuard>
                      <ProfilePage />
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
                <Route
                  path="/payment-success"
                  element={
                    <AuthGuard>
                      <PaymentSuccess />
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
                  path="/stripe-webhook-test"
                  element={
                    <AuthGuard requireOwner>
                      <StripeWebhookTest />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/owner"
                  element={
                    <AuthGuard requireOwner>
                      <OwnerDashboard />
                    </AuthGuard>
                  }
                />
              </Routes>
            </Router>
          </div>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
