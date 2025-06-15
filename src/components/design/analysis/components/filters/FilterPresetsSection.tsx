
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Bookmark, X } from 'lucide-react';
import { FilterPreset } from '@/hooks/filters/types';

interface FilterPresetsSectionProps {
  filterPresets: FilterPreset[];
  onLoadPreset: (preset: FilterPreset) => void;
  onDeletePreset: (presetId: string) => void;
}

export const FilterPresetsSection: React.FC<FilterPresetsSectionProps> = ({
  filterPresets,
  onLoadPreset,
  onDeletePreset
}) => {
  if (filterPresets.length === 0) return null;

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">Saved Filters</Label>
      <div className="flex flex-wrap gap-2">
        {filterPresets.map((preset) => (
          <div key={preset.id} className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onLoadPreset(preset)}
              className="text-xs"
            >
              <Bookmark className="h-3 w-3 mr-1" />
              {preset.name}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeletePreset(preset.id)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
