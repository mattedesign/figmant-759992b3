
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ModernSignInForm } from './ModernSignInForm';
import { ModernSignUpForm } from './ModernSignUpForm';
import { PasswordResetForm } from './PasswordResetForm';
import { UpdatePasswordForm } from './UpdatePasswordForm';
import { ModernOnboardingFlow } from './ModernOnboardingFlow';
import { DashboardPreview } from './DashboardPreview';
import { Logo } from '@/components/common/Logo';
import { LogOut, ArrowRight } from 'lucide-react';

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
        <div className="w-full max-w-md">
          <div className="text-center space-y-4 mb-8">
            <div className="flex items-center justify-center gap-3">
              <Logo size="md" />
              <div>
                <h1 className="auth-heading">UX Analytics AI</h1>
                <p className="auth-subheading">Update your password</p>
              </div>
            </div>
          </div>
          <UpdatePasswordForm />
        </div>
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

            <Card className="modern-card border-0 shadow-xl">
              <CardContent className="p-8 text-center space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Ready to continue?</h2>
                  <p className="text-sm text-muted-foreground">
                    You're signed in and ready to analyze your designs with AI-powered insights.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleGoToDashboard} 
                    className="w-full modern-button h-12 flex items-center justify-center gap-2"
                  >
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    onClick={handleSignOut} 
                    variant="outline" 
                    className="w-full h-12 flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right side - Dashboard preview */}
        <div className="hidden lg:block lg:w-1/2 p-8 bg-muted/30">
          <DashboardPreview />
        </div>
      </div>
    );
  }

  const handleSuccessfulSignUp = () => {
    setShowOnboarding(true);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Authentication forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Logo size="md" />
              <div>
                <h1 className="auth-heading">UX Analytics AI</h1>
                <p className="auth-subheading">AI-powered design analysis</p>
              </div>
            </div>
          </div>

          <Card className="modern-card border-0 shadow-xl">
            <CardContent className="p-8">
              {showPasswordReset ? (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-semibold">Reset Password</h2>
                    <p className="text-sm text-muted-foreground">
                      Enter your email to receive a reset link
                    </p>
                  </div>
                  <PasswordResetForm onBack={() => setShowPasswordReset(false)} />
                </div>
              ) : (
                <>
                  <div className="text-center space-y-2 mb-8">
                    <h2 className="text-xl font-semibold">Welcome</h2>
                    <p className="text-sm text-muted-foreground">
                      Sign in to your account or create a new one to get started
                    </p>
                  </div>

                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted rounded-xl p-1">
                      <TabsTrigger 
                        value="signin" 
                        className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
                      >
                        Sign In
                      </TabsTrigger>
                      <TabsTrigger 
                        value="signup" 
                        className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
                      >
                        Sign Up
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="signin" className="space-y-6">
                      <ModernSignInForm onForgotPassword={() => setShowPasswordReset(true)} />
                    </TabsContent>

                    <TabsContent value="signup" className="space-y-6">
                      <ModernSignUpForm onSuccess={handleSuccessfulSignUp} />
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </CardContent>
          </Card>

          <div className="text-center text-xs text-muted-foreground">
            <p>
              By continuing, you agree to our{' '}
              <a href="#" className="text-primary hover:underline font-medium">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:underline font-medium">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Dashboard preview */}
      <div className="hidden lg:block lg:w-1/2 p-8 bg-muted/30">
        <DashboardPreview />
      </div>
    </div>
  );
};
