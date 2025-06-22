
import React, { useEffect, useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentAnalyses } from '@/components/dashboard/RecentAnalyses';
import { AnalyticsOverview } from '@/components/dashboard/AnalyticsOverview';
import { SimplifiedProfile } from '@/components/dashboard/settings/SimplifiedProfile';
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

  // Get time-based image
  const getTimeBasedImage = () => {
    const hour = now.getHours();
    const minute = now.getMinutes();
    const timeInMinutes = hour * 60 + minute;

    // 6am to 8am (360 to 480 minutes)
    if (timeInMinutes >= 360 && timeInMinutes <= 480) {
      return {
        src: 'https://okvsvrcphudxxrdonfvp.supabase.co/storage/v1/object/public/design-uploads/assets/content/image/2025-06-17/zr6geoc2i_Sunrise.svg',
        alt: 'Sunrise'
      };
    }
    // 8:01am to 5:00pm (481 to 1200 minutes)
    if (timeInMinutes >= 481 && timeInMinutes <= 1200) {
      return {
        src: 'https://okvsvrcphudxxrdonfvp.supabase.co/storage/v1/object/public/design-uploads/assets/content/image/2025-06-17/km8946rzr_Day.svg',
        alt: 'Day'
      };
    }
    // 5:01pm to 7:30pm (1201 to 1170 minutes)
    if (timeInMinutes >= 1201 && timeInMinutes <= 1170) {
      return {
        src: 'https://okvsvrcphudxxrdonfvp.supabase.co/storage/v1/object/public/design-uploads/assets/content/image/2025-06-17/3yi4dyxol_Sunset.svg',
        alt: 'Sunset'
      };
    }
    // 7:31pm to 8:45pm (1171 to 1245 minutes)
    if (timeInMinutes >= 1171 && timeInMinutes <= 1245) {
      return {
        src: 'https://okvsvrcphudxxrdonfvp.supabase.co/storage/v1/object/public/design-uploads/assets/content/image/2025-06-17/q6hty7yfd_Dusk.svg',
        alt: 'Dusk'
      };
    }
    // 8:46pm to 5:59am (1246+ minutes or 0-359 minutes)
    return {
      src: 'https://okvsvrcphudxxrdonfvp.supabase.co/storage/v1/object/public/design-uploads/assets/content/image/2025-06-17/y31tsaijc_Night.svg',
      alt: 'Night'
    };
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
  const timeBasedImage = getTimeBasedImage();

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
              
              {/* Time-based Image */}
              <div className="flex-shrink-0">
                <img 
                  src={timeBasedImage.src}
                  alt={timeBasedImage.alt}
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
              <SimplifiedProfile />
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
