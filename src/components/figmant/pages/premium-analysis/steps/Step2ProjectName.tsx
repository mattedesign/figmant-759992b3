
import React from 'react';
import { StepProps } from '../types';
import { FormField } from '../components/FormField';

export const Step2ProjectName: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  const handleProjectNameChange = (value: string) => {
    setStepData(prev => ({ ...prev, projectName: value }));
  };

  return (
    <div className="w-full min-h-full">
      <div className="w-full">
        <h2 className="text-3xl font-bold text-center mb-8">Name Your Analysis</h2>
      </div>

      <div className="max-w-md mx-auto">
        <FormField
          id="projectName"
          type="input"
          label="Project name"
          placeholder="e.g. Anything you like"
          value={stepData.projectName}
          onChange={handleProjectNameChange}
          className="w-full"
        />
      </div>
    </div>
  );
};
