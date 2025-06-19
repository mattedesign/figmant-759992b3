
import React from 'react';
import { NewUserOnboarding } from '@/components/onboarding/NewUserOnboarding';

interface ModernOnboardingFlowProps {
  onComplete: () => void;
}

export const ModernOnboardingFlow: React.FC<ModernOnboardingFlowProps> = ({ onComplete }) => {
  return <NewUserOnboarding onComplete={onComplete} />;
};
