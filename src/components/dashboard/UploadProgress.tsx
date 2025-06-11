
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertCircle, Loader2, Globe, FileImage, Layers } from 'lucide-react';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { formatDistanceToNow } from 'date-fns';

export const UploadProgress = () => {
  const { data: uploads = [], refetch } = useDesignUploads();

  // Auto-refresh every 10 seconds to check for status updates
  useEffect(() => {
    const interval = setInterval(() => {
      const hasProcessing = uploads.some(upload => upload.status === 'processing');
      if (hasProcessing) {
        console.log('Refreshing uploads to check for status updates...');
        refetch();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [uploads, refetch]);

  // Group uploads by batch
  const batches = uploads.reduce((acc, upload) => {
    const key = upload.batch_id || upload.id;
    if (!acc[key]) {
      acc[key] = {
        batch_id: upload.batch_id,
        batch_name: upload.batch_name,
        uploads: [],
        created_at: upload.created_at
      };
    }
    acc[key].uploads.push(upload);
    return acc;
  }, {} as Record<string, any>);

  const recentBatches = Object.values(batches).slice(0, 5);

  const getSourceIcon = (upload: any) => {
    return upload.source_type === 'url' ? 
      <Globe className="h-3 w-3" /> : 
      <FileImage className="h-3 w-3" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getBatchProgress = (uploads: any[]) => {
    const completed = uploads.filter(u => u.status === 'completed').length;
    const failed = uploads.filter(u => u.status === 'failed').length;
    const total = uploads.length;
    
    if (failed > 0 && completed + failed === total) return 100; // All done with some failures
    if (completed === total) return 100; // All completed
    if (uploads.some(u => u.status === 'processing')) return 65; // In progress
    return 25; // Pending
  };

  const getBatchStatus = (uploads: any[]) => {
    const statuses = uploads.map(u => u.status);
    if (statuses.every(s => s === 'completed')) return 'completed';
    if (statuses.some(s => s === 'processing')) return 'processing';
    if (statuses.some(s => s === 'failed')) return 'failed';
    return 'pending';
  };

  if (recentBatches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upload Progress</CardTitle>
          <CardDescription>Track your recent uploads and analysis progress</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No uploads yet. Upload designs or URLs to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Progress</CardTitle>
        <CardDescription>Track your recent uploads and analysis progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {recentBatches.map((batch) => {
          const batchStatus = getBatchStatus(batch.uploads);
          const progress = getBatchProgress(batch.uploads);
          const isBatch = batch.uploads.length > 1;
          
          return (
            <div key={batch.batch_id || batch.uploads[0].id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isBatch ? <Layers className="h-4 w-4" /> : getSourceIcon(batch.uploads[0])}
                  <span className="font-medium text-sm">
                    {batch.batch_name || batch.uploads[0].file_name}
                  </span>
                  {isBatch && (
                    <Badge variant="outline" className="text-xs">
                      {batch.uploads.length} items
                    </Badge>
                  )}
                </div>
                <Badge variant="outline" className={getStatusColor(batchStatus)}>
                  {batchStatus}
                </Badge>
              </div>
              
              <Progress value={progress} className="h-2" />
              
              {isBatch && (
                <div className="flex flex-wrap gap-1">
                  {batch.uploads.map((upload: any, index: number) => (
                    <div key={upload.id} className="flex items-center gap-1 text-xs">
                      {getSourceIcon(upload)}
                      <span className="truncate max-w-20">
                        {upload.source_type === 'url' 
                          ? new URL(upload.source_url).hostname 
                          : upload.file_name
                        }
                      </span>
                      {getStatusIcon(upload.status)}
                      {index < batch.uploads.length - 1 && <span className="text-muted-foreground">•</span>}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatDistanceToNow(new Date(batch.created_at))} ago</span>
                {!isBatch && batch.uploads[0].file_size && (
                  <span>{(batch.uploads[0].file_size / 1024 / 1024).toFixed(2)} MB</span>
                )}
              </div>

              {batchStatus === 'processing' && (
                <p className="text-xs text-blue-600">
                  🧠 Analyzing with Claude AI...
                </p>
              )}
              
              {batchStatus === 'failed' && (
                <p className="text-xs text-red-600">
                  ❌ Analysis failed. Try re-analyzing from the History tab.
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
