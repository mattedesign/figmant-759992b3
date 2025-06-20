
import React from 'react';
import { Step1SelectAnalysisType } from './steps/Step1SelectAnalysisType';
import { Step3AnalysisGoals } from './steps/Step3AnalysisGoals';
import { Step4ProjectDetails } from './steps/Step4ProjectDetails';
import { Step5UploadFiles } from './steps/Step5UploadFiles';
import { Step6CustomPrompt } from './steps/Step6CustomPrompt';
import { Step7Processing } from './steps/Step7Processing';
import { StepHeader } from './components/StepHeader';
import { StepProps } from './types';

export const StepRenderer: React.FC<StepProps> = (props) => {
  const { currentStep, totalSteps } = props;

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Select Analysis Type';
      case 2: return 'Analysis Goals';
      case 3: return 'Project Details';
      case 4: return 'Upload Files';
      case 5: return 'Custom Prompt';
      case 6: return 'Processing Analysis';
      default: return 'Premium Analysis';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1SelectAnalysisType {...props} />;
      case 2:
        return <Step3AnalysisGoals {...props} />;
      case 3:
        return <Step4ProjectDetails {...props} />;
      case 4:
        return <Step5UploadFiles {...props} />;
      case 5:
        return <Step6CustomPrompt {...props} />;
      case 6:
        return <Step7Processing {...props} />;
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="space-y-8">
      <StepHeader
        title={getStepTitle()}
        currentStep={currentStep}
        totalSteps={totalSteps}
      />
      {renderStepContent()}
    </div>
  );
};
