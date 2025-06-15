
import { AdvancedFilters } from './types';

export const applyFiltersToAnalyses = (
  allAnalyses: any[],
  filters: AdvancedFilters,
  debouncedSearchTerm: string
) => {
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

  return filtered;
};

export const applyFiltersToGroupedAnalyses = (
  groupedAnalyses: any[],
  filters: AdvancedFilters,
  debouncedSearchTerm: string
) => {
  return groupedAnalyses.filter(group => {
    const searchMatch = !debouncedSearchTerm || 
      group.groupTitle?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      group.primaryAnalysis?.analysis_type?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

    const statusMatch = filters.statusFilter === 'all' || group.primaryAnalysis?.status === filters.statusFilter;
    const typeMatch = filters.typeFilter === 'all' || group.groupType === filters.typeFilter;

    return searchMatch && statusMatch && typeMatch;
  });
};
