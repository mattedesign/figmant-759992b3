
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthContainer } from './AuthContainer';
import { SignInView } from './views/SignInView';
import { PasswordResetForm } from './PasswordResetForm';
import { UpdatePasswordForm } from './UpdatePasswordForm';
import { ModernOnboardingFlow } from './ModernOnboardingFlow';
import { AuthProfileSync } from './AuthProfileSync';

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
        navigate('/owner');
      } else {
        navigate('/figmant');
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <AuthProfileSync />
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      {/* Single centered authentication form */}
      <div className="w-full max-w-md px-4 py-12">
        <AuthContainer 
          title={getAuthTitle()} 
          subtitle={getAuthSubtitle()}
          welcomeText={activeTab === 'signin' ? "Welcome to UX Analytics AI" : undefined}
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

        {/* Terms of Service */}
        <div className="mt-8 text-center text-xs text-gray-500 max-w-md mx-auto">
          <p>
            {activeTab === 'signin' ? 'New to UX Analytics AI?' : 'Already have an account?'}{' '}
            <button
              onClick={() => setActiveTab(activeTab === 'signin' ? 'signup' : 'signin')}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              {activeTab === 'signin' ? 'Create an account' : 'Sign in'}
            </button>
          </p>
          <p className="mt-4">
            By continuing, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};
