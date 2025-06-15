
import { useState, useMemo } from 'react';
import { AdvancedFilters, FilterPreset } from '@/hooks/filters/types';

interface FiltersPanelProps {
  filters: AdvancedFilters;
  saveFilterPreset: (name: string) => void;
}

export const useFiltersPanelState = ({ filters, saveFilterPreset }: FiltersPanelProps) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [showPresetDialog, setShowPresetDialog] = useState(false);

  const activeFiltersCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'searchTerm') return value !== '';
      if (key === 'statusFilter' || key === 'typeFilter') return value !== 'all';
      if (key === 'confidenceRange') return value[0] !== 0 || value[1] !== 100;
      if (key === 'dateRange') return value.from || value.to;
      if (key === 'analysisTypes') return value.length > 0;
      return false;
    }).length;
  }, [filters]);

  const handleSavePreset = () => {
    if (presetName.trim()) {
      saveFilterPreset(presetName.trim());
      setPresetName('');
      setShowPresetDialog(false);
    }
  };

  return {
    isAdvancedOpen,
    setIsAdvancedOpen,
    showSearchHistory,
    setShowSearchHistory,
    presetName,
    setPresetName,
    showPresetDialog,
    setShowPresetDialog,
    activeFiltersCount,
    handleSavePreset
  };
};
