
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Filter, RotateCcw, Save } from 'lucide-react';

interface FiltersPanelHeaderProps {
  activeFiltersCount: number;
  onResetFilters: () => void;
  showPresetDialog: boolean;
  setShowPresetDialog: (show: boolean) => void;
  presetName: string;
  setPresetName: (name: string) => void;
  onSavePreset: () => void;
}

export const FiltersPanelHeader: React.FC<FiltersPanelHeaderProps> = ({
  activeFiltersCount,
  onResetFilters,
  showPresetDialog,
  setShowPresetDialog,
  presetName,
  setPresetName,
  onSavePreset
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <CardTitle className="text-sm">Filters</CardTitle>
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            {activeFiltersCount} active
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onResetFilters}>
          <RotateCcw className="h-3 w-3" />
        </Button>
        <Dialog open={showPresetDialog} onOpenChange={setShowPresetDialog}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Save className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Filter Preset</DialogTitle>
              <DialogDescription>
                Save your current filter configuration for quick access later.
              </DialogDescription>
            </DialogHeader>
            <Input
              placeholder="Preset name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
            />
            <DialogFooter>
              <Button onClick={onSavePreset}>Save Preset</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
