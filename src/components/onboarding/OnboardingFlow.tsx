
import React from 'react';
import { NewUserOnboarding } from './NewUserOnboarding';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  return <NewUserOnboarding onComplete={onComplete} />;
};
