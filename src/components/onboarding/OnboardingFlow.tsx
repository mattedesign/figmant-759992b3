
import React from 'react';
import { ModernOnboardingFlow } from '@/components/auth/ModernOnboardingFlow';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  return <ModernOnboardingFlow onComplete={onComplete} />;
};
