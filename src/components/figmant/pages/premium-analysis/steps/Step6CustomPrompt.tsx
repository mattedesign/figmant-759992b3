
import React from 'react';
import { Plus, FileText } from 'lucide-react';
import { StepProps } from '../types';
import { StepHeader } from '../components/StepHeader';
import { FormField } from '../components/FormField';
import { ActionButton } from '../components/ActionButton';

export const Step6CustomPrompt: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  const handleCustomPromptChange = (value: string) => {
    setStepData({ ...stepData, customPrompt: value });
  };

  return (
    <div className="space-y-6">
      <StepHeader 
        title="Prompts us..."
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <div className="max-w-2xl mx-auto space-y-6">
        <FormField
          id="customPrompt"
          type="textarea"
          label="Add Your Custom Prompt"
          placeholder="e.g. Create a user-friendly mobile app to help people track their daily water intake"
          value={stepData.customPrompt}
          onChange={handleCustomPromptChange}
        />

        <div className="flex gap-4">
          <ActionButton icon={Plus}>
            Add Another
          </ActionButton>
          <ActionButton icon={FileText}>
            Use Template
          </ActionButton>
        </div>
      </div>
    </div>
  );
};
