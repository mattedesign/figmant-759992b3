
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useUserOnboarding } from '@/hooks/useUserOnboarding';
import { Logo } from '@/components/common/Logo';
import { 
  Gift, 
  Sparkles, 
  Upload, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Target,
  BarChart3,
  Users
} from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const { credits } = useUserCredits();
  const { markWelcomePromptSeen, markFirstLoginCompleted } = useUserOnboarding();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to UX Analytics AI!',
      description: 'Your journey to better design insights starts here.',
      icon: Gift,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome aboard!</h2>
            <p className="text-muted-foreground">
              We're excited to help you unlock powerful insights from your designs.
            </p>
          </div>

          <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Free Credits Bonus!</h3>
                <p className="text-sm text-muted-foreground">
                  You've received {credits?.current_balance || 5} free credits to get started with design analysis.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 'features',
      title: 'What you can do',
      description: 'Discover the powerful features at your fingertips.',
      icon: Zap,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Powerful Analysis Tools</h2>
            <p className="text-muted-foreground">
              Here's what you can accomplish with UX Analytics AI
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg border">
              <Upload className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Upload & Analyze</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your designs or provide URLs for instant AI-powered analysis
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-lg border">
              <BarChart3 className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Detailed Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Get comprehensive UX recommendations and improvement suggestions
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-lg border">
              <Target className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Actionable Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Receive specific, actionable advice to enhance your design's user experience
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ready',
      title: 'You\'re all set!',
      description: 'Ready to start analyzing your designs.',
      icon: CheckCircle,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Ready to get started!</h2>
            <p className="text-muted-foreground">
              You're all set up and ready to start analyzing your designs.
            </p>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Quick Start Tips:</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Use the Design Analysis tab to upload your first design</li>
              <li>• Each analysis costs 1 credit</li>
              <li>• You can upgrade anytime for unlimited access</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    
    try {
      // Mark onboarding as complete
      await markWelcomePromptSeen();
      await markFirstLoginCompleted();
      
      setTimeout(() => {
        onComplete();
      }, 500);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      onComplete(); // Still complete even if there's an error
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Logo size="md" />
            <h1 className="text-2xl font-bold">UX Analytics AI</h1>
          </div>
          <Progress value={progress} className="w-full h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Content */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            {currentStepData.content}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <Button 
            variant="ghost" 
            onClick={handleSkip}
            disabled={isCompleting}
          >
            Skip for now
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={isCompleting}
            className="flex items-center gap-2"
          >
            {currentStep === steps.length - 1 ? (
              isCompleting ? 'Setting up...' : 'Get Started'
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
