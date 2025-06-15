
import { useMemo } from 'react';
import { useAdvancedAnalysisCache } from '../useAdvancedAnalysisCache';
import { FilterOptions } from './types';

export const useFilterOptions = (allAnalyses: any[]) => {
  const { getCachedData, setCachedData } = useAdvancedAnalysisCache({
    cacheKey: 'filter-options',
    ttl: 300000 // 5 minutes
  });

  const filterOptions = useMemo(() => {
    const cacheKey = 'filter-options';
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    const statusOptions = [...new Set(allAnalyses.map(a => a.status))];
    const typeOptions = [...new Set(allAnalyses.map(a => a.type))];
    const analysisTypeOptions = [...new Set(allAnalyses.map(a => a.analysis_type))];
    
    const options: FilterOptions = {
      statuses: statusOptions,
      types: typeOptions,
      analysisTypes: analysisTypeOptions,
      confidenceRange: {
        min: Math.min(...allAnalyses.map(a => a.confidence_score || 0)) * 100,
        max: Math.max(...allAnalyses.map(a => a.confidence_score || 0)) * 100
      }
    };

    setCachedData(cacheKey, options);
    return options;
  }, [allAnalyses, getCachedData, setCachedData]);

  return filterOptions;
};
