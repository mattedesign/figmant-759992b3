import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, Users, BarChart3, Target, Settings, History, RefreshCw } from 'lucide-react';
import { DesignBatchAnalysis, DesignUpload } from '@/types/design';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useBatchModifications } from '@/hooks/useBatchModifications';
import { BatchModificationDialog } from './BatchModificationDialog';
import { BatchVersionHistory } from './BatchVersionHistory';
import { ContinueAnalysisUploader } from './ContinueAnalysisUploader';
import { formatDistanceToNow } from 'date-fns';

interface EnhancedBatchAnalysisViewerProps {
  batchAnalysis: DesignBatchAnalysis;
  onBack: () => void;
}

export const EnhancedBatchAnalysisViewer = ({ batchAnalysis, onBack }: EnhancedBatchAnalysisViewerProps) => {
  const { data: allUploads = [] } = useDesignUploads();
  const { modificationHistory, createBatchModification, isCreatingModification } = useBatchModifications(batchAnalysis.batch_id);
  const [showModificationDialog, setShowModificationDialog] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<DesignBatchAnalysis>(batchAnalysis);
  const [activeTab, setActiveTab] = useState('results');
  
  const batchUploads = allUploads.filter(upload => upload.batch_id === batchAnalysis.batch_id);
  const analysisResults = selectedVersion.analysis_results?.response || 'No analysis results available.';

  const handleModification = async (modifications: {
    newFiles: File[];
    replacements: Record<string, File>;
    modificationSummary: string;
  }) => {
    try {
      // Create upload objects for new files and replacements
      const newUploads = [
        // New files
        ...modifications.newFiles.map(file => ({
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          use_case: batchUploads[0]?.use_case || '',
          batch_name: `${batchUploads[0]?.batch_name || 'Batch'} - Modified`
        })),
        // Replacement files
        ...Object.entries(modifications.replacements).map(([originalUploadId, file]) => ({
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          use_case: batchUploads[0]?.use_case || '',
          batch_name: `${batchUploads[0]?.batch_name || 'Batch'} - Modified`,
          replaced_upload_id: originalUploadId
        }))
      ];

      await createBatchModification.mutateAsync({
        originalBatchId: batchAnalysis.batch_id,
        newUploads,
        replacementMap: Object.fromEntries(
          Object.entries(modifications.replacements).map(([oldId, file]) => [oldId, file.name])
        ),
        modificationSummary: modifications.modificationSummary
      });

      setShowModificationDialog(false);
    } catch (error) {
      console.error('Failed to create batch modification:', error);
    }
  };

  const handleContinueAnalysisStarted = () => {
    setActiveTab('continue');
  };

  return (
    <div className="space-y-6">
      {/* Header with breadcrumb */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="text-sm text-muted-foreground">
          Dashboard → Batch Analysis
        </div>
      </div>

      {/* Enhanced Batch Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Batch Comparative Analysis
                {modificationHistory.length > 1 && (
                  <Badge variant="outline">
                    v{selectedVersion.version_number}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Analysis of {batchUploads.length} designs • {formatDistanceToNow(new Date(selectedVersion.created_at))} ago
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowModificationDialog(true)}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Modify & Re-run
              </Button>
              <Badge variant="default" className="bg-blue-100 text-blue-800">
                {selectedVersion.analysis_type}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Designs Analyzed</p>
                <p className="text-2xl font-bold">{batchUploads.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Confidence Score</p>
                <p className="text-2xl font-bold">{Math.round(selectedVersion.confidence_score * 100)}%</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <History className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Versions</p>
                <p className="text-2xl font-bold">{modificationHistory.length}</p>
              </div>
            </div>
          </div>

          {selectedVersion.context_summary && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <p className="text-sm font-medium text-blue-800 mb-1">Context Enhanced Analysis</p>
              <p className="text-sm text-blue-700">{selectedVersion.context_summary}</p>
            </div>
          )}

          {selectedVersion.modification_summary && (
            <div className="mb-4 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
              <p className="text-sm font-medium text-amber-800 mb-1">Modifications in This Version</p>
              <p className="text-sm text-amber-700">{selectedVersion.modification_summary}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Continue Analysis Section */}
      <ContinueAnalysisUploader 
        batchAnalysis={selectedVersion}
        onAnalysisStarted={handleContinueAnalysisStarted}
      />

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="results">Analysis Results</TabsTrigger>
          <TabsTrigger value="designs">Designs ({batchUploads.length})</TabsTrigger>
          <TabsTrigger value="history">
            Version History ({modificationHistory.length})
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="continue">Continue Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Comparative Analysis Results</CardTitle>
              <CardDescription>
                AI-powered insights comparing all designs in this batch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed bg-muted/30 p-4 rounded-lg">
                  {analysisResults}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="designs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyzed Designs</CardTitle>
              <CardDescription>Individual designs included in this batch analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {batchUploads.map((upload, index) => (
                  <div key={upload.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{upload.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {upload.source_type === 'file' ? 'File Upload' : 'URL Analysis'}
                      </p>
                    </div>
                    <Badge variant={upload.status === 'completed' ? 'default' : 'secondary'}>
                      {upload.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <BatchVersionHistory
            versions={modificationHistory}
            onViewVersion={setSelectedVersion}
            currentVersionId={selectedVersion.id}
          />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          {selectedVersion.analysis_settings && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Analysis Configuration
                </CardTitle>
                <CardDescription>Settings used for this batch analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Uploads Count</p>
                    <p>{selectedVersion.analysis_settings.uploads_count}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Context Files</p>
                    <p>{selectedVersion.analysis_settings.context_files_count || 0}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Analysis Depth</p>
                    <p className="capitalize">{selectedVersion.analysis_settings.analysis_depth || 'detailed'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="continue" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Continue Analysis</CardTitle>
              <CardDescription>
                Add more screenshots to extend your batch analysis with additional insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContinueAnalysisUploader 
                batchAnalysis={selectedVersion}
                onAnalysisStarted={handleContinueAnalysisStarted}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modification Dialog */}
      <BatchModificationDialog
        open={showModificationDialog}
        onOpenChange={setShowModificationDialog}
        originalUploads={batchUploads}
        onSubmit={handleModification}
        isLoading={isCreatingModification}
      />
    </div>
  );
};
