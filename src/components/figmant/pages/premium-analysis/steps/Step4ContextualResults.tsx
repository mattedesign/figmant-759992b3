
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Share, Bookmark } from 'lucide-react';
import { StepProps } from '../types';
import { 
  processAttachments, 
  processAnalysisWithAttachmentContext, 
  calculateSummaryMetrics 
} from '@/utils/contextualAnalysisProcessor';
import { AnalysisAttachment } from '@/types/contextualAnalysis';

export const Step4ContextualResults: React.FC<StepProps> = ({
  stepData,
  setStepData,
  currentStep,
  totalSteps,
  onPreviousStep
}) => {
  const [selectedAttachment, setSelectedAttachment] = useState<AnalysisAttachment | null>(null);

  // Process the uploaded attachments into standardized format
  const processedAttachments = processAttachments([
    ...(stepData.uploadedFiles || []).map((file, index) => ({
      id: `file-${index}`,
      name: file.name,
      file: file,
      type: file.type,
      uploadPath: `uploads/${file.name}`
    })),
    ...(stepData.referenceLinks || []).filter(link => link.trim()).map((url, index) => ({
      id: `url-${index}`,
      name: new URL(url).hostname,
      url: url,
      type: 'url'
    }))
  ]);

  // Mock analysis response for demonstration
  const mockAnalysisResponse = `
# UX Analysis Results

## High Priority: Improve Call-to-Action Visibility
The primary CTA button lacks sufficient contrast and visual hierarchy. Users may struggle to identify the main action on the page, potentially reducing conversion rates.

## Medium Priority: Optimize Mobile Navigation
The navigation menu on mobile devices appears cluttered and may benefit from a simplified hamburger menu approach for better usability.

## High Priority: Enhance Accessibility Compliance
Several accessibility issues were identified, including insufficient color contrast ratios and missing alt text for images.

## Low Priority: Refine Typography Hierarchy
The text hierarchy could be improved with better font sizing and spacing to enhance readability and visual flow.

## Medium Priority: Streamline Content Layout
Consider reorganizing content sections to follow a more logical information hierarchy and reduce cognitive load.
  `;

  // Process the analysis to extract structured recommendations
  const recommendations = processAnalysisWithAttachmentContext(mockAnalysisResponse, processedAttachments);
  const metrics = calculateSummaryMetrics(recommendations, processedAttachments);

  const handleAttachmentClick = (attachment: AnalysisAttachment) => {
    setSelectedAttachment(attachment);
    // In a real implementation, this would open a modal or detail view
    console.log('Viewing attachment:', attachment);
  };

  const filterRecommendationsByPriority = (priority: string) => {
    return recommendations.filter(rec => rec.priority === priority);
  };

  const exportAnalysis = () => {
    // Implementation for exporting analysis results
    console.log('Exporting analysis...');
  };

  return (
    <div className="w-full min-h-full">
      <div className="w-full">
        <h2 className="text-3xl font-bold text-center mb-4">Context-Aware Analysis Results</h2>
        <p className="text-center text-gray-600 mb-8">
          Your analysis is complete with {recommendations.length} recommendations linked to {processedAttachments.length} files
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Executive Summary */}
        <AnalysisSummary 
          metrics={metrics}
          recommendations={recommendations}
        />

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={exportAnalysis} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Share className="h-4 w-4" />
            Share Results
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Save Analysis
          </Button>
        </div>

        {/* Recommendations with Filters */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              All ({recommendations.length})
            </TabsTrigger>
            <TabsTrigger value="high">
              High Priority ({filterRecommendationsByPriority('high').length})
            </TabsTrigger>
            <TabsTrigger value="medium">
              Medium Priority ({filterRecommendationsByPriority('medium').length})
            </TabsTrigger>
            <TabsTrigger value="low">
              Low Priority ({filterRecommendationsByPriority('low').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {recommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                attachments={processedAttachments}
                onAttachmentClick={handleAttachmentClick}
              />
            ))}
          </TabsContent>

          <TabsContent value="high" className="space-y-4 mt-6">
            {filterRecommendationsByPriority('high').map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                attachments={processedAttachments}
                onAttachmentClick={handleAttachmentClick}
              />
            ))}
          </TabsContent>

          <TabsContent value="medium" className="space-y-4 mt-6">
            {filterRecommendationsByPriority('medium').map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                attachments={processedAttachments}
                onAttachmentClick={handleAttachmentClick}
              />
            ))}
          </TabsContent>

          <TabsContent value="low" className="space-y-4 mt-6">
            {filterRecommendationsByPriority('low').map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                attachments={processedAttachments}
                onAttachmentClick={handleAttachmentClick}
              />
            ))}
          </TabsContent>
        </Tabs>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onPreviousStep}>
            Previous
          </Button>
          <Button onClick={() => console.log('Analysis complete!')}>
            Start New Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};
