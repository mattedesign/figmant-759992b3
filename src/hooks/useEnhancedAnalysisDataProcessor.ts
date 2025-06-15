
import { useMemo, useCallback } from 'react';
import { useAdvancedAnalysisCache } from './useAdvancedAnalysisCache';

interface ProcessingOptions {
  enableGrouping?: boolean;
  enableSorting?: boolean;
  sortDirection?: 'asc' | 'desc';
  sortField?: string;
  enableFiltering?: boolean;
}

export const useEnhancedAnalysisDataProcessor = (
  groupedAnalyses: any[],
  options: ProcessingOptions = {}
) => {
  const { getCachedData, setCachedData } = useAdvancedAnalysisCache({
    cacheKey: 'analysis-processor',
    ttl: 180000 // 3 minutes
  });

  const processData = useCallback((data: any[], opts: ProcessingOptions) => {
    const cacheKey = `processed-${JSON.stringify(opts)}-${data.length}`;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    const processed = {
      allAnalyses: [] as any[],
      groupedByStatus: {} as Record<string, any[]>,
      groupedByType: {} as Record<string, any[]>,
      stats: {
        total: 0,
        byStatus: {} as Record<string, number>,
        byType: {} as Record<string, number>,
        averageConfidence: 0
      }
    };

    // Process all analyses
    data.forEach(group => {
      processed.allAnalyses.push(group.primaryAnalysis);
      processed.allAnalyses.push(...group.relatedAnalyses);
    });

    // Sort if enabled
    if (opts.enableSorting && opts.sortField) {
      processed.allAnalyses.sort((a, b) => {
        const aVal = a[opts.sortField!];
        const bVal = b[opts.sortField!];
        const direction = opts.sortDirection === 'desc' ? -1 : 1;
        
        if (aVal < bVal) return -1 * direction;
        if (aVal > bVal) return 1 * direction;
        return 0;
      });
    } else {
      // Default sort by date
      processed.allAnalyses.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    // Group by status
    if (opts.enableGrouping) {
      processed.allAnalyses.forEach(analysis => {
        const status = analysis.status || 'unknown';
        if (!processed.groupedByStatus[status]) {
          processed.groupedByStatus[status] = [];
        }
        processed.groupedByStatus[status].push(analysis);

        const type = analysis.type || 'unknown';
        if (!processed.groupedByType[type]) {
          processed.groupedByType[type] = [];
        }
        processed.groupedByType[type].push(analysis);
      });
    }

    // Calculate statistics
    processed.stats.total = processed.allAnalyses.length;
    
    processed.allAnalyses.forEach(analysis => {
      const status = analysis.status || 'unknown';
      const type = analysis.type || 'unknown';
      
      processed.stats.byStatus[status] = (processed.stats.byStatus[status] || 0) + 1;
      processed.stats.byType[type] = (processed.stats.byType[type] || 0) + 1;
    });

    // Calculate average confidence
    const confidenceSum = processed.allAnalyses.reduce(
      (sum, analysis) => sum + (analysis.confidence_score || 0), 
      0
    );
    processed.stats.averageConfidence = processed.stats.total > 0 
      ? confidenceSum / processed.stats.total 
      : 0;

    setCachedData(cacheKey, processed);
    return processed;
  }, [getCachedData, setCachedData]);

  const memoizedResult = useMemo(() => {
    return processData(groupedAnalyses, options);
  }, [groupedAnalyses, options, processData]);

  return memoizedResult;
};
