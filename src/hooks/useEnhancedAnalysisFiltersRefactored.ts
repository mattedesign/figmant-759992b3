
import { useState, useMemo, useCallback } from 'react';
import { useAdvancedAnalysisCache } from './useAdvancedAnalysisCache';
import { useFilterOptions } from './filters/useFilterOptions';
import { useQuickFilters } from './filters/useQuickFilters';
import { useFilterPresets } from './filters/useFilterPresets';
import { useSearchHistory } from './filters/useSearchHistory';
import { applyFiltersToAnalyses, applyFiltersToGroupedAnalyses } from './filters/filterUtils';
import { AdvancedFilters } from './filters/types';

export const useEnhancedAnalysisFiltersRefactored = (allAnalyses: any[], groupedAnalyses: any[]) => {
  const { getCachedData, setCachedData } = useAdvancedAnalysisCache({
    cacheKey: 'enhanced-filters',
    ttl: 300000 // 5 minutes
  });

  const [filters, setFilters] = useState<AdvancedFilters>({
    searchTerm: '',
    statusFilter: 'all',
    typeFilter: 'all',
    confidenceRange: [0, 100],
    dateRange: { from: null, to: null },
    analysisTypes: [],
    sortField: 'created_at',
    sortDirection: 'desc'
  });

  // Use the search history hook
  const { searchHistory, debouncedSearchTerm } = useSearchHistory(filters.searchTerm);

  // Use the filter options hook
  const filterOptions = useFilterOptions(allAnalyses);

  // Filter update functions
  const updateFilter = useCallback((key: keyof AdvancedFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateMultipleFilters = useCallback((updates: Partial<AdvancedFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      statusFilter: 'all',
      typeFilter: 'all',
      confidenceRange: [0, 100],
      dateRange: { from: null, to: null },
      analysisTypes: [],
      sortField: 'created_at',
      sortDirection: 'desc'
    });
  }, []);

  // Use the quick filters hook
  const quickFilters = useQuickFilters(updateFilter);

  // Use the filter presets hook
  const { filterPresets, saveFilterPreset, loadFilterPreset, deleteFilterPreset } = useFilterPresets(filters, setFilters);

  // Enhanced filtering logic with caching
  const filteredAnalyses = useMemo(() => {
    const cacheKey = `filtered-analyses-${JSON.stringify(filters)}-${allAnalyses.length}`;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    const filtered = applyFiltersToAnalyses(allAnalyses, filters, debouncedSearchTerm);
    setCachedData(cacheKey, filtered);
    return filtered;
  }, [allAnalyses, filters, debouncedSearchTerm, getCachedData, setCachedData]);

  // Enhanced grouped filtering with caching
  const filteredGroupedAnalyses = useMemo(() => {
    const cacheKey = `filtered-grouped-${JSON.stringify(filters)}-${groupedAnalyses.length}`;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    const filtered = applyFiltersToGroupedAnalyses(groupedAnalyses, filters, debouncedSearchTerm);
    setCachedData(cacheKey, filtered);
    return filtered;
  }, [groupedAnalyses, filters, debouncedSearchTerm, getCachedData, setCachedData]);

  return {
    filters,
    filteredAnalyses,
    filteredGroupedAnalyses,
    filterOptions,
    searchHistory,
    filterPresets,
    debouncedSearchTerm,
    updateFilter,
    updateMultipleFilters,
    resetFilters,
    saveFilterPreset,
    loadFilterPreset,
    deleteFilterPreset,
    quickFilters
  };
};
