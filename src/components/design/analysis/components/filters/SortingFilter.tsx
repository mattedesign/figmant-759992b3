
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdvancedFilters } from '@/hooks/filters/types';

interface SortingFilterProps {
  sortField: string;
  sortDirection: 'asc' | 'desc';
  updateFilter: (key: keyof AdvancedFilters, value: any) => void;
}

export const SortingFilter: React.FC<SortingFilterProps> = ({
  sortField,
  sortDirection,
  updateFilter
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="space-y-2">
        <Label className="text-xs">Sort By</Label>
        <Select value={sortField} onValueChange={(value) => updateFilter('sortField', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Date Created</SelectItem>
            <SelectItem value="confidence_score">Confidence</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Direction</Label>
        <Select value={sortDirection} onValueChange={(value) => updateFilter('sortDirection', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest First</SelectItem>
            <SelectItem value="asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
