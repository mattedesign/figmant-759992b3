
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
    // Check if setStepData is the key-value version or full object version
    if (typeof setStepData === 'function') {
      const funcStr = setStepData.toString();
      if (funcStr.includes('key') || setStepData.length === 2) {
        (setStepData as (key: string, value: any) => void)('projectName', value);
      } else {
        (setStepData as (newData: StepData) => void)({ ...stepData, projectName: value });
      }
    }
  };

  return (
    <div className="space-y-6 flex flex-col items-center">
      <StepHeader 
        title="Name that analysis."
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <div className="w-full max-w-md mx-auto">
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
