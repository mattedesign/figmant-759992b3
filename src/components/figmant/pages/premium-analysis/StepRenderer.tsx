
import React from 'react';
import { Step1SelectAnalysisType } from './steps/Step1SelectAnalysisType';
import { Step5UploadFiles } from './steps/Step5UploadFiles';
import { Step6CustomPrompt } from './steps/Step6CustomPrompt';
import { Step4AnalysisResults } from './steps/Step4AnalysisResults';
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
        return <Step5UploadFiles {...props} />; // File Upload
      case 3:
        return <Step6CustomPrompt {...props} />; // Contextual Fields
      case 4:
        return <Step4AnalysisResults {...props} />; // Analysis Results
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
