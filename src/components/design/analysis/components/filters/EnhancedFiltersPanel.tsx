
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FiltersPanelHeader } from './FiltersPanelHeader';
import { QuickActionsSection } from './QuickActionsSection';
import { FilterPresetsSection } from './FilterPresetsSection';
import { SearchSection } from './SearchSection';
import { BasicFiltersSection } from './BasicFiltersSection';
import { AdvancedFiltersSection } from './AdvancedFiltersSection';
import { useFiltersPanelState } from './hooks/useFiltersPanelState';
import { 
  AdvancedFilters, 
  FilterOptions, 
  FilterPreset, 
  QuickFilters 
} from '@/hooks/filters/types';

interface EnhancedFiltersPanelProps {
  filters: AdvancedFilters;
  filterOptions: FilterOptions;
  searchHistory: string[];
  filterPresets: FilterPreset[];
  debouncedSearchTerm: string;
  updateFilter: (key: keyof AdvancedFilters, value: any) => void;
  updateMultipleFilters: (updates: Partial<AdvancedFilters>) => void;
  resetFilters: () => void;
  saveFilterPreset: (name: string) => void;
  loadFilterPreset: (preset: FilterPreset) => void;
  deleteFilterPreset: (presetId: string) => void;
  quickFilters: QuickFilters;
}

export const EnhancedFiltersPanel: React.FC<EnhancedFiltersPanelProps> = (props) => {
  const {
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
  } = useFiltersPanelState(props);

  return (
    <Card>
      <CardHeader className="pb-4">
        <FiltersPanelHeader
          activeFiltersCount={activeFiltersCount}
          onResetFilters={props.resetFilters}
          showPresetDialog={showPresetDialog}
          setShowPresetDialog={setShowPresetDialog}
          presetName={presetName}
          setPresetName={setPresetName}
          onSavePreset={handleSavePreset}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <QuickActionsSection quickFilters={props.quickFilters} />
        
        <FilterPresetsSection
          filterPresets={props.filterPresets}
          onLoadPreset={props.loadFilterPreset}
          onDeletePreset={props.deleteFilterPreset}
        />

        <SearchSection
          searchTerm={props.filters.searchTerm}
          searchHistory={props.searchHistory}
          showSearchHistory={showSearchHistory}
          setShowSearchHistory={setShowSearchHistory}
          updateFilter={props.updateFilter}
        />

        <BasicFiltersSection
          filters={props.filters}
          filterOptions={props.filterOptions}
          updateFilter={props.updateFilter}
        />

        <AdvancedFiltersSection
          filters={props.filters}
          filterOptions={props.filterOptions}
          updateFilter={props.updateFilter}
          isAdvancedOpen={isAdvancedOpen}
          setIsAdvancedOpen={setIsAdvancedOpen}
        />
      </CardContent>
    </Card>
  );
};
