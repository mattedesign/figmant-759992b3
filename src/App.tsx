
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
import OwnerDashboard from '@/pages/OwnerDashboard';
import { FigmantLayout } from '@/components/figmant/FigmantLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import ProfilePage from './pages/ProfilePage';

const App: React.FC = () => {
  return (
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
          path="/owner"
          element={
            <AuthGuard requireOwner>
              <OwnerDashboard />
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
