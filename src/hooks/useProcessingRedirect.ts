
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useProcessingRedirect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const redirectToProcessing = (batchId: string, message?: string) => {
    if (message) {
      toast({
        title: "Upload Started",
        description: message,
      });
    }
    
    navigate(`/processing/${batchId}`);
  };

  return { redirectToProcessing };
};
