
import React from 'react';
import { StepProps } from '../types';
import { FormField } from '../components/FormField';

export const Step3AnalysisGoals: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  const handleAnalysisGoalsChange = (value: string) => {
    setStepData(prev => ({ ...prev, analysisGoals: value }));
  };

  return (
    <div className="w-full min-h-full">
      <div className="w-full">
        <h2 className="text-3xl font-bold text-center mb-8">Analysis Goals & Context</h2>
      </div>

      <div className="max-w-2xl mx-auto">
        <FormField
          id="analysisGoals"
          type="textarea"
          label="What specific feedback would you like?"
          placeholder="e.g. Create a user-friendly mobile app to help people track their daily water intake"
          value={stepData.analysisGoals}
          onChange={handleAnalysisGoalsChange}
        />
      </div>
    </div>
  );
};
