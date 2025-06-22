
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  Filter
} from 'lucide-react';
import { StepData } from '../types';
import { ContextualAnalysisResult } from '@/types/contextualAnalysis';
import { AnalysisSummary } from '@/components/figmant/analysis/AnalysisSummary';
import { RecommendationCard } from '@/components/figmant/analysis/RecommendationCard';
import { AttachmentCard } from '@/components/figmant/analysis/AttachmentCard';

interface EnhancedAnalysisResultsViewerProps {
  stepData: StepData;
  analysisResult: string;
  templateData?: any;
  structuredAnalysis?: ContextualAnalysisResult;
}

export const EnhancedAnalysisResultsViewer: React.FC<EnhancedAnalysisResultsViewerProps> = ({
  stepData,
  analysisResult,
  templateData,
  structuredAnalysis
}) => {
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter recommendations based on selected filters
  const filteredRecommendations = structuredAnalysis?.recommendations.filter(rec => {
    const priorityMatch = selectedPriority === 'all' || rec.priority === selectedPriority;
    const categoryMatch = selectedCategory === 'all' || rec.category === selectedCategory;
    return priorityMatch && categoryMatch;
  }) || [];

  const categories = structuredAnalysis ? 
    ['all', ...new Set(structuredAnalysis.recommendations.map(r => r.category))] : ['all'];

  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analysis Complete</h1>
              <p className="text-gray-600">
                {templateData?.category || 'Premium'} analysis for {stepData.projectName}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            {templateData?.category?.toUpperCase() || 'ANALYSIS'}
          </Badge>
          <Badge variant="outline">Claude AI Powered</Badge>
          {stepData.uploadedFiles && stepData.uploadedFiles.length > 0 && (
            <Badge variant="outline">
              {stepData.uploadedFiles.length} file{stepData.uploadedFiles.length !== 1 ? 's' : ''} analyzed
            </Badge>
          )}
          {structuredAnalysis && (
            <Badge variant="outline">
              {structuredAnalysis.recommendations.length} recommendations
            </Badge>
          )}
        </div>
      </div>

      {/* Analysis Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Files
          </TabsTrigger>
          <TabsTrigger value="raw" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Raw Analysis
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {structuredAnalysis && (
            <AnalysisSummary
              metrics={structuredAnalysis.metrics}
              recommendations={structuredAnalysis.recommendations}
            />
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {structuredAnalysis?.metrics.highPriorityCount || 0}
                    </p>
                    <p className="text-sm text-gray-600">High Priority Items</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {structuredAnalysis?.metrics.averageConfidence || 0}%
                    </p>
                    <p className="text-sm text-gray-600">Avg. Confidence</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {structuredAnalysis?.attachments.length || 0}
                    </p>
                    <p className="text-sm text-gray-600">Files Analyzed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {/* Priority Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Priority:</span>
                  {(['all', 'high', 'medium', 'low'] as const).map(priority => (
                    <Button
                      key={priority}
                      variant={selectedPriority === priority ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPriority(priority)}
                      className={selectedPriority === priority && priority !== 'all' ? priorityColors[priority] : ''}
                    >
                      {priority === 'all' ? 'All' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Button>
                  ))}
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Category:</span>
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category === 'all' ? 'All' : category.replace('_', ' ')}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations List */}
          <div className="space-y-4">
            {filteredRecommendations.length > 0 ? (
              filteredRecommendations.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  attachments={structuredAnalysis?.attachments || []}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No recommendations match the selected filters.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Files Tab */}
        <TabsContent value="files" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {structuredAnalysis?.attachments.map((attachment) => (
              <AttachmentCard key={attachment.id} attachment={attachment} />
            )) || (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No files were analyzed.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Raw Analysis Tab */}
        <TabsContent value="raw" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Raw Analysis Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-mono text-sm bg-gray-50 p-4 rounded-lg">
                  {analysisResult}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
