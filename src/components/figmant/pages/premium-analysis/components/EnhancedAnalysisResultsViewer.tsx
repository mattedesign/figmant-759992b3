
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Download, Share, Bookmark, FileText, BarChart3, Eye } from 'lucide-react';
import { StepData } from '../types';
import { RecommendationCard } from '@/components/figmant/analysis/RecommendationCard';
import { AnalysisSummary } from '@/components/figmant/analysis/AnalysisSummary';
import { AttachmentReference } from '@/components/figmant/analysis/AttachmentReference';
import { EnhancedContextualAnalysisProcessor } from '@/utils/enhancedContextualAnalysisProcessor';
import { processAttachments } from '@/utils/contextualAnalysisProcessor';
import { ContextualAnalysisResult, AnalysisAttachment } from '@/types/contextualAnalysis';

interface EnhancedAnalysisResultsViewerProps {
  stepData: StepData;
  analysisResult: string;
  templateData?: any;
  onExport?: () => void;
  onShare?: () => void;
  onSave?: () => void;
}

export const EnhancedAnalysisResultsViewer: React.FC<EnhancedAnalysisResultsViewerProps> = ({
  stepData,
  analysisResult,
  templateData,
  onExport,
  onShare,
  onSave
}) => {
  const [selectedAttachment, setSelectedAttachment] = useState<AnalysisAttachment | null>(null);
  const [activeTab, setActiveTab] = useState('recommendations');

  // Process the analysis into structured format
  const structuredAnalysis = useMemo<ContextualAnalysisResult>(() => {
    // Convert uploaded files to AnalysisAttachment format
    const attachments = processAttachments(stepData.uploadedFiles || []);
    
    return EnhancedContextualAnalysisProcessor.processAnalysisResponse(
      analysisResult,
      attachments,
      templateData?.category || 'analysis',
      stepData.projectName
    );
  }, [analysisResult, stepData, templateData]);

  const handleAttachmentClick = (attachment: AnalysisAttachment) => {
    setSelectedAttachment(attachment);
  };

  return (
    <div className="w-full min-h-full">
      {/* Header */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <h2 className="text-3xl font-bold text-center">Analysis Complete</h2>
        </div>
        <p className="text-center text-muted-foreground">
          Your {templateData?.category || 'design'} analysis has been completed with {structuredAnalysis.recommendations.length} recommendations
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
          <Button variant="outline" onClick={onShare}>
            <Share className="h-4 w-4 mr-2" />
            Share Analysis
          </Button>
          <Button variant="outline" onClick={onSave}>
            <Bookmark className="h-4 w-4 mr-2" />
            Save for Later
          </Button>
        </div>

        {/* Analysis Summary */}
        <AnalysisSummary 
          metrics={structuredAnalysis.metrics}
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
                    <p className="text-muted-foreground">
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {structuredAnalysis.attachments.length > 0 ? (
                structuredAnalysis.attachments.map((attachment) => (
                  <AttachmentReference
                    key={attachment.id}
                    attachment={attachment}
                    onClick={() => handleAttachmentClick(attachment)}
                    size="medium"
                  />
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

                {/* Files Analyzed */}
                {stepData.uploadedFiles && stepData.uploadedFiles.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Files Analyzed</h4>
                    <div className="space-y-2">
                      {stepData.uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            {Math.round(file.size / 1024)} KB
                          </span>
                        </div>
                      ))}
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
              <h3 className="text-lg font-semibold">{selectedAttachment.name}</h3>
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
