
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileImage, Eye, RotateCcw, BarChart3 } from 'lucide-react';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useDesignUseCases } from '@/hooks/useDesignUseCases';
import { useDesignBatchAnalyses } from '@/hooks/useDesignBatchAnalyses';
import { useAnalyzeDesign } from '@/hooks/useAnalyzeDesign';
import { DesignUpload, DesignBatchAnalysis } from '@/types/design';
import { formatDistanceToNow } from 'date-fns';
import { BatchAnalysisCard } from './BatchAnalysisCard';
import { BatchAnalysisViewer } from './BatchAnalysisViewer';

interface DesignListProps {
  onViewAnalysis: (upload: DesignUpload) => void;
}

export const DesignList = ({ onViewAnalysis }: DesignListProps) => {
  const { data: uploads = [], isLoading } = useDesignUploads();
  const { data: useCases = [] } = useDesignUseCases();
  const { data: batchAnalyses = [] } = useDesignBatchAnalyses();
  const analyzeDesign = useAnalyzeDesign();
  const [selectedBatchAnalysis, setSelectedBatchAnalysis] = useState<DesignBatchAnalysis | null>(null);

  const getUseCaseName = (useCaseId: string) => {
    const useCase = useCases.find(uc => uc.id === useCaseId);
    return useCase?.name || 'Unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'processing': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const handleReanalyze = async (upload: DesignUpload) => {
    const useCase = useCases.find(uc => uc.id === upload.use_case);
    if (!useCase) return;

    await analyzeDesign.mutateAsync({
      uploadId: upload.id,
      useCase
    });
  };

  const handleViewBatchAnalysis = (batchId: string) => {
    const batchAnalysis = batchAnalyses.find(analysis => analysis.batch_id === batchId);
    if (batchAnalysis) {
      setSelectedBatchAnalysis(batchAnalysis);
    }
  };

  // Group uploads by batch_id
  const groupedUploads = uploads.reduce((groups, upload) => {
    const key = upload.batch_id || 'individual';
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(upload);
    return groups;
  }, {} as Record<string, DesignUpload[]>);

  // Separate batches from individual uploads
  const batchGroups = Object.entries(groupedUploads).filter(([key]) => key !== 'individual');
  const individualUploads = groupedUploads['individual'] || [];

  if (selectedBatchAnalysis) {
    return (
      <BatchAnalysisViewer
        batchAnalysis={selectedBatchAnalysis}
        onBack={() => setSelectedBatchAnalysis(null)}
      />
    );
  }

  if (isLoading) {
    return <div>Loading uploads...</div>;
  }

  if (uploads.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <FileImage className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No designs uploaded yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="batches" className="w-full">
        <TabsList>
          <TabsTrigger value="batches" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Batch Analysis ({batchGroups.length})
          </TabsTrigger>
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <FileImage className="h-4 w-4" />
            Individual Uploads ({individualUploads.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="batches" className="mt-6">
          {batchGroups.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No batch uploads yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload multiple designs together to enable comparative analysis
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {batchGroups.map(([batchId, batchUploads]) => (
                <BatchAnalysisCard
                  key={batchId}
                  batchId={batchId}
                  batchName={batchUploads[0]?.batch_name}
                  uploads={batchUploads}
                  onViewBatchAnalysis={handleViewBatchAnalysis}
                  onViewIndividualAnalysis={onViewAnalysis}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="individual" className="mt-6">
          {individualUploads.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <FileImage className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No individual uploads yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {individualUploads.map((upload) => (
                <Card key={upload.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{upload.file_name}</CardTitle>
                        <CardDescription>
                          {getUseCaseName(upload.use_case)} • {formatDistanceToNow(new Date(upload.created_at))} ago
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusColor(upload.status)}>
                        {upload.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {upload.file_size ? `${(upload.file_size / 1024 / 1024).toFixed(2)} MB` : 'URL'} • {upload.file_type || 'Website'}
                      </div>
                      <div className="flex gap-2">
                        {upload.status === 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewAnalysis(upload)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Analysis
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReanalyze(upload)}
                          disabled={upload.status === 'processing' || analyzeDesign.isPending}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Re-analyze
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
