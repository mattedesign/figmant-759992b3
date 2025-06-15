
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdvancedFilters, FilterOptions } from '@/hooks/filters/types';

interface BasicFiltersSectionProps {
  filters: AdvancedFilters;
  filterOptions: FilterOptions;
  updateFilter: (key: keyof AdvancedFilters, value: any) => void;
}

export const BasicFiltersSection: React.FC<BasicFiltersSectionProps> = ({
  filters,
  filterOptions,
  updateFilter
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-xs">Status</Label>
        <Select value={filters.statusFilter} onValueChange={(value) => updateFilter('statusFilter', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {filterOptions.statuses.map((status: string) => (
              <SelectItem key={status} value={status} className="capitalize">
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Type</Label>
        <Select value={filters.typeFilter} onValueChange={(value) => updateFilter('typeFilter', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {filterOptions.types.map((type: string) => (
              <SelectItem key={type} value={type} className="capitalize">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
