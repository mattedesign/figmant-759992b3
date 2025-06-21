
import React from 'react';
import { Step1SelectAnalysisType } from './steps/Step1SelectAnalysisType';
import { Step4ProjectDetails } from './steps/Step4ProjectDetails';
import { Step5UploadFiles } from './steps/Step5UploadFiles';
import { Step6CustomPrompt } from './steps/Step6CustomPrompt';
import { Step7Processing } from './steps/Step7Processing';
import { StepProps } from './types';

export const StepRenderer: React.FC<StepProps> = (props) => {
  const { currentStep } = props;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1SelectAnalysisType {...props} />;
      case 2:
        return <Step4ProjectDetails {...props} />;
      case 3:
        return <Step5UploadFiles {...props} />;
      case 4:
        return <Step6CustomPrompt {...props} />;
      case 5:
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
