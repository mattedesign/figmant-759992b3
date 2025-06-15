
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useAdvancedAnalysisCache } from './useAdvancedAnalysisCache';

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface AdvancedFilters {
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;
  confidenceRange: [number, number];
  dateRange: DateRange;
  analysisTypes: string[];
  sortField: string;
  sortDirection: 'asc' | 'desc';
}

interface FilterPreset {
  id: string;
  name: string;
  filters: Partial<AdvancedFilters>;
}

export const useEnhancedAnalysisFilters = (allAnalyses: any[], groupedAnalyses: any[]) => {
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

  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [filterPresets, setFilterPresets] = useState<FilterPreset[]>([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(filters.searchTerm);
      
      // Add to search history if not empty and not already present
      if (filters.searchTerm.trim() && !searchHistory.includes(filters.searchTerm.trim())) {
        setSearchHistory(prev => [filters.searchTerm.trim(), ...prev.slice(0, 9)]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.searchTerm, searchHistory]);

  // Get available filter options from data
  const filterOptions = useMemo(() => {
    const cacheKey = 'filter-options';
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    const statusOptions = [...new Set(allAnalyses.map(a => a.status))];
    const typeOptions = [...new Set(allAnalyses.map(a => a.type))];
    const analysisTypeOptions = [...new Set(allAnalyses.map(a => a.analysis_type))];
    
    const options = {
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

  // Enhanced filtering logic
  const filteredAnalyses = useMemo(() => {
    const cacheKey = `filtered-analyses-${JSON.stringify(filters)}-${allAnalyses.length}`;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    let filtered = allAnalyses.filter(analysis => {
      // Text search
      const searchMatch = !debouncedSearchTerm || 
        analysis.title?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        analysis.analysis_type?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        analysis.batch_name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

      // Status filter
      const statusMatch = filters.statusFilter === 'all' || analysis.status === filters.statusFilter;

      // Type filter
      const typeMatch = filters.typeFilter === 'all' || analysis.type === filters.typeFilter;

      // Confidence range
      const confidence = (analysis.confidence_score || 0) * 100;
      const confidenceMatch = confidence >= filters.confidenceRange[0] && confidence <= filters.confidenceRange[1];

      // Date range
      let dateMatch = true;
      if (filters.dateRange.from || filters.dateRange.to) {
        const analysisDate = new Date(analysis.created_at);
        dateMatch = (!filters.dateRange.from || analysisDate >= filters.dateRange.from) &&
                   (!filters.dateRange.to || analysisDate <= filters.dateRange.to);
      }

      // Analysis types
      const analysisTypeMatch = filters.analysisTypes.length === 0 || 
        filters.analysisTypes.includes(analysis.analysis_type);

      return searchMatch && statusMatch && typeMatch && confidenceMatch && dateMatch && analysisTypeMatch;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[filters.sortField];
      const bValue = b[filters.sortField];
      const direction = filters.sortDirection === 'desc' ? -1 : 1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * direction;
      }

      if (aValue < bValue) return -1 * direction;
      if (aValue > bValue) return 1 * direction;
      return 0;
    });

    setCachedData(cacheKey, filtered);
    return filtered;
  }, [allAnalyses, filters, debouncedSearchTerm, getCachedData, setCachedData]);

  // Enhanced grouped filtering
  const filteredGroupedAnalyses = useMemo(() => {
    const cacheKey = `filtered-grouped-${JSON.stringify(filters)}-${groupedAnalyses.length}`;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    const filtered = groupedAnalyses.filter(group => {
      const searchMatch = !debouncedSearchTerm || 
        group.groupTitle?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        group.primaryAnalysis?.analysis_type?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

      const statusMatch = filters.statusFilter === 'all' || group.primaryAnalysis?.status === filters.statusFilter;
      const typeMatch = filters.typeFilter === 'all' || group.groupType === filters.typeFilter;

      return searchMatch && statusMatch && typeMatch;
    });

    setCachedData(cacheKey, filtered);
    return filtered;
  }, [groupedAnalyses, filters, debouncedSearchTerm, getCachedData, setCachedData]);

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

  // Preset management
  const saveFilterPreset = useCallback((name: string) => {
    const preset: FilterPreset = {
      id: `preset-${Date.now()}`,
      name,
      filters: { ...filters }
    };
    setFilterPresets(prev => [...prev, preset]);
  }, [filters]);

  const loadFilterPreset = useCallback((preset: FilterPreset) => {
    setFilters(prev => ({ ...prev, ...preset.filters }));
  }, []);

  const deleteFilterPreset = useCallback((presetId: string) => {
    setFilterPresets(prev => prev.filter(p => p.id !== presetId));
  }, []);

  // Quick filters
  const quickFilters = useMemo(() => ({
    today: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      updateFilter('dateRange', { from: today, to: tomorrow });
    },
    thisWeek: () => {
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      updateFilter('dateRange', { from: weekStart, to: weekEnd });
    },
    thisMonth: () => {
      const today = new Date();
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);
      updateFilter('dateRange', { from: monthStart, to: monthEnd });
    },
    highConfidence: () => {
      updateFilter('confidenceRange', [80, 100]);
    },
    lowConfidence: () => {
      updateFilter('confidenceRange', [0, 50]);
    }
  }), [updateFilter]);

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
