
import { useEnhancedDesignBatchAnalyses } from './useEnhancedDesignBatchAnalyses';

export const useDesignBatchAnalyses = (batchId?: string) => {
  console.log('🔄 useDesignBatchAnalyses - Delegating to enhanced version with batchId:', batchId);
  return useEnhancedDesignBatchAnalyses(batchId);
};
