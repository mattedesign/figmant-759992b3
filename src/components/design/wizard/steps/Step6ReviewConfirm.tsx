
import React from 'react';
import { WizardData } from '../types';
import { UploadSummary } from '../../uploader/UploadSummary';

interface Step6ReviewConfirmProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

export const Step6ReviewConfirm: React.FC<Step6ReviewConfirmProps> = ({
  data,
  onUpdate
}) => {
  const validUrls = data.urls.filter(url => url.trim() !== '');
  const hasValidContent = data.selectedFiles.length > 0 || validUrls.length > 0;

  const buildEnhancedAnalysisGoals = () => {
    let enhancedGoals = data.analysisGoals;
    
    if (data.customInstructions) {
      enhancedGoals += `\n\nAdditional Instructions: ${data.customInstructions}`;
    }

    // Add prompt variables context
    const variableContext = [];
    if (data.promptVariables.designType) variableContext.push(`Design Type: ${data.promptVariables.designType}`);
    if (data.promptVariables.industry) variableContext.push(`Industry: ${data.promptVariables.industry}`);
    if (data.promptVariables.targetAudience) variableContext.push(`Target Audience: ${data.promptVariables.targetAudience}`);
    if (data.promptVariables.businessGoals) variableContext.push(`Business Goals: ${data.promptVariables.businessGoals}`);
    if (data.promptVariables.conversionGoals) variableContext.push(`Conversion Goals: ${data.promptVariables.conversionGoals}`);
    if (data.promptVariables.testHypothesis) variableContext.push(`Test Hypothesis: ${data.promptVariables.testHypothesis}`);
    
    if (data.promptVariables.competitorUrls && data.promptVariables.competitorUrls.length > 0) {
      variableContext.push(`Competitors: ${data.promptVariables.competitorUrls.join(', ')}`);
    }

    if (variableContext.length > 0) {
      enhancedGoals += `\n\nContext Variables:\n${variableContext.join('\n')}`;
    }

    return enhancedGoals.trim() || '';
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Review & Confirm</h2>
        <p className="text-muted-foreground">
          Review your upload settings before starting the analysis
        </p>
      </div>

      <UploadSummary
        selectedFiles={data.selectedFiles}
        validUrls={validUrls}
        contextFiles={data.contextFiles}
        analysisGoals={buildEnhancedAnalysisGoals()}
        analysisPreferences={data.analysisPreferences}
        hasValidContent={hasValidContent}
      />
    </div>
  );
};
