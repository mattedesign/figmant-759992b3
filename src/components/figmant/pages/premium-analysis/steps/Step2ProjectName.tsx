
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StepProps } from '../types';

export const Step2ProjectName: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">What's the name of your project?</h2>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          {currentStep} / {totalSteps}
        </Badge>
      </div>

      <div className="max-w-md mx-auto">
        <Label htmlFor="projectName" className="text-base font-medium">
          Project name
        </Label>
        <Input
          id="projectName"
          placeholder="e.g. Anything you like"
          value={stepData.projectName}
          onChange={(e) => setStepData({ ...stepData, projectName: e.target.value })}
          className="mt-2"
        />
      </div>
    </div>
  );
};
