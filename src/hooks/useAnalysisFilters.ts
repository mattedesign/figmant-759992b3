
import { useState, useMemo } from 'react';

export interface AnalysisFilters {
  searchTerm: string;
  statusFilter: 'all' | 'completed' | 'processing' | 'failed';
  typeFilter: 'all' | 'individual' | 'batch';
  dateRange: 'all' | 'today' | 'week' | 'month';
  sortBy: 'date' | 'name' | 'confidence' | 'status';
  sortOrder: 'asc' | 'desc';
}

export const useAnalysisFilters = () => {
  const [filters, setFilters] = useState<AnalysisFilters>({
    searchTerm: '',
    statusFilter: 'all',
    typeFilter: 'all',
    dateRange: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const updateFilter = (key: keyof AnalysisFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      statusFilter: 'all',
      typeFilter: 'all',
      dateRange: 'all',
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  const applyFilters = useMemo(() => {
    return (analyses: any[]) => {
      let filtered = [...analyses];

      // Apply search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(analysis => 
          analysis.analysis_type?.toLowerCase().includes(searchLower) ||
          analysis.id.toLowerCase().includes(searchLower) ||
          analysis.design_upload?.file_name?.toLowerCase().includes(searchLower)
        );
      }

      // Apply status filter
      if (filters.statusFilter !== 'all') {
        filtered = filtered.filter(analysis => 
          analysis.status === filters.statusFilter
        );
      }

      // Apply type filter
      if (filters.typeFilter !== 'all') {
        if (filters.typeFilter === 'batch') {
          filtered = filtered.filter(analysis => analysis.batch_id);
        } else {
          filtered = filtered.filter(analysis => !analysis.batch_id);
        }
      }

      // Apply date range filter
      if (filters.dateRange !== 'all') {
        const now = new Date();
        const filterDate = new Date();
        
        switch (filters.dateRange) {
          case 'today':
            filterDate.setHours(0, 0, 0, 0);
            break;
          case 'week':
            filterDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            filterDate.setMonth(now.getMonth() - 1);
            break;
        }
        
        filtered = filtered.filter(analysis => 
          new Date(analysis.created_at) >= filterDate
        );
      }

      // Apply sorting
      filtered.sort((a, b) => {
        let aValue, bValue;
        
        switch (filters.sortBy) {
          case 'name':
            aValue = a.design_upload?.file_name || a.analysis_type || '';
            bValue = b.design_upload?.file_name || b.analysis_type || '';
            break;
          case 'confidence':
            aValue = a.confidence_score || 0;
            bValue = b.confidence_score || 0;
            break;
          case 'status':
            aValue = a.status || 'completed';
            bValue = b.status || 'completed';
            break;
          case 'date':
          default:
            aValue = new Date(a.created_at);
            bValue = new Date(b.created_at);
            break;
        }

        if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      return filtered;
    };
  }, [filters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    applyFilters
  };
};
