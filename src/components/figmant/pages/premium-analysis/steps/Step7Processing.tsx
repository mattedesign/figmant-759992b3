
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Loader2, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePremiumAnalysisSubmission } from '@/hooks/usePremiumAnalysisSubmission';
import { useTemplateSelection } from '../hooks/useTemplateSelection';
import { StepProps } from '../types';

export const Step7Processing: React.FC<StepProps> = ({ 
  stepData, 
  onNextStep, 
  onPreviousStep 
}) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'processing' | 'completed' | 'error'>('processing');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { toast } = useToast();
  const premiumAnalysisMutation = usePremiumAnalysisSubmission();
  const { selectedTemplate } = useTemplateSelection(stepData.selectedType);

  useEffect(() => {
    // Start the analysis when component mounts
    startAnalysis();
  }, []);

  const startAnalysis = async () => {
    try {
      setStatus('processing');
      setProgress(0);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      if (!selectedTemplate) {
        throw new Error('Selected analysis template not found');
      }

      // Execute premium analysis
      const result = await premiumAnalysisMutation.mutateAsync({
        stepData,
        selectedPrompt: selectedTemplate
      });
      
      clearInterval(progressInterval);
      setProgress(100);
      setAnalysisResult(result);
      setStatus('completed');
      
      toast({
        title: "Premium Analysis Complete",
        description: "Your comprehensive analysis has been generated successfully.",
      });

    } catch (error) {
      console.error('Premium analysis failed:', error);
      setStatus('error');
      setProgress(0);
      
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : 'An error occurred during analysis.',
      });
    }
  };

  const handleRetry = () => {
    startAnalysis();
  };

  const handleDownloadResults = () => {
    if (analysisResult) {
      const dataStr = analysisResult.analysis || 'Analysis completed successfully';
      const dataBlob = new Blob([dataStr], { type: 'text/plain' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${stepData.projectName}-premium-analysis.txt`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleStartNew = () => {
    // Reset wizard and go back to step 1
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          {status === 'processing' && 'Processing Premium Analysis...'}
          {status === 'completed' && 'Premium Analysis Complete!'}
          {status === 'error' && 'Analysis Failed'}
        </h2>
        <p className="text-gray-600">
          {status === 'processing' && 'Please wait while we generate your comprehensive premium analysis.'}
          {status === 'completed' && 'Your premium analysis is ready for review and download.'}
          {status === 'error' && 'There was an error processing your premium analysis. Please try again.'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {status === 'processing' && <Loader2 className="h-5 w-5 animate-spin" />}
            {status === 'completed' && <CheckCircle className="h-5 w-5 text-green-600" />}
            {status === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
            <span>Premium Analysis Status</span>
          </CardTitle>
          <CardDescription>
            Project: {stepData.projectName} | Type: {selectedTemplate?.displayName || stepData.selectedType}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'processing' && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600 text-center">{progress}% complete</p>
            </div>
          )}

          {status === 'completed' && analysisResult && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Analysis Summary</h3>
                <p className="text-green-700 text-sm">
                  {analysisResult.analysis ? 
                    `${analysisResult.analysis.substring(0, 200)}...` : 
                    'Premium analysis completed successfully with comprehensive insights and recommendations.'
                  }
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Button onClick={handleDownloadResults} className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Download Results</span>
                </Button>
                <Button variant="outline" onClick={handleStartNew}>
                  Start New Analysis
                </Button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">Error Details</h3>
                <p className="text-red-700 text-sm">
                  The premium analysis could not be completed. Please check your inputs and try again.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Button onClick={handleRetry} className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Retry Analysis</span>
                </Button>
                <Button variant="outline" onClick={onPreviousStep}>
                  Go Back
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Project Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div><strong>Analysis Type:</strong> {selectedTemplate?.displayName || stepData.selectedType}</div>
          <div><strong>Goals:</strong> {stepData.analysisGoals}</div>
          {stepData.contextualData && Object.keys(stepData.contextualData).length > 0 && (
            <div>
              <strong>Project Details:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                {Object.entries(stepData.contextualData).map(([key, value]) => {
                  if (value && value.toString().trim()) {
                    // Find the field definition to get a readable label
                    const field = selectedTemplate?.contextual_fields?.find((f: any) => f.id === key);
                    const fieldLabel = field?.label || key;
                    return (
                      <li key={key}>
                        <strong>{fieldLabel}:</strong> {value.toString()}
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          )}
          {stepData.uploadedFiles?.length && (
            <div><strong>Files:</strong> {stepData.uploadedFiles.length} uploaded</div>
          )}
          {stepData.stakeholders?.length && (
            <div><strong>Stakeholders:</strong> {stepData.stakeholders.length} added</div>
          )}
          {stepData.customPrompt && (
            <div><strong>Custom Instructions:</strong> {stepData.customPrompt.substring(0, 100)}...</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
