
import { useAnalysisRealTimeManager } from './realtime/useAnalysisRealTimeManager';

interface UseAnalysisRealTimeSubscriptionsProps {
  onError: (error: Error) => void;
}

export const useAnalysisRealTimeSubscriptions = ({ onError }: UseAnalysisRealTimeSubscriptionsProps) => {
  return useAnalysisRealTimeManager({ onError });
};
