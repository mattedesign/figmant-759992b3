
import { useState, useCallback } from 'react';
import { FilterPreset, AdvancedFilters } from './types';

export const useFilterPresets = (filters: AdvancedFilters, setFilters: (filters: AdvancedFilters) => void) => {
  const [filterPresets, setFilterPresets] = useState<FilterPreset[]>([]);

  const saveFilterPreset = useCallback((name: string) => {
    const preset: FilterPreset = {
      id: `preset-${Date.now()}`,
      name,
      filters: { ...filters }
    };
    setFilterPresets(prev => [...prev, preset]);
  }, [filters]);

  const loadFilterPreset = useCallback((preset: FilterPreset) => {
    setFilters({ ...filters, ...preset.filters });
  }, [filters, setFilters]);

  const deleteFilterPreset = useCallback((presetId: string) => {
    setFilterPresets(prev => prev.filter(p => p.id !== presetId));
  }, []);

  return {
    filterPresets,
    saveFilterPreset,
    loadFilterPreset,
    deleteFilterPreset
  };
};
