
import { useEnhancedDesignAnalyses } from './useEnhancedDesignAnalyses';

export const useDesignAnalyses = (uploadId?: string) => {
  console.log('🔄 useDesignAnalyses - Delegating to enhanced version with uploadId:', uploadId);
  return useEnhancedDesignAnalyses(uploadId);
};
