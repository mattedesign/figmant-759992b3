
import React, { useEffect } from 'react';
import { StepProps } from '../types';
import { ProcessingState } from '../components/ProcessingState';
import { CompleteState } from '../components/CompleteState';
import { ErrorState } from '../components/ErrorState';

export const Step7Processing: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  const [processingState, setProcessingState] = React.useState<'processing' | 'complete' | 'error'>('processing');
  const [error, setError] = React.useState<string | null>(null);
  const [debugLogs, setDebugLogs] = React.useState<string[]>([]);

  useEffect(() => {
    // Add initial debug log
    setDebugLogs(['Starting analysis processing...']);
    
    // Simulate processing
    const timer = setTimeout(() => {
      setDebugLogs(prev => [...prev, 'Analysis completed successfully']);
      setProcessingState('complete');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleViewInAnalysis = () => {
    // TODO: Implement navigation to analysis panel
    console.log('View in Analysis panel clicked');
  };

  const handleBackToAnalysis = () => {
    // TODO: Implement navigation back to analysis
    console.log('Back to Analysis clicked');
  };

  const handleRetry = () => {
    setProcessingState('processing');
    setError(null);
    setDebugLogs(['Retrying analysis...']);
    
    // Simulate retry
    const timer = setTimeout(() => {
      setDebugLogs(prev => [...prev, 'Retry completed successfully']);
      setProcessingState('complete');
    }, 3000);

    return () => clearTimeout(timer);
  };

  return (
    <div className="w-full min-h-full">
      <div className="w-full">
        <h2 className="text-3xl font-bold text-center mb-8">
          {processingState === 'processing' && 'Processing Analysis'}
          {processingState === 'complete' && 'Analysis Complete'}
          {processingState === 'error' && 'Analysis Failed'}
        </h2>
      </div>

      <div className="max-w-2xl mx-auto">
        {processingState === 'processing' && (
          <ProcessingState 
            selectedTemplateTitle="Selected Analysis"
            debugLogs={debugLogs}
          />
        )}
        {processingState === 'complete' && (
          <CompleteState 
            selectedTemplateTitle="Selected Analysis"
            analysisResult="Analysis has been completed successfully. Here are the comprehensive results..."
            onViewInAnalysis={handleViewInAnalysis}
            onBackToAnalysis={handleBackToAnalysis}
          />
        )}
        {processingState === 'error' && (
          <ErrorState 
            errorMessage={error || 'An unknown error occurred'}
            selectedType={stepData.selectedType}
            hasSelectedTemplate={!!stepData.selectedType}
            debugLogs={debugLogs}
            onRetry={handleRetry}
            onBackToAnalysis={handleBackToAnalysis}
          />
        )}
      </div>
    </div>
  );
};
