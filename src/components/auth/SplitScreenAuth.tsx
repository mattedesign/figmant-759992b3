
import React, { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedSignInForm } from './EnhancedSignInForm';
import { EnhancedSignUpForm } from './EnhancedSignUpForm';
import { PasswordResetForm } from './PasswordResetForm';
import { UpdatePasswordForm } from './UpdatePasswordForm';
import { OnboardingFlow } from '../onboarding/OnboardingFlow';
import { Logo } from '@/components/common/Logo';
import { Sparkles, Shield, Zap } from 'lucide-react';

export const SplitScreenAuth = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');

  // Check if we're in password reset mode
  const resetMode = searchParams.get('mode') === 'reset';

  // Redirect if already authenticated and not in reset mode
  if (user && !loading && !resetMode && !showOnboarding) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show password update form if user is authenticated and in reset mode
  if (user && resetMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center space-y-2 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <Logo size="md" />
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

  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />;
  }

  const handleSuccessfulSignUp = () => {
    setShowOnboarding(true);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding and features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 text-white p-12 flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-12">
            <Logo size="lg" />
            <div>
              <h1 className="text-3xl font-bold">UX Analytics AI</h1>
              <p className="text-primary-foreground/80">Intelligent design insights</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
                <p className="text-primary-foreground/80">
                  Get instant insights on your designs with advanced AI analysis that identifies UX patterns and opportunities.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                <p className="text-primary-foreground/80">
                  Your designs are protected with enterprise-grade security and never shared with third parties.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-primary-foreground/80">
                  Get comprehensive design analysis results in seconds, not hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-primary-foreground/60">
          <p>© 2024 UX Analytics AI. All rights reserved.</p>
        </div>
      </div>

      {/* Right side - Authentication forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile logo */}
          <div className="lg:hidden text-center space-y-2 mb-8">
            <div className="flex items-center justify-center space-x-2">
              <Logo size="md" />
              <h1 className="text-2xl font-bold">UX Analytics AI</h1>
            </div>
            <p className="text-muted-foreground">Intelligent design insights</p>
          </div>

          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              {showPasswordReset ? (
                <PasswordResetForm onBack={() => setShowPasswordReset(false)} />
              ) : (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">Welcome</h2>
                    <p className="text-muted-foreground">
                      Sign in to your account or create a new one
                    </p>
                  </div>

                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="signin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        Sign In
                      </TabsTrigger>
                      <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        Sign Up
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="signin" className="space-y-4">
                      <EnhancedSignInForm onForgotPassword={() => setShowPasswordReset(true)} />
                    </TabsContent>

                    <TabsContent value="signup" className="space-y-4">
                      <EnhancedSignUpForm onSuccess={handleSuccessfulSignUp} />
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              By continuing, you agree to our{' '}
              <a href="#" className="text-primary hover:underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
