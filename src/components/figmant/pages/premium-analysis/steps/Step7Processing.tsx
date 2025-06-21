import React, { useEffect, useState } from 'react';
import { StepProps } from '../types';
import { ProcessingState } from '../components/ProcessingState';
import { ErrorState } from '../components/ErrorState';
import { usePremiumAnalysisSubmission } from '@/hooks/usePremiumAnalysisSubmission';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, ExternalLink, ArrowLeft } from 'lucide-react';

export const Step7Processing: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [processingState, setProcessingState] = useState<'processing' | 'complete' | 'error'>('processing');
  const [error, setError] = useState<string | null>(null);
  
  const premiumAnalysis = usePremiumAnalysisSubmission();

  useEffect(() => {
    // Start the actual analysis when component mounts
    if (processingState === 'processing' && stepData.selectedType) {
      console.log('🧙 Starting premium analysis with step data:', stepData);
      
      // Find the selected prompt template based on selectedType
      const selectedPrompt = {
        id: stepData.selectedType,
        title: stepData.selectedType,
        category: 'wizard',
        original_prompt: `Analyze this ${stepData.selectedType} design and provide comprehensive insights.`
      };

      premiumAnalysis.mutate({
        stepData,
        selectedPrompt
      });
    }
  }, [processingState, stepData.selectedType]);

  // Handle analysis completion
  useEffect(() => {
    if (premiumAnalysis.isSuccess && premiumAnalysis.data) {
      console.log('🧙 Premium analysis completed:', premiumAnalysis.data);
      setAnalysisResult(premiumAnalysis.data);
      setProcessingState('complete');
    }
  }, [premiumAnalysis.isSuccess, premiumAnalysis.data]);

  // Handle analysis error
  useEffect(() => {
    if (premiumAnalysis.isError) {
      console.error('🧙 Premium analysis failed:', premiumAnalysis.error);
      setError(premiumAnalysis.error?.message || 'Analysis failed');
      setProcessingState('error');
    }
  }, [premiumAnalysis.isError, premiumAnalysis.error]);

  const handleViewInAnalysis = () => {
    navigate('/figmant');
    
    toast({
      title: "Redirecting to Analysis History",
      description: "You'll find your completed analysis in the History tab of the sidebar.",
    });
  };

  const handleBackToAnalysis = () => {
    navigate('/figmant/wizard-analysis');
  };

  const handleRetry = () => {
    setProcessingState('processing');
    setError(null);
    setAnalysisResult(null);
    premiumAnalysis.reset();
  };

  const handleDownload = () => {
    if (analysisResult?.analysis) {
      const blob = new Blob([analysisResult.analysis], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${stepData.projectName || 'Analysis'}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (processingState === 'processing') {
    return (
      <div className="w-full min-h-full">
        <div className="w-full">
          <h2 className="text-3xl font-bold text-center mb-8">Processing Analysis</h2>
        </div>
        <div className="max-w-2xl mx-auto">
          <ProcessingState 
            selectedTemplateTitle={stepData.selectedType || 'Analysis'}
            debugLogs={['Starting analysis...', 'Processing with AI...', 'Generating insights...']}
          />
        </div>
      </div>
    );
  }

  if (processingState === 'error') {
    return (
      <div className="w-full min-h-full">
        <div className="w-full">
          <h2 className="text-3xl font-bold text-center mb-8">Analysis Failed</h2>
        </div>
        <div className="max-w-2xl mx-auto">
          <ErrorState 
            errorMessage={error || 'An unknown error occurred'}
            selectedType={stepData.selectedType}
            hasSelectedTemplate={!!stepData.selectedType}
            debugLogs={[]}
            onRetry={handleRetry}
            onBackToAnalysis={handleBackToAnalysis}
          />
        </div>
      </div>
    );
  }

  // Complete state - show actual results
  return (
    <div className="w-full min-h-full">
      <div className="w-full text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analysis Complete</h2>
        <p className="text-lg text-green-600 font-medium mb-4">Premium Analysis Complete!</p>
        <p className="text-gray-600">
          Your comprehensive {stepData.selectedType} analysis is ready
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Analysis Results Display */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {analysisResult?.analysis ? (
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {analysisResult.analysis}
                </div>
              ) : (
                <p className="text-gray-600">
                  Analysis has been completed successfully. The detailed results have been saved to your analysis history.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleViewInAnalysis}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <ExternalLink className="h-4 w-4" />
            View in Dashboard
          </Button>
          
          <Button 
            onClick={handleDownload}
            variant="outline"
            className="flex items-center gap-2"
            size="lg"
          >
            <Download className="h-4 w-4" />
            Download Analysis
          </Button>
          
          <Button 
            onClick={handleBackToAnalysis}
            variant="outline"
            className="flex items-center gap-2"
            size="lg"
          >
            <ArrowLeft className="h-4 w-4" />
            New Analysis
          </Button>
        </div>

        {/* Premium Features Note */}
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <h4 className="font-medium text-amber-800 mb-2">✨ Premium Analysis Features:</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Comprehensive market analysis with competitive insights</li>
            <li>• Strategic recommendations with implementation priorities</li>
            <li>• Revenue impact predictions and conversion optimization</li>
            <li>• Detailed analysis saved to your history for future reference</li>
            <li>• Downloadable reports for team sharing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
