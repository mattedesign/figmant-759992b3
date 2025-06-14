
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthContainer } from './shared/AuthContainer';
import { SignInView } from './views/SignInView';
import { WelcomeBackView } from './views/WelcomeBackView';
import { PasswordResetForm } from './PasswordResetForm';
import { UpdatePasswordForm } from './UpdatePasswordForm';
import { ModernOnboardingFlow } from './ModernOnboardingFlow';
import { DashboardPreview } from './DashboardPreview';
import { Logo } from '@/components/common/Logo';

export const SplitScreenAuth = () => {
  const { user, loading, signOut } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');

  const resetMode = searchParams.get('mode') === 'reset';

  const handleSignOut = async () => {
    console.log('Signing out user...');
    try {
      await signOut();
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleSuccessfulSignUp = () => {
    setShowOnboarding(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user && resetMode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <AuthContainer
          title="Update Password"
          subtitle="Update your password"
        >
          <UpdatePasswordForm />
        </AuthContainer>
      </div>
    );
  }

  if (showOnboarding) {
    return <ModernOnboardingFlow onComplete={() => setShowOnboarding(false)} />;
  }

  if (user && !resetMode) {
    return (
      <div className="min-h-screen flex bg-background">
        {/* Left side - Welcome back */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Logo size="md" />
                <div>
                  <h1 className="auth-heading">UX Analytics AI</h1>
                  <p className="auth-subheading">Welcome back!</p>
                </div>
              </div>
            </div>

            <WelcomeBackView
              onGoToDashboard={handleGoToDashboard}
              onSignOut={handleSignOut}
              loading={loading}
            />
          </div>
        </div>

        {/* Right side - Dashboard preview */}
        <div className="hidden lg:block lg:w-1/2 p-8 bg-muted/30">
          <DashboardPreview />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Authentication forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <AuthContainer
          title={showPasswordReset ? "Reset Password" : "Welcome"}
          subtitle={showPasswordReset ? "Enter your email to receive a reset link" : "AI-powered design analysis"}
        >
          {showPasswordReset ? (
            <div className="space-y-6">
              <PasswordResetForm onBack={() => setShowPasswordReset(false)} />
            </div>
          ) : (
            <SignInView
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onForgotPassword={() => setShowPasswordReset(true)}
              onSignUpSuccess={handleSuccessfulSignUp}
            />
          )}
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
    </div>
  );
};
