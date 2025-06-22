
import React from 'react';
import { Step1SelectAnalysisType } from './steps/Step1SelectAnalysisType';
import { Step2SmartUpload } from './steps/Step2SmartUpload';
import { Step3ContextualFields } from './steps/Step3ContextualFields';
import { Step4ProjectDetails } from './steps/Step4ProjectDetails';
import { Step5UploadFiles } from './steps/Step5UploadFiles';
import { Step6CustomPrompt } from './steps/Step6CustomPrompt';
import { Step7Processing } from './steps/Step7Processing';
import { StepProps } from './types';

interface StepRendererProps extends StepProps {
  onCreditCostChange?: (creditCost: number) => void;
}

export const StepRenderer: React.FC<StepRendererProps> = (props) => {
  const { currentStep } = props;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1SelectAnalysisType {...props} />;
      case 2:
        return <Step2SmartUpload {...props} />;
      case 3:
        return <Step3ContextualFields {...props} />;
      case 4:
        return <Step7Processing {...props} />;
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
