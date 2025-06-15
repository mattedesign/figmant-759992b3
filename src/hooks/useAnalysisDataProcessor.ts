
import { useMemo } from 'react';

export const useAnalysisDataProcessor = (groupedAnalyses: any[]) => {
  const allAnalyses = useMemo(() => {
    try {
      const flatAnalyses: any[] = [];
      
      groupedAnalyses.forEach(group => {
        // Add the primary analysis
        flatAnalyses.push(group.primaryAnalysis);
        // Add all related analyses
        flatAnalyses.push(...group.relatedAnalyses);
      });
      
      return flatAnalyses.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } catch (err) {
      console.error('Error processing grouped analyses:', err);
      return [];
    }
  }, [groupedAnalyses]);

  return { allAnalyses };
};
