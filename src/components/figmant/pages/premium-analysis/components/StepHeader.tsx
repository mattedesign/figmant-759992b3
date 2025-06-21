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
  return <div className="flex items-center justify-between mb-8">
      <h2 className="text-3xl font-bold text-center">{title}</h2>
      <Badge variant="outline" className="text-blue-600 border-blue-200">
        {currentStep} / {totalSteps}
      </Badge>
    </div>;
};