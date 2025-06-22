
import React, { useState, useEffect } from 'react';
import { StepProps } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Share, Bookmark, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { usePremiumAnalysisSubmission } from '@/hooks/usePremiumAnalysisSubmission';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const Step4ContextualResults: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisStarted, setAnalysisStarted] = useState(false);
  
  console.log('🔍 Step4ContextualResults - Rendering with stepData:', {
    selectedType: stepData.selectedType,
    projectName: stepData.projectName,
    uploadedFilesCount: stepData.uploadedFiles?.length || 0
  });

  // Fetch the actual template by ID instead of by category
  const { data: templateData, isLoading: isLoadingTemplate } = useQuery({
    queryKey: ['template-by-id', stepData.selectedType],
    queryFn: async () => {
      console.log('🔍 Fetching template by ID:', stepData.selectedType);
      const { data, error } = await supabase
        .from('claude_prompt_examples')
        .select('*')
        .eq('id', stepData.selectedType)
        .eq('is_active', true)
        .single();
      
      if (error) {
        console.error('🔍 Error fetching template:', error);
        throw error;
      }
      
      console.log('🔍 Fetched template:', data);
      return data;
    },
    enabled: !!stepData.selectedType
  });

  // Premium analysis mutation
  const premiumAnalysisMutation = usePremiumAnalysisSubmission();

  // Start analysis when we have the template and haven't started yet
  useEffect(() => {
    const shouldStartAnalysis = templateData && 
                               stepData.selectedType && 
                               !analysisResult && 
                               !analysisStarted &&
                               !premiumAnalysisMutation.isPending;

    if (shouldStartAnalysis) {
      console.log('🔍 Starting premium analysis with template:', templateData);
      setAnalysisStarted(true);
      
      // Extract contextual fields from metadata with proper type checking
      let contextualFields = [];
      if (templateData.metadata && typeof templateData.metadata === 'object' && templateData.metadata !== null) {
        const metadata = templateData.metadata as Record<string, any>;
        contextualFields = Array.isArray(metadata.contextual_fields) ? metadata.contextual_fields : [];
      }
      
      // Create a properly formatted prompt object
      const selectedPrompt = {
        id: templateData.id,
        title: templateData.title || templateData.display_name,
        category: templateData.category,
        original_prompt: templateData.original_prompt,
        contextual_fields: contextualFields
      };
      
      premiumAnalysisMutation.mutate({
        stepData,
        selectedPrompt
      });
    }
  }, [templateData, stepData, analysisResult, analysisStarted, premiumAnalysisMutation.isPending]);

  // Handle successful analysis
  useEffect(() => {
    if (premiumAnalysisMutation.isSuccess && premiumAnalysisMutation.data?.analysis) {
      console.log('🔍 Premium analysis completed successfully');
      setAnalysisResult(premiumAnalysisMutation.data.analysis);
    }
  }, [premiumAnalysisMutation.isSuccess, premiumAnalysisMutation.data]);

  const startAnalysis = () => {
    if (templateData) {
      console.log('🔍 Manually starting analysis');
      setAnalysisResult(null);
      setAnalysisStarted(true);
      
      // Extract contextual fields from metadata with proper type checking
      let contextualFields = [];
      if (templateData.metadata && typeof templateData.metadata === 'object' && templateData.metadata !== null) {
        const metadata = templateData.metadata as Record<string, any>;
        contextualFields = Array.isArray(metadata.contextual_fields) ? metadata.contextual_fields : [];
      }

      const selectedPrompt = {
        id: templateData.id,
        title: templateData.title || templateData.display_name,
        category: templateData.category,
        original_prompt: templateData.original_prompt,
        contextual_fields: contextualFields
      };

      premiumAnalysisMutation.mutate({
        stepData,
        selectedPrompt
      });
    }
  };

  // Loading state while fetching template or running analysis
  if (isLoadingTemplate || premiumAnalysisMutation.isPending) {
    return (
      <div className="w-full min-h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <h2 className="text-2xl font-semibold">
            {isLoadingTemplate ? 'Loading Analysis Template...' : 'Analyzing Your Design'}
          </h2>
          <p className="text-muted-foreground">
            {isLoadingTemplate 
              ? 'Preparing analysis configuration...' 
              : `Processing ${templateData?.category || 'design'} analysis...`
            }
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (premiumAnalysisMutation.isError) {
    return (
      <div className="w-full min-h-full flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h3 className="text-lg font-semibold">Analysis Failed</h3>
            <p className="text-muted-foreground">
              {premiumAnalysisMutation.error?.message || "An error occurred during premium analysis"}
            </p>
            <Button onClick={startAnalysis}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ready to analyze state (if no template found or not started)
  if (!templateData || (!analysisResult && !analysisStarted)) {
    return (
      <div className="w-full min-h-full flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <Clock className="h-12 w-12 text-blue-500 mx-auto" />
            <h3 className="text-lg font-semibold">Ready to Analyze</h3>
            <p className="text-muted-foreground">
              {!templateData 
                ? "Analysis template not found" 
                : "Click below to start your analysis"
              }
            </p>
            {templateData && (
              <Button onClick={startAnalysis} disabled={!templateData}>
                Start Analysis
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results state - show actual Claude AI analysis
  return (
    <div className="w-full min-h-full">
      <div className="w-full mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <h2 className="text-3xl font-bold text-center">Analysis Complete</h2>
        </div>
        <p className="text-center text-muted-foreground">
          Your {templateData?.category || 'design'} analysis has been completed
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share Analysis
          </Button>
          <Button variant="outline">
            <Bookmark className="h-4 w-4 mr-2" />
            Save for Later
          </Button>
        </div>

        {/* Analysis Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Premium Analysis Results
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary">
                {templateData?.category?.toUpperCase() || 'ANALYSIS'}
              </Badge>
              <Badge variant="outline">
                Claude AI Powered
              </Badge>
              {stepData.uploadedFiles && stepData.uploadedFiles.length > 0 && (
                <Badge variant="outline">
                  {stepData.uploadedFiles.length} file{stepData.uploadedFiles.length !== 1 ? 's' : ''} analyzed
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {analysisResult}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Context Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Project Details</h4>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Project:</span> {stepData.projectName}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Analysis Type:</span> {templateData?.category || 'Analysis'}
                </p>
                {stepData.analysisGoals && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Goals:</span> {stepData.analysisGoals}
                  </p>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Files Analyzed</h4>
                {stepData.uploadedFiles && stepData.uploadedFiles.length > 0 ? (
                  <div className="space-y-1">
                    {stepData.uploadedFiles.map((file, index) => (
                      <p key={index} className="text-sm text-gray-600">
                        {file.name} ({Math.round(file.size / 1024)} KB)
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No files uploaded</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
