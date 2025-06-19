
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Loader2, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFigmantChatAnalysis } from '@/hooks/useFigmantChatAnalysis';
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
  const analysisQuery = useFigmantChatAnalysis();

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

      // Prepare analysis request
      const analysisRequest = {
        message: `Please analyze this project based on the following requirements:
        
Project: ${stepData.projectName}
Analysis Type: ${stepData.selectedType}
Goals: ${stepData.analysisGoals}
Desired Outcome: ${stepData.desiredOutcome}
${stepData.improvementMetric ? `Key Metric: ${stepData.improvementMetric}` : ''}
${stepData.deadline ? `Deadline: ${stepData.deadline}` : ''}
${stepData.stakeholders?.length ? `Stakeholders: ${stepData.stakeholders.join(', ')}` : ''}
${stepData.referenceLinks?.filter(link => link.trim()).length ? `Reference Links: ${stepData.referenceLinks.filter(link => link.trim()).join(', ')}` : ''}
${stepData.customPrompt ? `Additional Instructions: ${stepData.customPrompt}` : ''}`,
        attachments: stepData.uploadedFiles ? stepData.uploadedFiles.map((file, index) => ({
          id: `wizard-file-${index}`,
          type: 'file' as const,
          name: file.name,
          file: file,
          status: 'uploaded' as const
        })) : [],
        template: null
      };

      const result = await analysisQuery.mutateAsync(analysisRequest);
      
      clearInterval(progressInterval);
      setProgress(100);
      setAnalysisResult(result);
      setStatus('completed');
      
      toast({
        title: "Analysis Complete",
        description: "Your design analysis has been completed successfully.",
      });

    } catch (error) {
      console.error('Analysis failed:', error);
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
      const dataStr = JSON.stringify(analysisResult, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${stepData.projectName}-analysis-results.json`;
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
          {status === 'processing' && 'Processing Analysis...'}
          {status === 'completed' && 'Analysis Complete!'}
          {status === 'error' && 'Analysis Failed'}
        </h2>
        <p className="text-gray-600">
          {status === 'processing' && 'Please wait while we analyze your project requirements.'}
          {status === 'completed' && 'Your comprehensive analysis is ready for review.'}
          {status === 'error' && 'There was an error processing your analysis. Please try again.'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {status === 'processing' && <Loader2 className="h-5 w-5 animate-spin" />}
            {status === 'completed' && <CheckCircle className="h-5 w-5 text-green-600" />}
            {status === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
            <span>Analysis Status</span>
          </CardTitle>
          <CardDescription>
            Project: {stepData.projectName} | Type: {stepData.selectedType}
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
                    'Analysis completed successfully with comprehensive insights.'
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
                  The analysis could not be completed. Please check your inputs and try again.
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
          <div><strong>Analysis Type:</strong> {stepData.selectedType}</div>
          <div><strong>Goals:</strong> {stepData.analysisGoals}</div>
          {stepData.desiredOutcome && <div><strong>Desired Outcome:</strong> {stepData.desiredOutcome}</div>}
          {stepData.improvementMetric && <div><strong>Key Metric:</strong> {stepData.improvementMetric}</div>}
          {stepData.deadline && <div><strong>Deadline:</strong> {stepData.deadline}</div>}
          {stepData.uploadedFiles?.length && (
            <div><strong>Files:</strong> {stepData.uploadedFiles.length} uploaded</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
