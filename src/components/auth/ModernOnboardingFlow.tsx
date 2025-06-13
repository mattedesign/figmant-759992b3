
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useUserOnboarding } from '@/hooks/useUserOnboarding';
import { Logo } from '@/components/common/Logo';
import { 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  BarChart3,
  Zap,
  Users,
  Target
} from 'lucide-react';

interface ModernOnboardingFlowProps {
  onComplete: () => void;
}

export const ModernOnboardingFlow: React.FC<ModernOnboardingFlowProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const { credits } = useUserCredits();
  const { markWelcomePromptSeen, markFirstLoginCompleted } = useUserOnboarding();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to UX Analytics AI',
      subtitle: 'Your AI-powered design analysis platform',
      icon: Sparkles,
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h2 className="auth-heading">Welcome aboard!</h2>
            <p className="auth-subheading max-w-md mx-auto">
              Transform your design process with AI-powered insights that help you create better user experiences.
            </p>
          </div>

          <div className="modern-card p-4 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-medium text-sm">Free Credits Added</div>
                <div className="text-xs text-muted-foreground">
                  {credits?.current_balance || 5} credits ready to use
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'features',
      title: 'Powerful Features',
      subtitle: 'Everything you need for design analysis',
      icon: Zap,
      content: (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
              <Zap className="h-10 w-10 text-primary" />
            </div>
            <h2 className="auth-heading">Powerful Analysis Tools</h2>
            <p className="auth-subheading max-w-md mx-auto">
              Discover what makes UX Analytics AI the perfect choice for your design workflow
            </p>
          </div>

          <div className="grid gap-4">
            <div className="flex items-start gap-4 p-4 modern-card">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-sm">AI-Powered Analysis</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Get instant insights on usability, accessibility, and design patterns
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 modern-card">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-sm">Actionable Recommendations</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Receive specific suggestions to improve your design's user experience
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 modern-card">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-sm">Team Collaboration</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Share insights and collaborate with your design team seamlessly
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ready',
      title: 'Ready to Start',
      subtitle: 'Your setup is complete',
      icon: CheckCircle,
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <h2 className="auth-heading">You're all set!</h2>
            <p className="auth-subheading max-w-md mx-auto">
              Your account is ready and you have free credits to start analyzing your designs right away.
            </p>
          </div>

          <div className="modern-card p-4 space-y-3">
            <div className="font-medium text-sm">Quick Start Guide:</div>
            <div className="space-y-2 text-xs text-muted-foreground text-left">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Upload your design files or provide URLs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Each analysis costs 1 credit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Upgrade anytime for unlimited access</span>
              </div>
            </div>
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

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Onboarding content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <div>
                <div className="font-semibold text-lg">UX Analytics AI</div>
                <div className="text-xs text-muted-foreground">Setup Guide</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Progress value={progress} className="w-full h-1.5" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Step {currentStep + 1} of {steps.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <Card className="modern-card border-0 shadow-lg">
            <CardContent className="p-8">
              {currentStepData.content}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              onClick={handleComplete}
              disabled={isCompleting}
              className="text-sm"
            >
              Skip setup
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={isCompleting}
              className="modern-button flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? (
                isCompleting ? 'Finishing...' : 'Get started'
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Right side - Preview */}
      <div className="hidden lg:block lg:w-1/2 p-8 bg-muted/30">
        <div className="h-full rounded-2xl bg-gradient-to-br from-background to-muted overflow-hidden border border-border">
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg"></div>
              <div>
                <div className="font-semibold">Dashboard Preview</div>
                <div className="text-xs text-muted-foreground">What you'll see next</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-background rounded-xl border flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="h-20 bg-background rounded-xl border flex items-center justify-center">
                <Target className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            
            <div className="h-32 bg-background rounded-xl border flex items-center justify-center">
              <div className="text-center">
                <Zap className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <div className="text-sm text-muted-foreground">Analysis Tools</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
