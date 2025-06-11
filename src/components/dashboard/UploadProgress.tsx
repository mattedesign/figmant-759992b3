
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { useDesignUploads } from '@/hooks/useDesignAnalysis';
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

  const recentUploads = uploads.slice(0, 5);

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

  const getProgress = (status: string) => {
    switch (status) {
      case 'completed': return 100;
      case 'processing': return 65;
      case 'failed': return 100;
      default: return 25;
    }
  };

  if (recentUploads.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upload Progress</CardTitle>
          <CardDescription>Track your recent uploads and analysis progress</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No uploads yet. Upload a design to get started!
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
      <CardContent className="space-y-4">
        {recentUploads.map((upload) => (
          <div key={upload.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(upload.status)}
                <span className="font-medium text-sm truncate">{upload.file_name}</span>
              </div>
              <Badge variant="outline" className={getStatusColor(upload.status)}>
                {upload.status}
              </Badge>
            </div>
            
            <Progress value={getProgress(upload.status)} className="h-2" />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatDistanceToNow(new Date(upload.created_at))} ago</span>
              <span>{(upload.file_size / 1024 / 1024).toFixed(2)} MB</span>
            </div>

            {upload.status === 'processing' && (
              <p className="text-xs text-blue-600">
                🧠 Analyzing with Claude AI...
              </p>
            )}
            
            {upload.status === 'failed' && (
              <p className="text-xs text-red-600">
                ❌ Analysis failed. Try re-analyzing from the History tab.
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
