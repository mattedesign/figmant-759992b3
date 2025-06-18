
import React from 'react';
import { StepProps } from './types';
import { Step1SelectAnalysisType } from './steps/Step1SelectAnalysisType';
import { Step2ProjectName } from './steps/Step2ProjectName';
import { Step3AnalysisGoals } from './steps/Step3AnalysisGoals';
import { Step4ProjectDetails } from './steps/Step4ProjectDetails';
import { Step5UploadFiles } from './steps/Step5UploadFiles';
import { Step6CustomPrompt } from './steps/Step6CustomPrompt';
import { Step7Processing } from './steps/Step7Processing';

export const StepRenderer: React.FC<StepProps> = (props) => {
  const { currentStep } = props;

  return (
    <div className="h-full flex flex-col">
      {(() => {
        switch (currentStep) {
          case 1:
            return <Step1SelectAnalysisType {...props} />;
          case 2:
            return <Step2ProjectName {...props} />;
          case 3:
            return <Step3AnalysisGoals {...props} />;
          case 4:
            return <Step4ProjectDetails {...props} />;
          case 5:
            return <Step5UploadFiles {...props} />;
          case 6:
            return <Step6CustomPrompt {...props} />;
          case 7:
            return <Step7Processing {...props} />;
          default:
            return (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Step {currentStep}</h2>
                <p className="text-gray-600">More content coming soon...</p>
              </div>
            );
        }
      })()}
    </div>
  );
};
