
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Download, Share, Bookmark, FileText, BarChart3, Eye, Save, Loader2, AlertCircle } from 'lucide-react';
import { StepData } from '../types';
import { RecommendationCard } from '@/components/figmant/analysis/RecommendationCard';
import { AnalysisSummary } from '@/components/figmant/analysis/AnalysisSummary';
import { AttachmentReference } from '@/components/figmant/analysis/AttachmentReference';
import { EnhancedContextualAnalysisProcessor } from '@/utils/enhancedContextualAnalysisProcessor';
import { processAttachments } from '@/utils/contextualAnalysisProcessor';
import { ContextualAnalysisResult, AnalysisAttachment } from '@/types/contextualAnalysis';
import { useWizardAnalysisSave } from '../hooks/useWizardAnalysisSave';
import { useToast } from '@/hooks/use-toast';

interface EnhancedAnalysisResultsViewerProps {
  stepData: StepData;
  analysisResult: string;
  templateData?: any;
  onExport?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  structuredAnalysis?: ContextualAnalysisResult;
  isSaving?: boolean;
}

export const EnhancedAnalysisResultsViewer: React.FC<EnhancedAnalysisResultsViewerProps> = ({
  stepData,
  analysisResult,
  templateData,
  onExport,
  onShare,
  onSave,
  structuredAnalysis: providedStructuredAnalysis,
  isSaving = false
}) => {
  const [selectedAttachment, setSelectedAttachment] = useState<AnalysisAttachment | null>(null);
  const [activeTab, setActiveTab] = useState('recommendations');
  const { toast } = useToast();
  
  const saveAnalysisMutation = useWizardAnalysisSave();

  // Process the analysis into structured format (use provided or generate)
  const structuredAnalysis = useMemo<ContextualAnalysisResult>(() => {
    if (providedStructuredAnalysis) {
      return providedStructuredAnalysis;
    }
    
    // Convert uploaded files to AnalysisAttachment format
    const attachments = processAttachments(stepData.uploadedFiles || []);
    
    return EnhancedContextualAnalysisProcessor.processAnalysisResponse(
      analysisResult,
      attachments,
      templateData?.category || 'analysis',
      stepData.projectName
    );
  }, [analysisResult, stepData, templateData, providedStructuredAnalysis]);

  const handleAttachmentClick = (attachment: AnalysisAttachment) => {
    setSelectedAttachment(attachment);
  };

  const handleSaveAnalysis = async () => {
    try {
      await saveAnalysisMutation.mutateAsync({
        stepData,
        analysisResults: { analysis: analysisResult },
        structuredAnalysis,
        confidenceScore: structuredAnalysis.metrics.averageConfidence / 100
      });
      
      toast({
        title: "Analysis Saved",
        description: "Your analysis has been successfully saved with enhanced file associations.",
      });
      
      // Call the original onSave if provided
      onSave?.();
    } catch (error) {
      console.error('Error saving analysis:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save analysis. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getFileRecommendationRelationships = () => {
    const relationships: { [fileId: string]: number } = {};
    
    structuredAnalysis.recommendations.forEach(rec => {
      rec.relatedAttachmentIds.forEach(attachmentId => {
        relationships[attachmentId] = (relationships[attachmentId] || 0) + 1;
      });
    });
    
    return relationships;
  };

  const fileRecommendationCounts = getFileRecommendationRelationships();

  // Calculate file association success rate
  const totalFiles = structuredAnalysis.attachments.length;
  const filesWithAssociations = Object.keys(fileRecommendationCounts).length;
  const associationSuccessRate = totalFiles > 0 ? Math.round((filesWithAssociations / totalFiles) * 100) : 0;

  return (
    <div className="w-full min-h-full">
      {/* Header with enhanced metrics */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <h2 className="text-3xl font-bold text-center">Analysis Complete</h2>
        </div>
        <p className="text-center text-muted-foreground">
          Your {templateData?.category || 'design'} analysis has been completed with {structuredAnalysis.recommendations.length} recommendations
        </p>
        
        {/* File Association Success Indicator */}
        {totalFiles > 0 && (
          <div className="text-center mt-2">
            <Badge 
              variant={associationSuccessRate >= 70 ? "default" : associationSuccessRate >= 40 ? "secondary" : "outline"}
              className="text-xs"
            >
              {associationSuccessRate}% file association success ({filesWithAssociations}/{totalFiles} files)
            </Badge>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button 
            variant="default" 
            onClick={handleSaveAnalysis}
            disabled={saveAnalysisMutation.isPending || isSaving}
          >
            {(saveAnalysisMutation.isPending || isSaving) ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {(saveAnalysisMutation.isPending || isSaving) ? 'Saving...' : 'Save Analysis'}
          </Button>
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
          <Button variant="outline" onClick={onShare}>
            <Share className="h-4 w-4 mr-2" />
            Share Analysis
          </Button>
        </div>

        {/* Analysis Summary with enhanced metrics */}
        <AnalysisSummary 
          metrics={{
            ...structuredAnalysis.metrics,
            fileAssociationRate: associationSuccessRate
          }}
          recommendations={structuredAnalysis.recommendations}
          className="mb-6"
        />

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Recommendations ({structuredAnalysis.recommendations.length})
            </TabsTrigger>
            <TabsTrigger value="attachments" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Files ({structuredAnalysis.attachments.length})
            </TabsTrigger>
            <TabsTrigger value="full-analysis" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Full Analysis
            </TabsTrigger>
            <TabsTrigger value="context" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Context
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-4">
            <div className="space-y-4">
              {structuredAnalysis.recommendations.length > 0 ? (
                structuredAnalysis.recommendations.map((recommendation) => (
                  <RecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                    attachments={structuredAnalysis.attachments}
                    onAttachmentClick={handleAttachmentClick}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      No structured recommendations found. View the full analysis for detailed insights.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveTab('full-analysis')}
                    >
                      View Full Analysis
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="attachments" className="space-y-4">
            {/* File Association Summary */}
            {totalFiles > 0 && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-base">File Association Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{totalFiles}</div>
                      <div className="text-xs text-muted-foreground">Total Files</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{filesWithAssociations}</div>
                      <div className="text-xs text-muted-foreground">With Recommendations</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {Object.values(fileRecommendationCounts).reduce((sum, count) => sum + count, 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">Total Associations</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">{associationSuccessRate}%</div>
                      <div className="text-xs text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {structuredAnalysis.attachments.length > 0 ? (
                structuredAnalysis.attachments.map((attachment) => (
                  <div key={attachment.id} className="relative">
                    <AttachmentReference
                      attachment={attachment}
                      onClick={() => handleAttachmentClick(attachment)}
                      size="medium"
                    />
                    {/* Enhanced File-Recommendation Relationship Indicator */}
                    {fileRecommendationCounts[attachment.id] && (
                      <div className="absolute -top-2 -right-2 flex gap-1">
                        <Badge 
                          variant="secondary" 
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1"
                        >
                          {fileRecommendationCounts[attachment.id]} rec{fileRecommendationCounts[attachment.id] !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    )}
                    {!fileRecommendationCounts[attachment.id] && (
                      <div className="absolute -top-2 -right-2">
                        <Badge variant="outline" className="text-xs px-2 py-1 bg-gray-50">
                          No links
                        </Badge>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-muted-foreground">No files were uploaded for this analysis.</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="full-analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Complete Analysis Results
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
          </TabsContent>

          <TabsContent value="context" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Context</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Project Details</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Project:</span> {stepData.projectName}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Analysis Type:</span> {templateData?.category || 'Analysis'}
                      </p>
                      {stepData.analysisGoals && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Goals:</span> {stepData.analysisGoals}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Completed:</span> {new Date(structuredAnalysis.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Analysis Summary</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Recommendations:</span> {structuredAnalysis.metrics.totalRecommendations}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">High Priority:</span> {structuredAnalysis.metrics.highPriorityCount}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Avg. Confidence:</span> {structuredAnalysis.metrics.averageConfidence}%
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Files Analyzed:</span> {structuredAnalysis.metrics.attachmentsAnalyzed}
                      </p>
                      {structuredAnalysis.metrics.estimatedImplementationTime && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Est. Implementation:</span> {structuredAnalysis.metrics.estimatedImplementationTime}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Files Analyzed with Relationship Indicators */}
                {stepData.uploadedFiles && stepData.uploadedFiles.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Files Analyzed</h4>
                    <div className="space-y-2">
                      {stepData.uploadedFiles.map((file, index) => {
                        const attachment = structuredAnalysis.attachments.find(att => att.name === file.name);
                        const relationshipCount = attachment ? fileRecommendationCounts[attachment.id] || 0 : 0;
                        
                        return (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <div className="flex items-center gap-2">
                              {relationshipCount > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {relationshipCount} recommendation{relationshipCount !== 1 ? 's' : ''}
                                </Badge>
                              )}
                              <span className="text-xs text-gray-500">
                                {Math.round(file.size / 1024)} KB
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Attachment Preview Modal (if selected) */}
      {selectedAttachment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{selectedAttachment.name}</h3>
                {fileRecommendationCounts[selectedAttachment.id] && (
                  <Badge variant="secondary" className="text-xs">
                    {fileRecommendationCounts[selectedAttachment.id]} related recommendation{fileRecommendationCounts[selectedAttachment.id] !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
              <Button variant="ghost" onClick={() => setSelectedAttachment(null)}>
                ×
              </Button>
            </div>
            <div className="p-4">
              {selectedAttachment.type === 'image' && selectedAttachment.url && (
                <img 
                  src={selectedAttachment.url} 
                  alt={selectedAttachment.name}
                  className="max-w-full h-auto"
                />
              )}
              {selectedAttachment.type === 'url' && (
                <div className="space-y-4">
                  <p><strong>URL:</strong> {selectedAttachment.url}</p>
                  <p><strong>Domain:</strong> {selectedAttachment.metadata?.domain}</p>
                  <Button
                    onClick={() => window.open(selectedAttachment.url, '_blank')}
                    className="w-full"
                  >
                    Open Website
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
