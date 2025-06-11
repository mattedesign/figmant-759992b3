
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Upload, History, MessageSquare, BarChart3, ArrowLeft } from 'lucide-react';
import { EnhancedDesignUploader } from './EnhancedDesignUploader';
import { DesignList } from './DesignList';
import { AnalysisViewer } from './AnalysisViewer';
import { DesignChatInterface } from './DesignChatInterface';
import { EnhancedBatchAnalysisViewer } from './EnhancedBatchAnalysisViewer';
import { BatchAnalysisViewer } from './BatchAnalysisViewer';
import { useDesignBatchAnalyses } from '@/hooks/useDesignBatchAnalyses';
import { DesignUpload, DesignBatchAnalysis } from '@/types/design';

export const AdvancedDesignAnalysisPage = () => {
  const [selectedUpload, setSelectedUpload] = useState<DesignUpload | null>(null);
  const [selectedBatchAnalysis, setSelectedBatchAnalysis] = useState<DesignBatchAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState('upload');
  const { data: batchAnalyses = [] } = useDesignBatchAnalyses();

  const handleViewUpload = (upload: DesignUpload) => {
    setSelectedUpload(upload);
    setSelectedBatchAnalysis(null);
  };

  const handleViewBatchAnalysis = (batch: DesignBatchAnalysis) => {
    setSelectedBatchAnalysis(batch);
    setSelectedUpload(null);
  };

  const handleBack = () => {
    setSelectedUpload(null);
    setSelectedBatchAnalysis(null);
  };

  // If viewing a specific upload analysis
  if (selectedUpload) {
    return (
      <AnalysisViewer
        upload={selectedUpload}
        onBack={handleBack}
      />
    );
  }

  // If viewing a batch analysis
  if (selectedBatchAnalysis) {
    return (
      <EnhancedBatchAnalysisViewer
        batchAnalysis={selectedBatchAnalysis}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          Advanced Design Analysis
        </h1>
        <p className="text-muted-foreground">
          Upload multiple designs, analyze websites, chat with AI, and get comprehensive insights to improve user experience and conversion rates
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Enhanced Upload
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            AI Chat Analysis
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Analysis History
          </TabsTrigger>
          <TabsTrigger value="batch" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Batch Analyses
            {batchAnalyses.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {batchAnalyses.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <EnhancedDesignUploader />
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <Card className="h-[800px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                AI Design Analysis Chat
              </CardTitle>
              <CardDescription>
                Upload designs or share URLs, then chat with our AI to get instant insights and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full p-0">
              <DesignChatInterface 
                onViewUpload={handleViewUpload}
                onViewBatchAnalysis={handleViewBatchAnalysis}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Individual Design History
              </CardTitle>
              <CardDescription>
                View and manage your uploaded designs and their individual analyses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DesignList onViewAnalysis={handleViewUpload} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batch" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Batch Comparative Analyses
              </CardTitle>
              <CardDescription>
                View comprehensive comparative analyses of multiple designs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {batchAnalyses.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Batch Analyses Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload multiple designs to generate comparative analyses
                  </p>
                  <Button onClick={() => setActiveTab('upload')}>
                    Start Batch Upload
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {batchAnalyses.map((analysis) => (
                    <div
                      key={analysis.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleViewBatchAnalysis(analysis)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">
                            Batch Analysis #{analysis.version_number || 1}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {analysis.analysis_type} • {new Date(analysis.created_at).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              Confidence: {Math.round(analysis.confidence_score * 100)}%
                            </Badge>
                            {analysis.context_summary && (
                              <Badge variant="secondary">Context Enhanced</Badge>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Analysis
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
