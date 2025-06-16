
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StepProps } from '../types';

export const Step3AnalysisGoals: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Any specific feedback you would like?</h2>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          {currentStep} / {totalSteps}
        </Badge>
      </div>

      <div className="max-w-2xl mx-auto">
        <Label htmlFor="analysisGoals" className="text-base font-medium">
          Analysis Goals & Context
        </Label>
        <Textarea
          id="analysisGoals"
          placeholder="e.g. Create a user-friendly mobile app to help people track their daily water intake"
          value={stepData.analysisGoals}
          onChange={(e) => setStepData({ ...stepData, analysisGoals: e.target.value })}
          className="mt-2 min-h-[200px]"
        />
      </div>
    </div>
  );
};
