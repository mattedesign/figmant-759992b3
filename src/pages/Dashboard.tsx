
import React, { useEffect, useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentAnalyses } from '@/components/dashboard/RecentAnalyses';
import { AnalyticsOverview } from '@/components/dashboard/AnalyticsOverview';
import { Settings } from '@/components/dashboard/Settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditStatus } from '@/components/dashboard/CreditStatus';
import { AdvancedDesignAnalysisPage } from '@/components/design/AdvancedDesignAnalysisPage';
import { WelcomePrompt } from '@/components/onboarding/WelcomePrompt';
import { CreditDepletionPrompt } from '@/components/onboarding/CreditDepletionPrompt';
import { DesignUpload } from '@/types/design';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useUserOnboarding } from '@/hooks/useUserOnboarding';

const Dashboard = () => {
  const { credits } = useUserCredits();
  const { onboardingState, loading, markWelcomePromptSeen, markCreditDepletionPromptSeen } = useUserOnboarding();
  const [showWelcomePrompt, setShowWelcomePrompt] = useState(false);
  const [showCreditDepletionPrompt, setShowCreditDepletionPrompt] = useState(false);

  useEffect(() => {
    if (!loading && onboardingState && credits) {
      // Show welcome prompt if user hasn't seen it and has completed first login
      if (!onboardingState.has_seen_welcome_prompt && onboardingState.first_login_completed) {
        setShowWelcomePrompt(true);
      }
      
      // Show credit depletion prompt if user has low credits and hasn't seen the prompt
      const remainingCredits = credits.current_balance || 0;
      if (remainingCredits <= 1 && !onboardingState.has_seen_credit_depletion_prompt) {
        setShowCreditDepletionPrompt(true);
      }
    }
  }, [onboardingState, credits, loading]);

  const handleViewAnalysis = (upload: DesignUpload) => {
    // Navigate to analysis view or open modal
    console.log('Viewing analysis:', upload.id, upload.file_name);
  };

  const handleWelcomePromptClose = () => {
    setShowWelcomePrompt(false);
    markWelcomePromptSeen();
  };

  const handleCreditDepletionPromptClose = () => {
    setShowCreditDepletionPrompt(false);
    markCreditDepletionPromptSeen();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your UX analytics and design performance
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="design">Design Analysis</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6">
              <div className="grid gap-6 md:grid-cols-2">
                <QuickActions />
                <CreditStatus />
              </div>
              <RecentAnalyses onViewAnalysis={handleViewAnalysis} />
            </div>
          </TabsContent>

          <TabsContent value="design" className="mt-6">
            <AdvancedDesignAnalysisPage />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsOverview />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Settings />
          </TabsContent>
        </Tabs>
      </main>

      {/* Onboarding Prompts */}
      <WelcomePrompt
        isOpen={showWelcomePrompt}
        onClose={handleWelcomePromptClose}
        userCredits={credits?.current_balance || 5}
      />

      <CreditDepletionPrompt
        isOpen={showCreditDepletionPrompt}
        onClose={handleCreditDepletionPromptClose}
        remainingCredits={credits?.current_balance || 0}
      />
    </div>
  );
};

export default Dashboard;
