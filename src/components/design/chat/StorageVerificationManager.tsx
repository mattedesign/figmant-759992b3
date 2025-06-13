
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { verifyStorageAccess } from '@/utils/storage/storageVerification';

interface StorageVerificationManagerProps {
  setStorageStatus: (status: 'checking' | 'ready' | 'error') => void;
  setStorageErrorDetails: (details: any) => void;
}

export const StorageVerificationManager: React.FC<StorageVerificationManagerProps> = ({
  setStorageStatus,
  setStorageErrorDetails
}) => {
  const { toast } = useToast();

  React.useEffect(() => {
    const checkStorage = async () => {
      try {
        console.log('Starting enhanced storage verification...');
        setStorageStatus('checking');
        setStorageErrorDetails(null);
        
        const result = await verifyStorageAccess();
        
        if (result.success) {
          console.log('Storage verification successful');
          setStorageStatus('ready');
          setStorageErrorDetails(null);
          
          toast({
            title: "Storage Ready",
            description: "File uploads are ready to use.",
          });
        } else {
          console.error('Storage verification failed:', result);
          setStorageStatus('error');
          setStorageErrorDetails(result.details);
          
          toast({
            variant: "destructive",
            title: "Storage Configuration Issue",
            description: result.error || "Unable to access file storage.",
          });
        }
      } catch (error) {
        console.error('Storage verification error:', error);
        setStorageStatus('error');
        setStorageErrorDetails({ step: 'catch', error });
        
        toast({
          variant: "destructive",
          title: "Storage Verification Error",
          description: "An unexpected error occurred while checking storage access.",
        });
      }
    };
    
    checkStorage();
  }, [toast, setStorageStatus, setStorageErrorDetails]);

  return null; // This component only handles side effects
};
