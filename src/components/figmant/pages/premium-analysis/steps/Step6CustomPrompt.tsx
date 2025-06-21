
import React from 'react';
import { Plus, FileText } from 'lucide-react';
import { StepProps } from '../types';
import { FormField } from '../components/FormField';
import { ActionButton } from '../components/ActionButton';

export const Step6CustomPrompt: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  const handleCustomPromptChange = (value: string) => {
    setStepData(prev => ({ ...prev, customPrompt: value }));
  };

  const handleAddAnother = () => {
    // TODO: Implement add another prompt functionality
    console.log('Add another prompt clicked');
  };

  const handleUseTemplate = () => {
    // TODO: Implement use template functionality
    console.log('Use template clicked');
  };

  return (
    <div className="w-full min-h-full">
      <div className="w-full">
        <h2 className="text-3xl font-bold text-center mb-8">Custom Prompts</h2>
      </div>

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
          <ActionButton 
            icon={Plus}
            onClick={handleAddAnother}
          >
            Add Another
          </ActionButton>
          <ActionButton 
            icon={FileText}
            onClick={handleUseTemplate}
          >
            Use Template
          </ActionButton>
        </div>
      </div>
    </div>
  );
};
