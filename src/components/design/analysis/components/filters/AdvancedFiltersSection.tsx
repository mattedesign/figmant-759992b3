
import React from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ConfidenceRangeFilter } from './ConfidenceRangeFilter';
import { DateRangeFilter } from './DateRangeFilter';
import { AnalysisTypesFilter } from './AnalysisTypesFilter';
import { SortingFilter } from './SortingFilter';
import { AdvancedFilters, FilterOptions } from '@/hooks/filters/types';

interface AdvancedFiltersSectionProps {
  filters: AdvancedFilters;
  filterOptions: FilterOptions;
  updateFilter: (key: keyof AdvancedFilters, value: any) => void;
  isAdvancedOpen: boolean;
  setIsAdvancedOpen: (open: boolean) => void;
}

export const AdvancedFiltersSection: React.FC<AdvancedFiltersSectionProps> = ({
  filters,
  filterOptions,
  updateFilter,
  isAdvancedOpen,
  setIsAdvancedOpen
}) => {
  return (
    <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-0 h-8">
          <span className="text-xs font-medium">Advanced Filters</span>
          {isAdvancedOpen ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 mt-4">
        <ConfidenceRangeFilter
          confidenceRange={filters.confidenceRange}
          updateFilter={updateFilter}
        />

        <DateRangeFilter
          dateRange={filters.dateRange}
          updateFilter={updateFilter}
        />

        <AnalysisTypesFilter
          analysisTypes={filters.analysisTypes}
          filterOptions={filterOptions}
          updateFilter={updateFilter}
        />

        <SortingFilter
          sortField={filters.sortField}
          sortDirection={filters.sortDirection}
          updateFilter={updateFilter}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};
