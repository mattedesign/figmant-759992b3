
import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StepProps } from '../types';
import { StepHeader } from '../components/StepHeader';
import { usePremiumAnalysisSubmission } from '@/hooks/usePremiumAnalysisSubmission';
import { useClaudePromptExamplesByCategory } from '@/hooks/useClaudePromptExamplesByCategory';
import { useQueryClient } from '@tanstack/react-query';

export const Step7Processing: React.FC<StepProps> = ({ 
  stepData, 
  currentStep, 
  totalSteps 
}) => {
  const [processingStatus, setProcessingStatus] = useState<'processing' | 'complete' | 'error'>('processing');
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const queryClient = useQueryClient();
  
  const { data: premiumPrompts } = useClaudePromptExamplesByCategory('premium');
  const premiumAnalysis = usePremiumAnalysisSubmission();

  const selectedPrompt = premiumPrompts?.find(prompt => prompt.id === stepData.selectedType);

  useEffect(() => {
    if (selectedPrompt && processingStatus === 'processing') {
      handleAnalysisSubmission();
    }
  }, [selectedPrompt]);

  const handleAnalysisSubmission = async () => {
    if (!selectedPrompt) {
      setProcessingStatus('error');
      return;
    }

    try {
      const result = await premiumAnalysis.mutateAsync({
        stepData,
        selectedPrompt
      });
      
      setAnalysisResult(result.analysis);
      setProcessingStatus('complete');
      
      // Invalidate credit queries to update the UI
      queryClient.invalidateQueries({ queryKey: ['user-credits'] });
      queryClient.invalidateQueries({ queryKey: ['credit-transactions'] });
    } catch (error) {
      console.error('Analysis submission failed:', error);
      setProcessingStatus('error');
    }
  };

  const handleRetry = () => {
    setProcessingStatus('processing');
    setAnalysisResult('');
    handleAnalysisSubmission();
  };

  const handleViewResults = () => {
    // Navigate to analysis results or trigger parent callback
    window.location.href = '/figmant/analysis';
  };

  return (
    <div className="space-y-6">
      <StepHeader 
        title={processingStatus === 'processing' ? "Processing Your Premium Analysis..." : 
               processingStatus === 'complete' ? "Analysis Complete!" : "Analysis Error"}
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <div className="max-w-2xl mx-auto text-center">
        {processingStatus === 'processing' && (
          <div className="space-y-4">
            <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Analyzing your project...</h3>
              <p className="text-gray-600">
                Using premium {selectedPrompt?.title} analysis framework
              </p>
              <div className="text-sm text-gray-500">
                This may take up to 2 minutes for comprehensive results
              </div>
            </div>
          </div>
        )}

        {processingStatus === 'complete' && (
          <div className="space-y-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-green-600">Premium Analysis Complete!</h3>
              <p className="text-gray-600">
                Your comprehensive {selectedPrompt?.title} analysis is ready
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg text-left">
              <h4 className="font-medium mb-2">Analysis Preview:</h4>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {analysisResult.substring(0, 300)}...
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={handleViewResults} className="bg-blue-600 hover:bg-blue-700">
                View Full Analysis
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/figmant/analysis'}>
                Go to Analysis Page
              </Button>
            </div>
          </div>
        )}

        {processingStatus === 'error' && (
          <div className="space-y-6">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-red-600">Analysis Failed</h3>
              <p className="text-gray-600">
                There was an error processing your premium analysis
              </p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button onClick={handleRetry} className="bg-blue-600 hover:bg-blue-700">
                Retry Analysis
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
