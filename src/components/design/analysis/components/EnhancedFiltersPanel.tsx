import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  X, 
  RotateCcw, 
  Save, 
  ChevronDown,
  ChevronUp,
  Clock,
  TrendingUp,
  TrendingDown,
  Bookmark
} from 'lucide-react';
import { format } from 'date-fns';
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

export const EnhancedFiltersPanel: React.FC<EnhancedFiltersPanelProps> = ({
  filters,
  filterOptions,
  searchHistory,
  filterPresets,
  updateFilter,
  updateMultipleFilters,
  resetFilters,
  saveFilterPreset,
  loadFilterPreset,
  deleteFilterPreset,
  quickFilters
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [showPresetDialog, setShowPresetDialog] = useState(false);

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'searchTerm') return value !== '';
    if (key === 'statusFilter' || key === 'typeFilter') return value !== 'all';
    if (key === 'confidenceRange') return value[0] !== 0 || value[1] !== 100;
    if (key === 'dateRange') return value.from || value.to;
    if (key === 'analysisTypes') return value.length > 0;
    return false;
  }).length;

  const handleSavePreset = () => {
    if (presetName.trim()) {
      saveFilterPreset(presetName.trim());
      setPresetName('');
      setShowPresetDialog(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
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
            <Button variant="ghost" size="sm" onClick={resetFilters}>
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
                  <Button onClick={handleSavePreset}>Save Preset</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={quickFilters.today}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={quickFilters.thisWeek}>
            This Week
          </Button>
          <Button variant="outline" size="sm" onClick={quickFilters.thisMonth}>
            This Month
          </Button>
          <Button variant="outline" size="sm" onClick={quickFilters.highConfidence}>
            <TrendingUp className="h-3 w-3 mr-1" />
            High Confidence
          </Button>
          <Button variant="outline" size="sm" onClick={quickFilters.lowConfidence}>
            <TrendingDown className="h-3 w-3 mr-1" />
            Needs Review
          </Button>
        </div>

        {/* Filter Presets */}
        {filterPresets.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-medium">Saved Filters</Label>
            <div className="flex flex-wrap gap-2">
              {filterPresets.map((preset) => (
                <div key={preset.id} className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadFilterPreset(preset)}
                    className="text-xs"
                  >
                    <Bookmark className="h-3 w-3 mr-1" />
                    {preset.name}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteFilterPreset(preset.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search analyses, types, batch names..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="pl-10"
              onFocus={() => setShowSearchHistory(true)}
              onBlur={() => setTimeout(() => setShowSearchHistory(false), 200)}
            />
            
            {/* Search History Dropdown */}
            {showSearchHistory && searchHistory.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border rounded-md shadow-lg">
                <div className="p-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Recent searches</span>
                  </div>
                  {searchHistory.slice(0, 5).map((term, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-2 py-1 text-sm hover:bg-muted rounded"
                      onClick={() => updateFilter('searchTerm', term)}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Basic Filters */}
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

        {/* Advanced Filters */}
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
            {/* Confidence Range */}
            <div className="space-y-2">
              <Label className="text-xs">Confidence Score: {filters.confidenceRange[0]}% - {filters.confidenceRange[1]}%</Label>
              <Slider
                value={filters.confidenceRange}
                onValueChange={(value) => updateFilter('confidenceRange', value)}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label className="text-xs">Date Range</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.from ? format(filters.dateRange.from, 'MMM d, yyyy') : 'From date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.from}
                      onSelect={(date) => updateFilter('dateRange', { ...filters.dateRange, from: date })}
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.to ? format(filters.dateRange.to, 'MMM d, yyyy') : 'To date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.to}
                      onSelect={(date) => updateFilter('dateRange', { ...filters.dateRange, to: date })}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {(filters.dateRange.from || filters.dateRange.to) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateFilter('dateRange', { from: null, to: null })}
                  className="w-full"
                >
                  Clear Date Range
                </Button>
              )}
            </div>

            {/* Analysis Types */}
            <div className="space-y-2">
              <Label className="text-xs">Analysis Types</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {filterOptions.analysisTypes.map((type: string) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={filters.analysisTypes.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFilter('analysisTypes', [...filters.analysisTypes, type]);
                        } else {
                          updateFilter('analysisTypes', filters.analysisTypes.filter((t: string) => t !== type));
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

            {/* Sorting */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label className="text-xs">Sort By</Label>
                <Select value={filters.sortField} onValueChange={(value) => updateFilter('sortField', value)}>
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
                <Select value={filters.sortDirection} onValueChange={(value) => updateFilter('sortDirection', value)}>
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
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
