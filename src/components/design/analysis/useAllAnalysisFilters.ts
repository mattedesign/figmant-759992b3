
import { useState, useMemo } from 'react';

export const useAllAnalysisFilters = (allAnalyses: any[], groupedAnalyses: any[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Filter analyses based on current filters
  const filteredAnalyses = useMemo(() => {
    return allAnalyses.filter(analysis => {
      const matchesSearch = analysis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          analysis.analysis_type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || analysis.status === statusFilter;
      const matchesType = typeFilter === 'all' || analysis.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [allAnalyses, searchTerm, statusFilter, typeFilter]);

  // Filter grouped analyses
  const filteredGroupedAnalyses = useMemo(() => {
    return groupedAnalyses.filter(group => {
      const matchesSearch = group.groupTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          group.primaryAnalysis.analysis_type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || group.primaryAnalysis.status === statusFilter;
      const matchesType = typeFilter === 'all' || group.groupType === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [groupedAnalyses, searchTerm, statusFilter, typeFilter]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    filteredAnalyses,
    filteredGroupedAnalyses
  };
};
