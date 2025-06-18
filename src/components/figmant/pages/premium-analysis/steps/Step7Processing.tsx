
import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { StepProps } from '../types';
import { StepHeader } from '../components/StepHeader';
import { ProcessingState } from '../components/ProcessingState';
import { CompleteState } from '../components/CompleteState';
import { ErrorState } from '../components/ErrorState';
import { usePremiumAnalysisSubmission } from '@/hooks/usePremiumAnalysisSubmission';
import { useTemplateSelection } from '../hooks/useTemplateSelection';
import { useDebugLogger } from '../hooks/useDebugLogger';

export const Step7Processing: React.FC<StepProps> = ({ 
  stepData, 
  currentStep, 
  totalSteps 
}) => {
  const [processingStatus, setProcessingStatus] = useState<'processing' | 'complete' | 'error'>('processing');
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [savedAnalysisId, setSavedAnalysisId] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { debugLogs, addDebugLog, addRetryMarker } = useDebugLogger();
  const { selectedTemplate, premiumPrompts } = useTemplateSelection(stepData.selectedType);
  const premiumAnalysis = usePremiumAnalysisSubmission();

  useEffect(() => {
    console.log('🔍 Step7Processing mounted with:', {
      stepData,
      selectedPromptId: stepData.selectedType,
      processingStatus,
      premiumPromptsCount: premiumPrompts?.length || 0
    });

    addDebugLog('Step7Processing component mounted');
    addDebugLog(`Selected prompt ID: ${stepData.selectedType}`);
    addDebugLog(`Premium prompts loaded: ${premiumPrompts?.length || 0}`);
    addDebugLog(`Selected template found: ${!!selectedTemplate}`);

    // Start analysis if template is found and we're in processing state
    if (selectedTemplate && processingStatus === 'processing') {
      addDebugLog('Starting analysis submission...');
      handleAnalysisSubmission();
    } else if (!selectedTemplate && processingStatus === 'processing') {
      // Only show error if we've finished loading premium prompts
      if (premiumPrompts !== undefined) {
        addDebugLog('ERROR: Selected template not found in any source');
        setProcessingStatus('error');
      }
    }
  }, [selectedTemplate, premiumPrompts, processingStatus]);

  // Monitor mutation state changes
  useEffect(() => {
    addDebugLog(`Mutation state changed - isPending: ${premiumAnalysis.isPending}, isError: ${premiumAnalysis.isError}, isSuccess: ${premiumAnalysis.isSuccess}`);
    
    if (premiumAnalysis.isError) {
      addDebugLog(`Mutation error: ${premiumAnalysis.error?.message || 'Unknown error'}`);
    }
    
    if (premiumAnalysis.isSuccess && premiumAnalysis.data) {
      addDebugLog('Mutation completed successfully');
      addDebugLog(`Analysis result length: ${premiumAnalysis.data.analysis?.length || 0}`);
    }
  }, [premiumAnalysis.isPending, premiumAnalysis.isError, premiumAnalysis.isSuccess, premiumAnalysis.data]);

  const handleAnalysisSubmission = async () => {
    if (!selectedTemplate) {
      addDebugLog('ERROR: No selected template available for submission');
      setProcessingStatus('error');
      return;
    }

    addDebugLog('Preparing to submit analysis...');
    addDebugLog(`Step data: ${JSON.stringify({
      projectName: stepData.projectName,
      analysisGoals: stepData.analysisGoals?.substring(0, 100) + '...',
      selectedType: stepData.selectedType,
      uploadedFilesCount: stepData.uploadedFiles?.length || 0
    })}`);

    try {
      addDebugLog('Calling premiumAnalysis.mutateAsync...');
      
      const result = await premiumAnalysis.mutateAsync({
        stepData,
        selectedPrompt: selectedTemplate
      });
      
      addDebugLog('Analysis submission completed successfully');
      addDebugLog(`Result analysis length: ${result.analysis?.length || 0}`);
      addDebugLog(`Saved analysis ID: ${result.savedAnalysisId}`);
      
      setAnalysisResult(result.analysis);
      setSavedAnalysisId(result.savedAnalysisId);
      setProcessingStatus('complete');
      
      addDebugLog('Invalidating queries...');
      // Invalidate relevant queries to update the UI
      queryClient.invalidateQueries({ queryKey: ['user-credits'] });
      queryClient.invalidateQueries({ queryKey: ['credit-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['chat-analysis-history'] });
      addDebugLog('Queries invalidated successfully');
      
    } catch (error) {
      console.error('🔍 Analysis submission failed:', error);
      addDebugLog(`ERROR: Analysis submission failed - ${error.message || 'Unknown error'}`);
      setProcessingStatus('error');
    }
  };

  const handleRetry = () => {
    addDebugLog('Retrying analysis submission...');
    setProcessingStatus('processing');
    setAnalysisResult('');
    setSavedAnalysisId(null);
    addRetryMarker();
    
    // Re-run the template finding logic and submission
    if (selectedTemplate) {
      handleAnalysisSubmission();
    } else {
      addDebugLog('ERROR: Still no selected template found for retry');
      setProcessingStatus('error');
    }
  };

  const handleViewInAnalysis = () => {
    addDebugLog('Navigating to analysis page...');
    navigate('/figmant', { state: { activeSection: 'analysis' } });
  };

  const handleBackToAnalysis = () => {
    addDebugLog('Navigating back to analysis page...');
    navigate('/figmant', { state: { activeSection: 'analysis' } });
  };

  const getTitle = () => {
    switch (processingStatus) {
      case 'processing':
        return "Processing Your Premium Analysis...";
      case 'complete':
        return "Analysis Complete!";
      case 'error':
        return "Analysis Error";
      default:
        return "Processing...";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0">
        <StepHeader 
          title={getTitle()}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full flex flex-col p-4">
          {processingStatus === 'processing' && (
            <ProcessingState
              selectedTemplateTitle={selectedTemplate?.title}
              debugLogs={debugLogs}
            />
          )}

          {processingStatus === 'complete' && (
            <CompleteState
              selectedTemplateTitle={selectedTemplate?.title}
              analysisResult={analysisResult}
              onViewInAnalysis={handleViewInAnalysis}
              onBackToAnalysis={handleBackToAnalysis}
            />
          )}

          {processingStatus === 'error' && (
            <ErrorState
              errorMessage={premiumAnalysis.error?.message}
              selectedType={stepData.selectedType}
              hasSelectedTemplate={!!selectedTemplate}
              debugLogs={debugLogs}
              onRetry={handleRetry}
              onBackToAnalysis={handleBackToAnalysis}
            />
          )}
        </div>
      </div>
    </div>
  );
};
