
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StepHeaderProps {
  title: string;
  description?: string;
  currentStep?: number;
  totalSteps?: number;
}

export const StepHeader: React.FC<StepHeaderProps> = ({
  title,
  description,
  currentStep,
  totalSteps
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-center">{title}</h2>
        {currentStep && totalSteps && (
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            {currentStep} / {totalSteps}
          </Badge>
        )}
      </div>
      {description && (
        <p className="text-gray-600 text-center">{description}</p>
      )}
    </div>
  );
};
