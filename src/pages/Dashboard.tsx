
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
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { credits } = useUserCredits();
  const { profile } = useAuth();
  const { onboardingState, loading, markWelcomePromptSeen, markCreditDepletionPromptSeen } = useUserOnboarding();
  const [showWelcomePrompt, setShowWelcomePrompt] = useState(false);
  const [showCreditDepletionPrompt, setShowCreditDepletionPrompt] = useState(false);

  // Get current date and time
  const now = new Date();
  const currentDate = format(now, 'EEEE, MMMM d');
  const currentHour = now.getHours();

  // Determine greeting based on time of day (Title Case)
  const getGreeting = () => {
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get user's first name from profile with improved logic and debugging
  const getFirstName = () => {
    console.log('Dashboard - Profile data:', profile);
    console.log('Dashboard - Profile full_name:', profile?.full_name);
    console.log('Dashboard - Profile email:', profile?.email);

    // Return early if no profile data is loaded yet
    if (!profile) {
      console.log('Dashboard - No profile data yet, showing loading state');
      return null; // This will trigger loading state
    }

    if (profile.full_name && profile.full_name.trim()) {
      const firstName = profile.full_name.split(' ')[0].trim();
      console.log('Dashboard - Extracted firstName from full_name:', firstName);
      return firstName || 'there';
    }
    // If no full_name, try to extract from email
    if (profile.email) {
      const emailName = profile.email.split('@')[0];
      console.log('Dashboard - Extracted emailName:', emailName);
      // Capitalize first letter and return if it looks like a name
      if (emailName && emailName.length > 0) {
        const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
        console.log('Dashboard - Capitalized email name:', capitalizedName);
        return capitalizedName;
      }
    }
    console.log('Dashboard - Falling back to "there"');
    return 'there';
  };

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

  const firstName = getFirstName();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Standardized header */}
        <div className="flex-none px-8 py-6 pb-4" style={{ backgroundColor: 'transparent' }}>
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-1">{currentDate}</div>
            <div className="flex items-center gap-4">
              <div>
                {firstName === null ? (
                  // Loading state while profile is being fetched
                  <h1 className="text-2xl text-gray-900">
                    <span style={{ fontWeight: 'normal', color: '#455468' }}>{getGreeting()} </span>
                    <span className="font-semibold">...</span>
                  </h1>
                ) : (
                  <h1 className="text-2xl text-gray-900">
                    <span style={{ fontWeight: 'normal', color: '#455468' }}>{getGreeting()} </span>
                    <span className="font-semibold">{firstName}</span>
                  </h1>
                )}
              </div>
              
              {/* GIF Animation */}
              <div className="flex-shrink-0">
                <img 
                  src="https://okvsvrcphudxxrdonfvp.supabase.co/storage/v1/object/public/design-uploads/assets/content/image/2025-06-17/n6qsz40gw_06-sun-energy.gif"
                  alt="Morning energy"
                  className="h-8 w-8 object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-8">
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
        </div>
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
