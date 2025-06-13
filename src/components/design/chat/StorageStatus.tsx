
import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, RefreshCw, Info, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { verifyStorageAccess } from '@/utils/storage/storageVerification';
import { useToast } from '@/hooks/use-toast';

interface StorageStatusProps {
  status: 'checking' | 'ready' | 'error';
  onStatusChange?: (status: 'checking' | 'ready' | 'error') => void;
  errorDetails?: any;
}

export const StorageStatus: React.FC<StorageStatusProps> = ({ 
  status, 
  onStatusChange,
  errorDetails 
}) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  const retryStorageCheck = async () => {
    setIsRetrying(true);
    onStatusChange?.('checking');

    try {
      console.log('Retrying simplified storage verification...');
      
      const result = await verifyStorageAccess();
      
      if (result.success) {
        console.log('Storage verification successful on retry');
        onStatusChange?.('ready');
        
        toast({
          title: "Storage Ready",
          description: "File upload functionality is now available.",
        });
      } else {
        console.error('Storage verification failed on retry:', result);
        onStatusChange?.('error');
        
        toast({
          variant: "destructive",
          title: "Storage Still Unavailable",
          description: result.error || 'Storage verification failed',
        });
      }

    } catch (error) {
      console.error('Retry failed with unexpected error:', error);
      onStatusChange?.('error');
      
      toast({
        variant: "destructive",
        title: "Retry Failed",
        description: 'An unexpected error occurred during retry',
      });
    } finally {
      setIsRetrying(false);
    }
  };

  if (status === 'checking') {
    return (
      <div className="flex items-center gap-2 text-sm text-blue-600 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <Clock className="h-4 w-4 animate-pulse" />
        <span>Verifying storage access...</span>
      </div>
    );
  }
  
  if (status === 'error') {
    return (
      <div className="mb-4 space-y-3">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div className="flex-1">
              <span className="font-medium">File uploads unavailable</span>
              <br />
              <span className="text-sm">
                {errorDetails?.step === 'bucket_access' 
                  ? 'Storage bucket not accessible'
                  : 'Storage configuration issue detected'
                }
              </span>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDetails(!showDetails)}
              >
                <Info className="h-3 w-3 mr-1" />
                Details
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={retryStorageCheck}
                disabled={isRetrying}
              >
                {isRetrying ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  'Retry'
                )}
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        {showDetails && errorDetails && (
          <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Failed at: {errorDetails.step || 'unknown'}
                </Badge>
              </div>
              
              {errorDetails.authError && (
                <div>
                  <span className="font-medium">Auth Error:</span> {errorDetails.authError.message}
                </div>
              )}
              
              {errorDetails.listError && (
                <div>
                  <span className="font-medium">Access Error:</span> {errorDetails.listError.message}
                </div>
              )}
              
              {errorDetails.uploadError && (
                <div>
                  <span className="font-medium">Upload Error:</span> {errorDetails.uploadError.message}
                </div>
              )}
              
              {errorDetails.storageError && (
                <div>
                  <span className="font-medium">Storage Error:</span> {errorDetails.storageError.message}
                </div>
              )}
              
              <div className="text-xs text-muted-foreground mt-2">
                This simplified verification tests direct bucket access instead of listing all buckets.
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-green-600 mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
      <CheckCircle className="h-4 w-4" />
      <span>Storage ready - file uploads enabled</span>
    </div>
  );
};
