
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AdvancedFilters } from '@/hooks/filters/types';

interface ConfidenceRangeFilterProps {
  confidenceRange: [number, number];
  updateFilter: (key: keyof AdvancedFilters, value: any) => void;
}

export const ConfidenceRangeFilter: React.FC<ConfidenceRangeFilterProps> = ({
  confidenceRange,
  updateFilter
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-xs">Confidence Score: {confidenceRange[0]}% - {confidenceRange[1]}%</Label>
      <Slider
        value={confidenceRange}
        onValueChange={(value) => updateFilter('confidenceRange', value)}
        max={100}
        min={0}
        step={5}
        className="w-full"
      />
    </div>
  );
};
