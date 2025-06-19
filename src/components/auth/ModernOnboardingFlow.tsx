
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthButton } from '@/components/auth/shared/AuthButton';
import { useAuth } from '@/contexts/AuthContext';
import { useUserOnboarding } from '@/hooks/useUserOnboarding';
import { Logo } from '@/components/common/Logo';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  BarChart3,
  Zap,
  Users,
  Target,
  Upload,
  Gift
} from 'lucide-react';

interface ModernOnboardingFlowProps {
  onComplete: () => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

export const ModernOnboardingFlow: React.FC<ModernOnboardingFlowProps> = ({ onComplete }) => {
  const { user, refetchUserData } = useAuth();
  const { markWelcomePromptSeen, markFirstLoginCompleted } = useUserOnboarding();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [isSubmittingName, setIsSubmittingName] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to UX Analytics AI!',
      subtitle: 'Let\'s get you set up for success',
      icon: Gift,
      content: (
        <WelcomeStep />
      )
    },
    {
      id: 'profile',
      title: 'Tell us about yourself',
      subtitle: 'Help us personalize your experience',
      icon: Users,
      content: (
        <ProfileStep 
          firstName={firstName}
          onFirstNameChange={setFirstName}
        />
      )
    },
    {
      id: 'features',
      title: 'What you can accomplish',
      subtitle: 'Discover the power at your fingertips',
      icon: Zap,
      content: (
        <FeaturesStep />
      )
    },
    {
      id: 'ready',
      title: 'You\'re all set!',
      subtitle: 'Ready to start creating amazing experiences',
      icon: CheckCircle,
      content: (
        <ReadyStep firstName={firstName} />
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = async () => {
    if (currentStep === 1 && firstName.trim()) {
      await handleSaveProfile();
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSaveProfile = async () => {
    if (!firstName.trim() || !user?.id) return;
    
    setIsSubmittingName(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: firstName.trim() })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to save your name. Please try again.');
        return;
      }

      await refetchUserData();
      
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save your name. Please try again.');
    } finally {
      setIsSubmittingName(false);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    
    try {
      await markWelcomePromptSeen();
      await markFirstLoginCompleted();
      
      setTimeout(() => {
        onComplete();
      }, 500);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      onComplete();
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const canContinue = currentStep !== 1 || firstName.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <OnboardingHeader 
          progress={progress}
          currentStep={currentStep}
          totalSteps={steps.length}
        />

        <Card className="border-0 shadow-xl bg-white">
          <CardContent className="p-8">
            {currentStepData.content}
          </CardContent>
        </Card>

        <OnboardingNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          canContinue={canContinue}
          isCompleting={isCompleting}
          isSubmittingName={isSubmittingName}
          onNext={handleNext}
          onSkip={handleSkip}
        />
      </div>
    </div>
  );
};

// Sub-components for better organization

const OnboardingHeader: React.FC<{
  progress: number;
  currentStep: number;
  totalSteps: number;
}> = ({ progress, currentStep, totalSteps }) => (
  <div className="text-center mb-8">
    <div className="flex items-center justify-center space-x-3 mb-6">
      <Logo size="md" />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">UX Analytics AI</h1>
        <div className="text-sm text-gray-600">Welcome Setup</div>
      </div>
    </div>
    
    <div className="space-y-2">
      <Progress value={progress} className="w-full h-2" />
      <div className="flex justify-between text-xs text-gray-600">
        <span>Step {currentStep + 1} of {totalSteps}</span>
        <span>{Math.round(progress)}% complete</span>
      </div>
    </div>
  </div>
);

const OnboardingNavigation: React.FC<{
  currentStep: number;
  totalSteps: number;
  canContinue: boolean;
  isCompleting: boolean;
  isSubmittingName: boolean;
  onNext: () => void;
  onSkip: () => void;
}> = ({ currentStep, totalSteps, canContinue, isCompleting, isSubmittingName, onNext, onSkip }) => (
  <div className="flex justify-between items-center mt-6">
    <Button 
      variant="ghost" 
      onClick={onSkip}
      disabled={isCompleting || isSubmittingName}
      className="text-gray-600 hover:text-gray-800"
    >
      Skip setup
    </Button>
    
    <AuthButton 
      onClick={onNext}
      disabled={isCompleting || isSubmittingName || !canContinue}
      loading={isCompleting || isSubmittingName}
      loadingText={isSubmittingName ? "Saving..." : "Finishing..."}
      icon={currentStep !== totalSteps - 1 ? ArrowRight : undefined}
      className="bg-primary text-white hover:bg-primary/90"
    >
      {currentStep === totalSteps - 1 ? 'Get started' : 'Continue'}
    </AuthButton>
  </div>
);

const WelcomeStep: React.FC = () => (
  <div className="text-center space-y-6">
    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
      <Gift className="h-10 w-10 text-primary" />
    </div>
    
    <div className="space-y-2">
      <h2 className="text-2xl font-bold text-gray-900">Welcome aboard!</h2>
      <p className="text-gray-600 max-w-md mx-auto">
        We're excited to help you unlock powerful insights from your designs and create better user experiences.
      </p>
    </div>

    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div className="text-left">
          <div className="font-medium text-sm">5 Free Credits Added</div>
          <div className="text-xs text-gray-600">
            Ready to use for your first design analyses
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ProfileStep: React.FC<{
  firstName: string;
  onFirstNameChange: (value: string) => void;
}> = ({ firstName, onFirstNameChange }) => (
  <div className="space-y-6">
    <div className="text-center space-y-2">
      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
        <Users className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Let's personalize your experience</h2>
      <p className="text-gray-600 max-w-md mx-auto">
        Tell us a bit about yourself so we can customize the platform for you
      </p>
    </div>

    <div className="max-w-sm mx-auto space-y-4">
      <div className="space-y-2">
        <Label htmlFor="firstName" className="text-sm font-medium">
          First Name *
        </Label>
        <Input
          id="firstName"
          type="text"
          placeholder="Enter your first name"
          value={firstName}
          onChange={(e) => onFirstNameChange(e.target.value)}
          className="w-full"
          required
        />
      </div>
      
      <div className="text-xs text-gray-500">
        We'll use this to personalize your dashboard and communications
      </div>
    </div>
  </div>
);

const FeaturesStep: React.FC = () => (
  <div className="space-y-6">
    <div className="text-center space-y-2">
      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
        <Zap className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Powerful Analysis Tools</h2>
      <p className="text-gray-600 max-w-md mx-auto">
        Here's what makes UX Analytics AI the perfect choice for your design workflow
      </p>
    </div>

    <div className="grid gap-4 max-w-lg mx-auto">
      <FeatureCard
        icon={Upload}
        title="Upload & Analyze"
        description="Upload design files or provide URLs for instant AI-powered analysis"
        iconColor="blue"
      />
      <FeatureCard
        icon={BarChart3}
        title="Detailed Insights"
        description="Get comprehensive UX recommendations and improvement suggestions"
        iconColor="green"
      />
      <FeatureCard
        icon={Target}
        title="Actionable Recommendations"
        description="Receive specific suggestions to improve your design's user experience"
        iconColor="purple"
      />
    </div>
  </div>
);

const FeatureCard: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  iconColor: 'blue' | 'green' | 'purple';
}> = ({ icon: Icon, title, description, iconColor }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-white">
      <div className={`w-10 h-10 ${colorClasses[iconColor]} rounded-lg flex items-center justify-center flex-shrink-0`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="font-medium text-sm text-gray-900">{title}</div>
        <div className="text-xs text-gray-600 mt-1">{description}</div>
      </div>
    </div>
  );
};

const ReadyStep: React.FC<{ firstName: string }> = ({ firstName }) => (
  <div className="text-center space-y-6">
    <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
      <CheckCircle className="h-10 w-10 text-green-600" />
    </div>
    
    <div className="space-y-2">
      <h2 className="text-2xl font-bold text-gray-900">
        {firstName ? `You're all set, ${firstName}!` : 'You\'re all set!'}
      </h2>
      <p className="text-gray-600 max-w-md mx-auto">
        Your account is ready and you have free credits to start analyzing your designs right away.
      </p>
    </div>

    <div className="bg-gray-50 rounded-xl p-4 max-w-md mx-auto">
      <div className="font-medium text-sm text-gray-900 mb-3">Quick Start Guide:</div>
      <div className="space-y-2 text-xs text-gray-600 text-left">
        <QuickStartItem text="Go to Analysis page to upload your first design" />
        <QuickStartItem text="Each analysis costs 1 credit" />
        <QuickStartItem text="Upgrade anytime for unlimited access" />
      </div>
    </div>
  </div>
);

const QuickStartItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center gap-2">
    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
    <span>{text}</span>
  </div>
);
