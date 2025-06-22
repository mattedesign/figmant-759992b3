
import React, { useState, useEffect } from 'react';
import { StepProps } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Share, Bookmark, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { ContextualAnalysisResult, ContextualRecommendation } from '@/types/contextualAnalysis';
import { RecommendationCard } from '../../analysis/RecommendationCard';
import { AnalysisSummary } from '../../analysis/AnalysisSummary';

export const Step4ContextualResults: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ContextualAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Simulate analysis processing when component mounts
  useEffect(() => {
    if (!analysisResult && !isProcessing && stepData.selectedType) {
      startAnalysis();
    }
  }, [stepData.selectedType, analysisResult, isProcessing]);

  const startAnalysis = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate sample analysis results based on the selected type
      const mockResult: ContextualAnalysisResult = {
        id: `analysis-${Date.now()}`,
        summary: generateAnalysisSummary(stepData.selectedType),
        recommendations: generateRecommendations(stepData.selectedType),
        attachments: stepData.uploadedFiles?.map((file, index) => ({
          id: `attachment-${index}`,
          name: file.name || `Upload ${index + 1}`,
          type: 'image' as const,
          fileSize: (file as any).size,
          mimeType: (file as any).type
        })) || [],
        metrics: {
          totalRecommendations: 0,
          highPriorityCount: 0,
          averageConfidence: 85,
          attachmentsAnalyzed: stepData.uploadedFiles?.length || 0,
          categoriesIdentified: ['ux', 'conversion', 'accessibility'],
          estimatedImplementationTime: '1-2 weeks'
        },
        createdAt: new Date().toISOString(),
        analysisType: stepData.selectedType
      };
      
      // Update metrics based on recommendations
      mockResult.metrics.totalRecommendations = mockResult.recommendations.length;
      mockResult.metrics.highPriorityCount = mockResult.recommendations.filter(r => r.priority === 'high').length;
      
      setAnalysisResult(mockResult);
    } catch (err) {
      setError('Failed to generate analysis. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateAnalysisSummary = (analysisType: string): string => {
    const summaries = {
      'competitor-analysis': 'Comprehensive competitor analysis completed. Your design shows strong potential with several key opportunities for improvement in conversion optimization and user experience.',
      'visual-hierarchy': 'Visual hierarchy analysis reveals good foundational structure with opportunities to enhance information flow and user attention patterns.',
      'copy-messaging': 'Content and messaging analysis identifies strong communication opportunities and areas for improved clarity and engagement.',
      'ecommerce-revenue': 'E-commerce revenue impact analysis shows significant potential for conversion rate improvements and revenue optimization.',
      'ab-testing': 'A/B testing readiness assessment completed with recommended test configurations and success metrics identified.',
      'default': 'Analysis completed successfully with actionable insights and recommendations for improvement.'
    };
    
    return summaries[analysisType as keyof typeof summaries] || summaries.default;
  };

  const generateRecommendations = (analysisType: string): ContextualRecommendation[] => {
    const baseRecommendations = [
      {
        id: 'rec-1',
        title: 'Optimize Primary Call-to-Action',
        description: 'Enhance the primary CTA button with improved contrast and positioning to increase conversion rates.',
        category: 'conversion' as const,
        priority: 'high' as const,
        confidence: 92,
        relatedAttachmentIds: [],
        suggestedActions: ['Increase button size by 20%', 'Use contrasting color scheme', 'Add urgency indicators'],
        estimatedImpact: {
          conversionLift: '15-25%',
          userExperience: 'Significantly improved',
          implementation: 'easy' as const
        }
      },
      {
        id: 'rec-2',
        title: 'Improve Information Architecture',
        description: 'Reorganize content hierarchy to reduce cognitive load and improve user flow.',
        category: 'ux' as const,
        priority: 'medium' as const,
        confidence: 88,
        relatedAttachmentIds: [],
        suggestedActions: ['Group related elements', 'Reduce text density', 'Add visual separators'],
        estimatedImpact: {
          userExperience: 'Improved',
          implementation: 'medium' as const
        }
      },
      {
        id: 'rec-3',
        title: 'Enhance Accessibility Compliance',
        description: 'Address color contrast and keyboard navigation issues to improve accessibility.',
        category: 'accessibility' as const,
        priority: 'medium' as const,
        confidence: 95,
        relatedAttachmentIds: [],
        suggestedActions: ['Improve color contrast ratios', 'Add focus indicators', 'Include alt text'],
        estimatedImpact: {
          userExperience: 'Significantly improved',
          implementation: 'easy' as const
        }
      }
    ];

    return baseRecommendations;
  };

  if (isProcessing) {
    return (
      <div className="w-full min-h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <h2 className="text-2xl font-semibold">Analyzing Your Design</h2>
          <p className="text-muted-foreground">
            Processing {stepData.selectedType.replace('-', ' ')} analysis...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-full flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h3 className="text-lg font-semibold">Analysis Failed</h3>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={startAnalysis}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="w-full min-h-full flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <Clock className="h-12 w-12 text-blue-500 mx-auto" />
            <h3 className="text-lg font-semibold">Ready to Analyze</h3>
            <p className="text-muted-foreground">Click below to start your analysis</p>
            <Button onClick={startAnalysis}>Start Analysis</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full">
      <div className="w-full mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <h2 className="text-3xl font-bold text-center">Analysis Complete</h2>
        </div>
        <p className="text-center text-muted-foreground">
          Your {stepData.selectedType.replace('-', ' ')} analysis has been completed
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Analysis Summary */}
        <AnalysisSummary 
          metrics={analysisResult.metrics}
          recommendations={analysisResult.recommendations}
        />

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

        {/* Results Tabs */}
        <Tabs defaultValue="recommendations" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommendations" className="space-y-4">
            {analysisResult.recommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                attachments={analysisResult.attachments}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {analysisResult.summary}
                </p>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {analysisResult.metrics.averageConfidence}%
                    </div>
                    <div className="text-sm text-blue-700">Confidence</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {analysisResult.metrics.totalRecommendations}
                    </div>
                    <div className="text-sm text-green-700">Recommendations</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {analysisResult.metrics.highPriorityCount}
                    </div>
                    <div className="text-sm text-orange-700">High Priority</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {analysisResult.metrics.attachmentsAnalyzed}
                    </div>
                    <div className="text-sm text-purple-700">Files Analyzed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="attachments">
            <Card>
              <CardHeader>
                <CardTitle>Analyzed Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                {analysisResult.attachments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analysisResult.attachments.map((attachment) => (
                      <div key={attachment.id} className="border rounded-lg p-4">
                        <h4 className="font-medium truncate">{attachment.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {attachment.type} • {attachment.fileSize ? Math.round(attachment.fileSize / 1024) + ' KB' : 'Unknown size'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No attachments were included in this analysis
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
