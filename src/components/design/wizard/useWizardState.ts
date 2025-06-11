
import { useState, useCallback } from 'react';
import { WizardData, createInitialWizardData } from './types';
import { useBatchUploadDesign } from '@/hooks/useBatchUploadDesign';

export const useWizardState = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>(createInitialWizardData);
  const [isComplete, setIsComplete] = useState(false);
  
  const batchUpload = useBatchUploadDesign();

  const updateData = useCallback((updates: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetWizard = useCallback(() => {
    setCurrentStep(1);
    setWizardData(createInitialWizardData());
    setIsComplete(false);
  }, []);

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1: // Analysis Type
        return wizardData.selectedUseCase !== '';
      case 2: // Upload Files
        const validUrls = wizardData.urls.filter(url => url.trim() !== '');
        return wizardData.selectedFiles.length > 0 || validUrls.length > 0;
      case 3: // Context Files (optional)
        return true;
      case 4: // Goals & Instructions
        return wizardData.batchName.trim() !== '' || wizardData.analysisGoals.trim() !== '';
      case 5: // Configure Analysis
        return true;
      case 6: // Review
        return true;
      case 7: // Start Analysis
        return !wizardData.isSubmitting;
      default:
        return false;
    }
  }, [currentStep, wizardData]);

  const nextStep = useCallback(() => {
    if (canProceed() && currentStep < 7) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, canProceed]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const buildEnhancedAnalysisGoals = useCallback(() => {
    let enhancedGoals = wizardData.analysisGoals;
    
    if (wizardData.customInstructions) {
      enhancedGoals += `\n\nAdditional Instructions: ${wizardData.customInstructions}`;
    }

    // Add prompt variables context
    const variableContext = [];
    if (wizardData.promptVariables.designType) variableContext.push(`Design Type: ${wizardData.promptVariables.designType}`);
    if (wizardData.promptVariables.industry) variableContext.push(`Industry: ${wizardData.promptVariables.industry}`);
    if (wizardData.promptVariables.targetAudience) variableContext.push(`Target Audience: ${wizardData.promptVariables.targetAudience}`);
    if (wizardData.promptVariables.businessGoals) variableContext.push(`Business Goals: ${wizardData.promptVariables.businessGoals}`);
    if (wizardData.promptVariables.conversionGoals) variableContext.push(`Conversion Goals: ${wizardData.promptVariables.conversionGoals}`);
    if (wizardData.promptVariables.testHypothesis) variableContext.push(`Test Hypothesis: ${wizardData.promptVariables.testHypothesis}`);
    
    if (wizardData.promptVariables.competitorUrls && wizardData.promptVariables.competitorUrls.length > 0) {
      variableContext.push(`Competitors: ${wizardData.promptVariables.competitorUrls.join(', ')}`);
    }

    if (variableContext.length > 0) {
      enhancedGoals += `\n\nContext Variables:\n${variableContext.join('\n')}`;
    }

    return enhancedGoals.trim() || undefined;
  }, [wizardData]);

  const submitWizard = useCallback(async () => {
    if (!canProceed()) return;

    updateData({ isSubmitting: true, submitError: null });

    try {
      const validUrls = wizardData.urls.filter(url => url.trim() !== '');
      
      await batchUpload.mutateAsync({
        files: wizardData.selectedFiles,
        urls: validUrls,
        contextFiles: wizardData.contextFiles,
        useCase: wizardData.selectedUseCase,
        batchName: wizardData.batchName || `Wizard Upload - ${new Date().toLocaleDateString()}`,
        analysisGoals: buildEnhancedAnalysisGoals(),
        analysisPreferences: wizardData.analysisPreferences
      });

      setIsComplete(true);
    } catch (error) {
      updateData({ 
        submitError: error instanceof Error ? error.message : 'Upload failed',
        isSubmitting: false 
      });
    }
  }, [wizardData, canProceed, updateData, batchUpload, buildEnhancedAnalysisGoals]);

  return {
    currentStep,
    wizardData,
    canProceed: canProceed(),
    isComplete,
    nextStep,
    prevStep,
    updateData,
    resetWizard,
    submitWizard
  };
};
