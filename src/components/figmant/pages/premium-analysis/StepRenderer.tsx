
import React from 'react';
import { Step1SelectAnalysisType } from './steps/Step1SelectAnalysisType';
import { Step2SmartUpload } from './steps/Step2SmartUpload';
import { Step6CustomPrompt } from './steps/Step6CustomPrompt';
import { Step4AnalysisResults } from './steps/Step4AnalysisResults';
import { StepProps, WizardChatAttachment } from './types';

interface StepRendererProps extends StepProps {
  onCreditCostChange?: (creditCost: number) => void;
  onNextStep: () => void;
  onPreviousStep: () => void;
}

export const StepRenderer: React.FC<StepRendererProps> = ({
  stepData,
  setStepData,
  currentStep,
  totalSteps,
  onCreditCostChange,
  onNextStep,
  onPreviousStep
}) => {
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1SelectAnalysisType 
            stepData={stepData}
            setStepData={setStepData}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNextStep={onNextStep}
            onPreviousStep={onPreviousStep}
          />
        );
      case 2:
        return (
          <Step2SmartUpload 
            attachments={stepData.attachments || []}
            onAttachmentAdd={(attachment: WizardChatAttachment) => {
              setStepData(prev => ({
                ...prev,
                attachments: [...(prev.attachments || []), attachment]
              }));
            }}
            onAttachmentRemove={(id: string) => {
              setStepData(prev => ({
                ...prev,
                attachments: (prev.attachments || []).filter(att => att.id !== id)
              }));
            }}
            onAttachmentUpdate={(id: string, updates: Partial<WizardChatAttachment>) => {
              setStepData(prev => ({
                ...prev,
                attachments: (prev.attachments || []).map(att => 
                  att.id === id ? { ...att, ...updates } : att
                )
              }));
            }}
            onPrevious={onPreviousStep}
            onNext={onNextStep}
          />
        );
      case 3:
        return (
          <Step6CustomPrompt 
            stepData={stepData}
            setStepData={setStepData}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNextStep={onNextStep}
            onPreviousStep={onPreviousStep}
          />
        );
      case 4:
        return (
          <Step4AnalysisResults 
            stepData={stepData}
            setStepData={setStepData}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        );
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="space-y-8">
      {renderStepContent()}
    </div>
  );
};
