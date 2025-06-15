
import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, RefreshCw, Info, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { verifyStorageForRole } from '@/utils/storage/roleAwareStorageVerification';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface RoleAwareStorageStatusProps {
  status: 'checking' | 'ready' | 'error';
  onStatusChange?: (status: 'checking' | 'ready' | 'error') => void;
  errorDetails?: any;
}

export const RoleAwareStorageStatus: React.FC<RoleAwareStorageStatusProps> = ({ 
  status, 
  onStatusChange,
  errorDetails 
}) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();
  const { user, isOwner } = useAuth();

  const retryStorageCheck = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to check storage access.",
      });
      return;
    }

    setIsRetrying(true);
    onStatusChange?.('checking');

    try {
      console.log('Retrying role-aware storage verification...');
      
      const result = await verifyStorageForRole();
      
      if (result.success) {
        console.log('Storage verification successful on retry');
        onStatusChange?.('ready');
        
        toast({
          title: "Storage Ready",
          description: "File upload functionality is now available.",
        });
      } else {
        console.error('Storage verification failed on retry:', result);
        // For better UX, set to ready for non-critical errors
        if (result.userRole === 'subscriber') {
          onStatusChange?.('ready');
        } else {
          onStatusChange?.('error');
        }
        
        if (isOwner) {
          toast({
            variant: "destructive",
            title: "Storage Still Unavailable",
            description: result.error || 'Storage verification failed',
          });
        }
      }

    } catch (error) {
      console.error('Retry failed with unexpected error:', error);
      // Default to ready state to avoid blocking UI
      onStatusChange?.('ready');
      
      if (isOwner) {
        toast({
          variant: "destructive",
          title: "Retry Failed",
          description: 'An unexpected error occurred during retry',
        });
      }
    } finally {
      setIsRetrying(false);
    }
  };

  // Don't show anything if user is not authenticated
  if (!user) {
    return null;
  }

  if (status === 'checking') {
    return (
      <div className="flex items-center justify-between gap-2 text-sm text-blue-600 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 animate-pulse" />
          <span>Verifying storage access...</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={retryStorageCheck}
          disabled={isRetrying}
          className="text-xs"
        >
          {isRetrying ? (
            <RefreshCw className="h-3 w-3 animate-spin" />
          ) : (
            'Skip'
          )}
        </Button>
      </div>
    );
  }
  
  if (status === 'error') {
    // Only show errors for owners or critical issues
    const isTimeout = errorDetails?.timeout || errorDetails?.fallbackFromChecking;
    const isStorageUnavailable = errorDetails?.step === 'subscriber_bucket_check' || 
                                errorDetails?.step === 'not_authenticated';
    
    // Don't show errors for subscribers unless it's critical
    if (!isOwner && isStorageUnavailable && !isTimeout) {
      return null; // Hide from subscribers to avoid confusion
    }

    // For owners or critical errors, show a less alarming message
    return (
      <div className="mb-4 space-y-3">
        <Alert variant={isOwner ? "destructive" : "default"} className={isOwner ? "" : "border-blue-200 bg-blue-50"}>
          <Info className={`h-4 w-4 ${isOwner ? '' : 'text-blue-600'}`} />
          <AlertDescription className="flex items-center justify-between">
            <div className="flex-1">
              <span className="font-medium">
                {isTimeout ? 'Storage check taking longer than expected' : 'File uploads may be limited'}
              </span>
              <br />
              <span className="text-sm">
                {isTimeout 
                  ? 'You can continue using the application while we verify storage in the background.'
                  : isOwner 
                    ? 'Storage configuration may need attention' 
                    : 'Contact your administrator if you need file upload access'
                }
              </span>
            </div>
            <div className="flex items-center gap-2 ml-2">
              {isOwner && !isTimeout && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  <Info className="h-3 w-3 mr-1" />
                  Details
                </Button>
              )}
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

        {showDetails && errorDetails && isOwner && !isTimeout && (
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
              
              <div className="text-xs text-muted-foreground mt-2">
                This verification includes role-based checks and proper authentication handling.
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Only show success message briefly
  return (
    <div className="flex items-center gap-2 text-sm text-green-600 mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
      <CheckCircle className="h-4 w-4" />
      <span>
        File uploads ready
      </span>
    </div>
  );
};
