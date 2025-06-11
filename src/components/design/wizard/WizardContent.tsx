
import React from 'react';
import { WizardData } from './types';
import { Step1AnalysisType } from './steps/Step1AnalysisType';
import { Step2UploadFiles } from './steps/Step2UploadFiles';
import { Step3ContextFiles } from './steps/Step3ContextFiles';
import { Step4GoalsInstructions } from './steps/Step4GoalsInstructions';
import { Step5ConfigureAnalysis } from './steps/Step5ConfigureAnalysis';
import { Step6ReviewConfirm } from './steps/Step6ReviewConfirm';
import { Step7StartAnalysis } from './steps/Step7StartAnalysis';

interface WizardContentProps {
  currentStep: number;
  data: WizardData;
  onUpdateData: (updates: Partial<WizardData>) => void;
}

export const WizardContent: React.FC<WizardContentProps> = ({
  currentStep,
  data,
  onUpdateData
}) => {
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1AnalysisType data={data} onUpdate={onUpdateData} />;
      case 2:
        return <Step2UploadFiles data={data} onUpdate={onUpdateData} />;
      case 3:
        return <Step3ContextFiles data={data} onUpdate={onUpdateData} />;
      case 4:
        return <Step4GoalsInstructions data={data} onUpdate={onUpdateData} />;
      case 5:
        return <Step5ConfigureAnalysis data={data} onUpdate={onUpdateData} />;
      case 6:
        return <Step6ReviewConfirm data={data} onUpdate={onUpdateData} />;
      case 7:
        return <Step7StartAnalysis data={data} onUpdate={onUpdateData} />;
      default:
        return <Step1AnalysisType data={data} onUpdate={onUpdateData} />;
    }
  };

  return (
    <div className="min-h-[400px]">
      {renderStep()}
    </div>
  );
};
