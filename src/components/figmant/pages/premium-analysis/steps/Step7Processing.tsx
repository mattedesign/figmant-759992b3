
import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StepProps } from '../types';
import { StepHeader } from '../components/StepHeader';
import { usePremiumAnalysisSubmission } from '@/hooks/usePremiumAnalysisSubmission';
import { useClaudePromptExamplesByCategory } from '@/hooks/useClaudePromptExamplesByCategory';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

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
      setSavedAnalysisId(result.savedAnalysisId);
      setProcessingStatus('complete');
      
      // Invalidate relevant queries to update the UI
      queryClient.invalidateQueries({ queryKey: ['user-credits'] });
      queryClient.invalidateQueries({ queryKey: ['credit-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['chat-analysis-history'] });
    } catch (error) {
      console.error('Analysis submission failed:', error);
      setProcessingStatus('error');
    }
  };

  const handleRetry = () => {
    setProcessingStatus('processing');
    setAnalysisResult('');
    setSavedAnalysisId(null);
    handleAnalysisSubmission();
  };

  const handleViewInAnalysis = () => {
    // Navigate to the analysis page in the figmant interface
    navigate('/figmant', { state: { activeSection: 'analysis' } });
  };

  const handleBackToAnalysis = () => {
    navigate('/figmant', { state: { activeSection: 'analysis' } });
  };

  return (
    <div className="space-y-6 h-full">
      <StepHeader 
        title={processingStatus === 'processing' ? "Processing Your Premium Analysis..." : 
               processingStatus === 'complete' ? "Analysis Complete!" : "Analysis Error"}
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <div className="max-w-4xl mx-auto h-full flex flex-col">
        {processingStatus === 'processing' && (
          <div className="text-center space-y-4 flex-1 flex flex-col justify-center">
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
          <div className="space-y-6 flex-1 flex flex-col">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-green-600">Premium Analysis Complete!</h3>
                <p className="text-gray-600">
                  Your comprehensive {selectedPrompt?.title} analysis is ready
                </p>
              </div>
            </div>
            
            {/* Scrollable Analysis Results */}
            <div className="bg-gray-50 border rounded-lg flex-1 flex flex-col min-h-0">
              <div className="p-4 border-b bg-white rounded-t-lg">
                <h4 className="font-medium">Analysis Results:</h4>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {analysisResult}
                </div>
              </ScrollArea>
            </div>

            <div className="flex gap-4 justify-center pt-4">
              <Button onClick={handleViewInAnalysis} className="bg-blue-600 hover:bg-blue-700">
                View in Analysis Panel
              </Button>
              <Button variant="outline" onClick={handleBackToAnalysis}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Analysis
              </Button>
            </div>
          </div>
        )}

        {processingStatus === 'error' && (
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            <div className="text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-red-600">Analysis Failed</h3>
                <p className="text-gray-600">
                  There was an error processing your premium analysis
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button onClick={handleRetry} className="bg-blue-600 hover:bg-blue-700">
                Retry Analysis
              </Button>
              <Button variant="outline" onClick={handleBackToAnalysis}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Analysis
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
