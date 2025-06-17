
import React from 'react';
import { StepProps } from '../types';
import { StepHeader } from '../components/StepHeader';
import { FormField } from '../components/FormField';

export const Step2ProjectName: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  const handleProjectNameChange = (value: string) => {
    setStepData({ ...stepData, projectName: value });
  };

  return (
    <div className="space-y-6 flex flex-col items-center">
      <StepHeader 
        title="What's the name of your project?"
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <div className="max-w-md mx-auto">
        <FormField
          id="projectName"
          type="input"
          label="Project name"
          placeholder="e.g. Anything you like"
          value={stepData.projectName}
          onChange={handleProjectNameChange}
        />
      </div>
    </div>
  );
};
