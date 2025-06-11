
import React from 'react';
import { WizardData } from '../types';
import { EnhancedUseCaseSelector } from '../../uploader/EnhancedUseCaseSelector';

interface Step1AnalysisTypeProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

export const Step1AnalysisType: React.FC<Step1AnalysisTypeProps> = ({
  data,
  onUpdate
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Choose Your Analysis Type</h2>
        <p className="text-muted-foreground">
          Select the type of analysis you want to perform on your designs
        </p>
      </div>

      <EnhancedUseCaseSelector
        selectedUseCase={data.selectedUseCase}
        setSelectedUseCase={(useCase) => onUpdate({ selectedUseCase: useCase })}
        promptVariables={data.promptVariables}
        setPromptVariables={(variables) => onUpdate({ promptVariables: variables })}
        customInstructions={data.customInstructions}
        setCustomInstructions={(instructions) => onUpdate({ customInstructions: instructions })}
      />
    </div>
  );
};
