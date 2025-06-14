
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthContainer } from './shared/AuthContainer';
import { SignInView } from './views/SignInView';
import { PasswordResetForm } from './PasswordResetForm';
import { UpdatePasswordForm } from './UpdatePasswordForm';
import { ModernOnboardingFlow } from './ModernOnboardingFlow';
import { DashboardPreview } from './DashboardPreview';

export const SplitScreenAuth = () => {
  const {
    user,
    loading,
    isOwner
  } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const resetMode = searchParams.get('mode') === 'reset';

  // Auto-redirect authenticated users to their dashboard
  useEffect(() => {
    if (user && !loading && !resetMode && !showOnboarding) {
      console.log('Auto-redirecting authenticated user to dashboard...');
      if (isOwner) {
        navigate('/owner/dashboard', { replace: true });
      } else {
        navigate('/user/dashboard', { replace: true });
      }
    }
  }, [user, loading, resetMode, showOnboarding, isOwner, navigate]);

  const handleSuccessfulSignUp = () => {
    setShowOnboarding(true);
  };

  const getAuthTitle = () => {
    if (showPasswordReset) return "Reset Password";
    return activeTab === 'signin' ? "Welcome Back" : "Get Started";
  };

  const getAuthSubtitle = () => {
    if (showPasswordReset) return "Enter your email to receive a reset link";
    return activeTab === 'signin' 
      ? "Sign in to your account to continue" 
      : "Create your account to get started";
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>;
  }

  if (user && resetMode) {
    return <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <AuthContainer title="Update Password" subtitle="Update your password">
          <UpdatePasswordForm />
        </AuthContainer>
      </div>;
  }

  if (showOnboarding) {
    return <ModernOnboardingFlow onComplete={() => setShowOnboarding(false)} />;
  }

  // If user is authenticated and not in reset mode or onboarding, the useEffect will handle redirect
  // This return should only be reached during the brief moment before redirect
  if (user && !resetMode) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>;
  }

  return <div className="min-h-screen flex bg-background">
      {/* Left side - Authentication forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <AuthContainer title={getAuthTitle()} subtitle={getAuthSubtitle()}>
          {showPasswordReset ? <div className="space-y-6">
              <PasswordResetForm onBack={() => setShowPasswordReset(false)} />
            </div> : <SignInView activeTab={activeTab} onTabChange={setActiveTab} onForgotPassword={() => setShowPasswordReset(true)} onSignUpSuccess={handleSuccessfulSignUp} />}
        </AuthContainer>

        <div className="text-center text-xs text-muted-foreground mt-8">
          <p>
            By continuing, you agree to our{' '}
            <a href="#" className="text-primary hover:underline font-medium">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="text-primary hover:underline font-medium">Privacy Policy</a>
          </p>
        </div>
      </div>

      {/* Right side - Dashboard preview */}
      <div className="hidden lg:block lg:w-1/2 p-8 bg-muted/30">
        <DashboardPreview />
      </div>
    </div>;
};
