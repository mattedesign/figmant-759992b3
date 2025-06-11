
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileImage, Eye, RotateCcw } from 'lucide-react';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useDesignUseCases } from '@/hooks/useDesignUseCases';
import { useAnalyzeDesign } from '@/hooks/useAnalyzeDesign';
import { DesignUpload } from '@/types/design';
import { formatDistanceToNow } from 'date-fns';

interface DesignListProps {
  onViewAnalysis: (upload: DesignUpload) => void;
}

export const DesignList = ({ onViewAnalysis }: DesignListProps) => {
  const { data: uploads = [], isLoading } = useDesignUploads();
  const { data: useCases = [] } = useDesignUseCases();
  const analyzeDesign = useAnalyzeDesign();

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
    <div className="space-y-4">
      {uploads.map((upload) => (
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
                {(upload.file_size / 1024 / 1024).toFixed(2)} MB • {upload.file_type}
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
  );
};
