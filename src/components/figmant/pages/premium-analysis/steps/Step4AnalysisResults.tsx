
import React, { useEffect, useState } from 'react';
import { StepProps } from '../types';
import { ProcessingState } from '../components/ProcessingState';
import { ErrorState } from '../components/ErrorState';
import { usePremiumAnalysisSubmission } from '@/hooks/usePremiumAnalysisSubmission';
import { useTemplateSelection } from '../hooks/useTemplateSelection';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, ExternalLink, ArrowLeft } from 'lucide-react';

export const Step4AnalysisResults: React.FC<StepProps> = ({ 
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
  const { selectedTemplate } = useTemplateSelection(stepData.selectedType);

  // 🔍 EXTENSIVE DEBUGGING: Log component initialization
  console.log('🧙 Step4AnalysisResults COMPONENT INIT:', {
    currentStep,
    totalSteps,
    processingState,
    stepData: {
      selectedType: stepData.selectedType,
      projectName: stepData.projectName,
      analysisGoals: stepData.analysisGoals,
      contextualDataKeys: Object.keys(stepData.contextualData || {}),
      contextualDataValues: stepData.contextualData,
      uploadedFilesCount: stepData.uploadedFiles?.length || 0,
      customPrompt: stepData.customPrompt,
      hasReferenceLinks: stepData.referenceLinks?.length > 0
    },
    selectedTemplate: selectedTemplate ? {
      id: selectedTemplate.id,
      title: selectedTemplate.title,
      category: selectedTemplate.category,
      hasContextualFields: selectedTemplate.contextual_fields?.length > 0,
      contextualFieldsCount: selectedTemplate.contextual_fields?.length || 0,
      promptLength: selectedTemplate.original_prompt?.length || 0
    } : null,
    premiumAnalysisState: {
      isPending: premiumAnalysis.isPending,
      isError: premiumAnalysis.isError,
      isSuccess: premiumAnalysis.isSuccess,
      hasData: !!premiumAnalysis.data
    }
  });

  const constructEnhancedPrompt = () => {
    console.log('🔍 CONSTRUCTING ENHANCED PROMPT START');
    
    if (!selectedTemplate) {
      console.warn('❌ No selected template found, using fallback prompt');
      return `Analyze this ${stepData.selectedType} design and provide comprehensive insights.`;
    }
    
    console.log('🔍 Enhanced prompt construction with template:', {
      templateId: selectedTemplate.id,
      templateTitle: selectedTemplate.title,
      originalPromptLength: selectedTemplate.original_prompt?.length || 0,
      contextualFieldsCount: selectedTemplate.contextual_fields?.length || 0,
      contextualFieldsData: selectedTemplate.contextual_fields
    });
    
    let enhancedPrompt = selectedTemplate.original_prompt;
    
    // Replace template variables with contextual data
    if (selectedTemplate.contextual_fields && selectedTemplate.contextual_fields.length > 0) {
      console.log('🔍 Processing contextual fields:', {
        fieldsCount: selectedTemplate.contextual_fields.length,
        availableContextData: stepData.contextualData,
        contextDataKeys: Object.keys(stepData.contextualData || {})
      });
      
      selectedTemplate.contextual_fields.forEach(field => {
        const value = stepData.contextualData?.[field.id] || '';
        const placeholder = `{{${field.id}}}`;
        
        console.log('🔍 Processing field:', {
          fieldId: field.id,
          fieldLabel: field.label,
          placeholder,
          value,
          hasPlaceholderInPrompt: enhancedPrompt.includes(placeholder)
        });
        
        if (enhancedPrompt.includes(placeholder)) {
          enhancedPrompt = enhancedPrompt.replace(new RegExp(`\\{\\{${field.id}\\}\\}`, 'g'), value);
          console.log(`✅ Replaced ${placeholder} with: ${value}`);
        } else {
          console.log(`⚠️ Placeholder ${placeholder} not found in prompt`);
        }
      });
    } else {
      console.log('ℹ️ No contextual fields to process');
    }
    
    // Add context about uploaded files
    if (stepData.uploadedFiles?.length) {
      const fileContext = `\n\nAnalyze the uploaded files: ${stepData.uploadedFiles.map(f => f.name).join(', ')}`;
      enhancedPrompt += fileContext;
      console.log('🔍 Added file context:', {
        filesCount: stepData.uploadedFiles.length,
        fileNames: stepData.uploadedFiles.map(f => f.name),
        addedContext: fileContext
      });
    }
    
    // Add custom prompt if provided
    if (stepData.customPrompt) {
      const customContext = `\n\nAdditional Context: ${stepData.customPrompt}`;
      enhancedPrompt += customContext;
      console.log('🔍 Added custom prompt context:', {
        customPromptLength: stepData.customPrompt.length,
        addedContext: customContext
      });
    }
    
    console.log('🔍 ENHANCED PROMPT CONSTRUCTION COMPLETE:', {
      originalLength: selectedTemplate.original_prompt?.length || 0,
      finalLength: enhancedPrompt.length,
      hasFileContext: !!stepData.uploadedFiles?.length,
      hasCustomContext: !!stepData.customPrompt,
      finalPromptPreview: enhancedPrompt.substring(0, 300) + '...'
    });
    
    return enhancedPrompt;
  };

  useEffect(() => {
    console.log('🔍 ANALYSIS TRIGGER EFFECT CALLED:', {
      processingState,
      hasSelectedType: !!stepData.selectedType,
      hasSelectedTemplate: !!selectedTemplate,
      shouldTriggerAnalysis: processingState === 'processing' && stepData.selectedType && selectedTemplate
    });

    // Start the actual analysis when component mounts
    if (processingState === 'processing' && stepData.selectedType && selectedTemplate) {
      console.log('🧙 STARTING ENHANCED PREMIUM ANALYSIS:', {
        templateData: {
          id: selectedTemplate.id,
          title: selectedTemplate.title,
          category: selectedTemplate.category,
          hasContextualFields: selectedTemplate.contextual_fields?.length > 0,
          contextualFieldsCount: selectedTemplate.contextual_fields?.length || 0
        },
        stepDataSummary: {
          selectedType: stepData.selectedType,
          projectName: stepData.projectName,
          contextualDataKeys: Object.keys(stepData.contextualData || {}),
          uploadedFilesCount: stepData.uploadedFiles?.length || 0,
          hasCustomPrompt: !!stepData.customPrompt
        }
      });
      
      const enhancedPrompt = constructEnhancedPrompt();
      
      console.log('🔍 CALLING premiumAnalysis.mutate WITH:', {
        stepDataPayload: {
          selectedType: stepData.selectedType,
          projectName: stepData.projectName,
          analysisGoals: stepData.analysisGoals,
          contextualData: stepData.contextualData,
          uploadedFilesCount: stepData.uploadedFiles?.length || 0,
          customPromptReplaced: enhancedPrompt !== stepData.customPrompt,
          enhancedPromptLength: enhancedPrompt.length
        },
        selectedPromptPayload: {
          id: selectedTemplate.id,
          title: selectedTemplate.title,
          category: selectedTemplate.category,
          original_prompt_length: selectedTemplate.original_prompt?.length || 0
        }
      });

      premiumAnalysis.mutate({
        stepData: {
          ...stepData,
          customPrompt: enhancedPrompt // Use enhanced prompt instead of basic customPrompt
        },
        selectedPrompt: selectedTemplate
      });
    } else {
      console.log('🔍 Analysis NOT triggered because:', {
        processingStateIsProcessing: processingState === 'processing',
        hasSelectedType: !!stepData.selectedType,
        hasSelectedTemplate: !!selectedTemplate,
        selectedType: stepData.selectedType,
        selectedTemplateId: selectedTemplate?.id
      });
    }
  }, [processingState, stepData.selectedType, selectedTemplate]);

  // Handle analysis completion
  useEffect(() => {
    console.log('🔍 ANALYSIS COMPLETION EFFECT:', {
      isSuccess: premiumAnalysis.isSuccess,
      hasData: !!premiumAnalysis.data,
      data: premiumAnalysis.data
    });

    if (premiumAnalysis.isSuccess && premiumAnalysis.data) {
      console.log('🧙 PREMIUM ANALYSIS COMPLETED SUCCESSFULLY:', {
        result: {
          hasAnalysis: !!premiumAnalysis.data.analysis,
          analysisLength: premiumAnalysis.data.analysis?.length || 0,
          analysisPreview: premiumAnalysis.data.analysis?.substring(0, 200) || 'No analysis',
          savedAnalysisId: premiumAnalysis.data.savedAnalysisId,
          debugInfo: premiumAnalysis.data.debugInfo,
          fullDataStructure: premiumAnalysis.data
        }
      });
      
      setAnalysisResult(premiumAnalysis.data);
      setProcessingState('complete');
    }
  }, [premiumAnalysis.isSuccess, premiumAnalysis.data]);

  // Handle analysis error
  useEffect(() => {
    console.log('🔍 ANALYSIS ERROR EFFECT:', {
      isError: premiumAnalysis.isError,
      error: premiumAnalysis.error
    });

    if (premiumAnalysis.isError) {
      console.error('🧙 PREMIUM ANALYSIS FAILED:', {
        error: premiumAnalysis.error,
        errorMessage: premiumAnalysis.error?.message,
        errorStack: premiumAnalysis.error?.stack,
        fullError: premiumAnalysis.error
      });
      
      setError(premiumAnalysis.error?.message || 'Analysis failed');
      setProcessingState('error');
    }
  }, [premiumAnalysis.isError, premiumAnalysis.error]);

  const handleViewInAnalysis = () => {
    console.log('🔍 View in Dashboard button clicked');
    
    try {
      navigate('/figmant');
      
      toast({
        title: "Redirecting to Analysis History",
        description: "You'll find your completed analysis in the History tab of the sidebar.",
      });
    } catch (error) {
      console.error('Navigation error:', error);
      navigate('/figmant');
    }
  };

  const handleBackToAnalysis = () => {
    console.log('🔙 Back to Analysis button clicked');
    navigate('/figmant/wizard-analysis');
  };

  const handleRetry = () => {
    console.log('🔄 Retry button clicked');
    setProcessingState('processing');
    setError(null);
    setAnalysisResult(null);
    premiumAnalysis.reset();
  };

  const handleDownload = () => {
    console.log('💾 Download button clicked');
    
    if (analysisResult?.analysis) {
      try {
        const blob = new Blob([analysisResult.analysis], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${stepData.projectName || 'Analysis'}_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Download Started",
          description: "Your analysis is being downloaded.",
        });
      } catch (error) {
        console.error('Download error:', error);
        toast({
          title: "Download Failed",
          description: "There was an error downloading your analysis.",
          variant: "destructive",
        });
      }
    }
  };

  // Show error if no template is found
  if (stepData.selectedType && !selectedTemplate) {
    console.error('❌ TEMPLATE NOT FOUND ERROR:', {
      selectedType: stepData.selectedType,
      hasSelectedTemplate: !!selectedTemplate
    });
    
    return (
      <div className="w-full min-h-full">
        <div className="w-full">
          <h2 className="text-3xl font-bold text-center mb-8">Template Not Found</h2>
        </div>
        <div className="max-w-2xl mx-auto">
          <ErrorState 
            errorMessage={`Template not found for type: ${stepData.selectedType}`}
            selectedType={stepData.selectedType}
            hasSelectedTemplate={false}
            debugLogs={[]}
            onRetry={handleRetry}
            onBackToAnalysis={handleBackToAnalysis}
          />
        </div>
      </div>
    );
  }

  // PROCESSING STATE
  if (processingState === 'processing') {
    console.log('🔍 RENDERING PROCESSING STATE');
    
    return (
      <div className="w-full min-h-full">
        <div className="w-full">
          <h2 className="text-3xl font-bold text-center mb-8">Processing Analysis</h2>
        </div>
        <div className="max-w-2xl mx-auto">
          <ProcessingState 
            selectedTemplateTitle={selectedTemplate?.title || stepData.selectedType || 'Analysis'}
            debugLogs={[
              'Loading template configuration...', 
              'Processing contextual fields...', 
              'Constructing enhanced analysis prompt...',
              'Sending to AI for analysis...'
            ]}
          />
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (processingState === 'error') {
    console.log('🔍 RENDERING ERROR STATE:', { error });
    
    return (
      <div className="w-full min-h-full">
        <div className="w-full">
          <h2 className="text-3xl font-bold text-center mb-8">Analysis Failed</h2>
        </div>
        <div className="max-w-2xl mx-auto">
          <ErrorState 
            errorMessage={error || 'An unknown error occurred'}
            selectedType={stepData.selectedType}
            hasSelectedTemplate={!!selectedTemplate}
            debugLogs={[]}
            onRetry={handleRetry}
            onBackToAnalysis={handleBackToAnalysis}
          />
        </div>
      </div>
    );
  }

  // COMPLETE STATE - show actual results
  console.log('🔍 RENDERING COMPLETE STATE:', {
    hasAnalysisResult: !!analysisResult,
    analysisResultStructure: analysisResult
  });

  return (
    <div className="w-full min-h-full">
      <div className="w-full text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analysis Complete</h2>
        <p className="text-lg text-green-600 font-medium mb-4">Enhanced Premium Analysis Complete!</p>
        <p className="text-gray-600">
          Your comprehensive {selectedTemplate?.title || stepData.selectedType} analysis is ready
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
            type="button"
          >
            <ExternalLink className="h-4 w-4" />
            View in Dashboard
          </Button>
          
          <Button 
            onClick={handleDownload}
            variant="outline"
            className="flex items-center gap-2"
            size="lg"
            type="button"
          >
            <Download className="h-4 w-4" />
            Download Analysis
          </Button>
          
          <Button 
            onClick={handleBackToAnalysis}
            variant="outline"
            className="flex items-center gap-2"
            size="lg"
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            New Analysis
          </Button>
        </div>

        {/* Premium Features Note */}
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <h4 className="font-medium text-amber-800 mb-2">✨ Enhanced Premium Analysis Features:</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Template-specific analysis with contextual field integration</li>
            <li>• Enhanced prompts with variable substitution</li>
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
