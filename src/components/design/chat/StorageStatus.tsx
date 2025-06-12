
import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StorageStatusProps {
  status: 'checking' | 'ready' | 'error';
  onStatusChange?: (status: 'checking' | 'ready' | 'error') => void;
}

export const StorageStatus: React.FC<StorageStatusProps> = ({ status, onStatusChange }) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();

  const retryStorageCheck = async () => {
    setIsRetrying(true);
    onStatusChange?.('checking');

    try {
      console.log('Retrying storage check...');
      
      // Test storage bucket access
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        throw new Error('Failed to access storage buckets');
      }
      
      const designUploadsBucket = buckets?.find(bucket => bucket.id === 'design-uploads');
      if (!designUploadsBucket) {
        throw new Error('design-uploads bucket not found');
      }

      // Test file listing
      const { data: files, error: filesError } = await supabase.storage
        .from('design-uploads')
        .list('', { limit: 1 });

      if (filesError) {
        console.warn('File listing failed, but bucket exists:', filesError);
      }

      console.log('Storage check successful');
      onStatusChange?.('ready');
      
      toast({
        title: "Storage Ready",
        description: "File upload functionality is now available.",
      });

    } catch (error) {
      console.error('Storage retry failed:', error);
      onStatusChange?.('error');
      
      toast({
        variant: "destructive",
        title: "Storage Still Unavailable",
        description: error instanceof Error ? error.message : 'Storage check failed',
      });
    } finally {
      setIsRetrying(false);
    }
  };

  if (status === 'checking') {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <div className="h-4 w-4 bg-muted rounded animate-pulse" />
        <span>Checking storage configuration...</span>
      </div>
    );
  }
  
  if (status === 'error') {
    return (
      <div className="flex items-center justify-between text-sm text-red-600 mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>File uploads are currently unavailable. Storage configuration issue detected.</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={retryStorageCheck}
          disabled={isRetrying}
          className="ml-2"
        >
          {isRetrying ? (
            <RefreshCw className="h-3 w-3 animate-spin" />
          ) : (
            'Retry'
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-green-600 mb-4">
      <CheckCircle className="h-4 w-4" />
      <span>Ready for file uploads</span>
    </div>
  );
};
