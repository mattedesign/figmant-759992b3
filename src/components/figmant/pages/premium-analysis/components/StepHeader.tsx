
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StepHeaderProps {
  title: string;
  currentStep: number;
  totalSteps: number;
}

export const StepHeader: React.FC<StepHeaderProps> = ({ 
  title, 
  currentStep, 
  totalSteps 
}) => {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <Badge variant="outline" className="text-blue-600 border-blue-200">
        {currentStep} / {totalSteps}
      </Badge>
    </div>
  );
};
