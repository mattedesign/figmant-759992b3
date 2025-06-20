
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

  useEffect(() => {
    // Simulate processing
    const timer = setTimeout(() => {
      // For now, just simulate success
      setProcessingState('complete');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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
        {processingState === 'processing' && <ProcessingState />}
        {processingState === 'complete' && <CompleteState />}
        {processingState === 'error' && <ErrorState error={error || 'An unknown error occurred'} />}
      </div>
    </div>
  );
};
