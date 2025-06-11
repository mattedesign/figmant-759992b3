
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RefreshCw, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageProcessingError {
  id: string;
  fileName: string;
  fileSize: number;
  errorCode: string;
  errorMessage: string;
  timestamp: Date;
  processingStage: 'validation' | 'compression' | 'upload' | 'storage';
  retryCount: number;
  deviceInfo?: {
    userAgent: string;
    memoryInfo?: any;
  };
}

interface ImageProcessingErrorReportProps {
  error: ImageProcessingError;
  onRetry: (errorId: string) => void;
  onDismiss: (errorId: string) => void;
  isRetrying?: boolean;
}

export const ImageProcessingErrorReport: React.FC<ImageProcessingErrorReportProps> = ({
  error,
  onRetry,
  onDismiss,
  isRetrying = false
}) => {
  const { toast } = useToast();

  const copyErrorDetails = () => {
    const errorDetails = `
Image Processing Error Report
============================
File: ${error.fileName}
Size: ${(error.fileSize / 1024 / 1024).toFixed(2)}MB
Error Code: ${error.errorCode}
Message: ${error.errorMessage}
Stage: ${error.processingStage}
Timestamp: ${error.timestamp.toISOString()}
Retry Count: ${error.retryCount}
User Agent: ${error.deviceInfo?.userAgent || 'Unknown'}
    `.trim();

    navigator.clipboard.writeText(errorDetails);
    toast({
      title: "Error Details Copied",
      description: "Error report has been copied to clipboard for support.",
    });
  };

  const getErrorSeverity = () => {
    if (error.retryCount >= 3) return 'critical';
    if (error.processingStage === 'upload') return 'high';
    return 'medium';
  };

  const getSeverityColor = () => {
    const severity = getErrorSeverity();
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getRecommendation = () => {
    switch (error.errorCode) {
      case 'FILE_TOO_LARGE':
        return 'Try reducing the image size or using a different compression tool.';
      case 'INVALID_FORMAT':
        return 'Please use a supported format: JPEG, PNG, WebP, or GIF.';
      case 'COMPRESSION_FAILED':
        return 'The image may be corrupted. Try using a different image.';
      case 'UPLOAD_TIMEOUT':
        return 'Check your internet connection and try again.';
      case 'STORAGE_QUOTA_EXCEEDED':
        return 'Storage quota exceeded. Please contact support.';
      default:
        return 'Please try again or contact support if the issue persists.';
    }
  };

  return (
    <Card className="border-destructive/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            Image Processing Error
          </CardTitle>
          <Badge className={getSeverityColor()}>
            {getErrorSeverity().toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            <div className="space-y-2">
              <p><strong>File:</strong> {error.fileName}</p>
              <p><strong>Error:</strong> {error.errorMessage}</p>
              <p><strong>Stage:</strong> {error.processingStage}</p>
              {error.retryCount > 0 && (
                <p><strong>Attempts:</strong> {error.retryCount + 1}</p>
              )}
            </div>
          </AlertDescription>
        </Alert>

        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Recommendation:</strong> {getRecommendation()}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => onRetry(error.id)}
            disabled={isRetrying || error.retryCount >= 3}
            size="sm"
            className="flex items-center gap-2"
          >
            {isRetrying ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="h-3 w-3" />
                {error.retryCount >= 3 ? 'Max Retries Reached' : 'Retry'}
              </>
            )}
          </Button>
          
          <Button
            onClick={copyErrorDetails}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Copy className="h-3 w-3" />
            Copy Details
          </Button>
          
          <Button
            onClick={() => onDismiss(error.id)}
            variant="ghost"
            size="sm"
          >
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
