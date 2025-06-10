
import React, { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthCard } from '@/components/auth/AuthCard';
import { PasswordResetForm } from '@/components/auth/PasswordResetForm';
import { UpdatePasswordForm } from '@/components/auth/UpdatePasswordForm';
import { TestingGuide } from '@/components/auth/TestingGuide';
import { Brain } from 'lucide-react';

const Auth = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  // Check if we're in password reset mode
  const resetMode = searchParams.get('mode') === 'reset';

  // Redirect if already authenticated and not in reset mode
  if (user && !loading && !resetMode) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show password update form if user is authenticated and in reset mode
  if (user && resetMode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center space-y-2 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">UX Analytics AI</h1>
            </div>
          </div>
          <UpdatePasswordForm />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <AuthHeader />

        {showPasswordReset ? (
          <PasswordResetForm onBack={() => setShowPasswordReset(false)} />
        ) : (
          <AuthCard onForgotPassword={() => setShowPasswordReset(true)} />
        )}

        <TestingGuide />

        <div className="text-center text-sm text-muted-foreground">
          <p>
            By signing up, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
