
import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StepProps } from '../types';
import { StepHeader } from '../components/StepHeader';
import { usePremiumAnalysisSubmission } from '@/hooks/usePremiumAnalysisSubmission';
import { useClaudePromptExamplesByCategory } from '@/hooks/useClaudePromptExamplesByCategory';
import { figmantPromptTemplates } from '@/data/figmantPromptTemplates';
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
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const { data: premiumPrompts } = useClaudePromptExamplesByCategory('premium');
  const premiumAnalysis = usePremiumAnalysisSubmission();

  // Helper function to add debug logs
  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log('🔍 PREMIUM ANALYSIS DEBUG:', logMessage);
    setDebugLogs(prev => [...prev, logMessage]);
  };

  // Find the selected template from either premium prompts or figmant templates
  const selectedTemplate = React.useMemo(() => {
    addDebugLog(`Looking for template with ID: ${stepData.selectedType}`);
    
    // First try to find in premium prompts (database)
    if (premiumPrompts?.length > 0) {
      const premiumTemplate = premiumPrompts.find(prompt => prompt.id === stepData.selectedType);
      if (premiumTemplate) {
        addDebugLog(`Found template in premium prompts: ${premiumTemplate.title}`);
        return {
          id: premiumTemplate.id,
          title: premiumTemplate.title,
          category: premiumTemplate.category,
          original_prompt: premiumTemplate.original_prompt
        };
      }
    }
    
    // If not found in premium prompts, try figmant templates
    const figmantTemplate = figmantPromptTemplates.find(template => template.id === stepData.selectedType);
    if (figmantTemplate) {
      addDebugLog(`Found template in figmant templates: ${figmantTemplate.name}`);
      return {
        id: figmantTemplate.id,
        title: figmantTemplate.name,
        category: 'premium', // Treat figmant templates as premium for analysis
        original_prompt: figmantTemplate.prompt_template
      };
    }
    
    addDebugLog(`Template not found in either source`);
    return null;
  }, [stepData.selectedType, premiumPrompts]);

  useEffect(() => {
    console.log('🔍 Step7Processing mounted with:', {
      stepData,
      selectedPromptId: stepData.selectedType,
      processingStatus,
      premiumPromptsCount: premiumPrompts?.length || 0,
      figmantTemplatesCount: figmantPromptTemplates.length
    });

    addDebugLog('Step7Processing component mounted');
    addDebugLog(`Selected prompt ID: ${stepData.selectedType}`);
    addDebugLog(`Premium prompts loaded: ${premiumPrompts?.length || 0}`);
    addDebugLog(`Figmant templates available: ${figmantPromptTemplates.length}`);
    addDebugLog(`Selected template found: ${!!selectedTemplate}`);

    if (selectedTemplate && processingStatus === 'processing') {
      addDebugLog('Starting analysis submission...');
      handleAnalysisSubmission();
    } else if (!selectedTemplate && (premiumPrompts?.length > 0 || figmantPromptTemplates.length > 0)) {
      addDebugLog('ERROR: Selected template not found in any source');
      setProcessingStatus('error');
    }
  }, [selectedTemplate, premiumPrompts]);

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
    setDebugLogs(prev => [...prev, '--- RETRY ATTEMPT ---']);
    handleAnalysisSubmission();
  };

  const handleViewInAnalysis = () => {
    addDebugLog('Navigating to analysis page...');
    // Navigate to the analysis page in the figmant interface
    navigate('/figmant', { state: { activeSection: 'analysis' } });
  };

  const handleBackToAnalysis = () => {
    addDebugLog('Navigating back to analysis page...');
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
                Using {selectedTemplate?.title || 'selected'} analysis framework
              </p>
              <div className="text-sm text-gray-500">
                This may take up to 2 minutes for comprehensive results
              </div>
              
              {/* Debug logs section during processing */}
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-600">
                  View Debug Logs ({debugLogs.length})
                </summary>
                <div className="mt-2 max-h-32 overflow-y-auto bg-gray-50 p-2 rounded text-xs font-mono">
                  {debugLogs.map((log, index) => (
                    <div key={index} className="text-gray-600">{log}</div>
                  ))}
                </div>
              </details>
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
                  Your comprehensive {selectedTemplate?.title} analysis is ready
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
                {premiumAnalysis.error && (
                  <p className="text-sm text-red-500 mt-2">
                    Error: {premiumAnalysis.error.message}
                  </p>
                )}
              </div>
            </div>
            
            {/* Debug logs section for errors */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto">
              <h4 className="font-medium text-red-800 mb-2">Debug Information:</h4>
              <div className="max-h-48 overflow-y-auto bg-white p-2 rounded text-xs font-mono">
                {debugLogs.map((log, index) => (
                  <div key={index} className={`${log.includes('ERROR') ? 'text-red-600' : 'text-gray-600'}`}>
                    {log}
                  </div>
                ))}
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
