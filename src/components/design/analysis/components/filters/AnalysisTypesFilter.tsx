
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AdvancedFilters, FilterOptions } from '@/hooks/filters/types';

interface AnalysisTypesFilterProps {
  analysisTypes: string[];
  filterOptions: FilterOptions;
  updateFilter: (key: keyof AdvancedFilters, value: any) => void;
}

export const AnalysisTypesFilter: React.FC<AnalysisTypesFilterProps> = ({
  analysisTypes,
  filterOptions,
  updateFilter
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-xs">Analysis Types</Label>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {filterOptions.analysisTypes.map((type: string) => (
          <div key={type} className="flex items-center space-x-2">
            <Checkbox
              id={type}
              checked={analysisTypes.includes(type)}
              onCheckedChange={(checked) => {
                if (checked) {
                  updateFilter('analysisTypes', [...analysisTypes, type]);
                } else {
                  updateFilter('analysisTypes', analysisTypes.filter((t: string) => t !== type));
                }
              }}
            />
            <Label htmlFor={type} className="text-xs capitalize">
              {type}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
