
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { DatePicker } from '@/components/ui/date-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Filter, 
  X, 
  Save, 
  Trash2,
  Search,
  Calendar,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterState {
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  analysisTypes: string[];
  confidenceRange: [number, number];
  processingTimeRange: [number, number];
  searchQuery: string;
  status: string;
  userTypes: string[];
  tags: string[];
}

interface FilterPreset {
  id: string;
  name: string;
  filters: Partial<FilterState>;
}

interface AdvancedFiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  className?: string;
}

export const AdvancedFiltersPanel: React.FC<AdvancedFiltersPanelProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  className
}) => {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { from: null, to: null },
    analysisTypes: [],
    confidenceRange: [0, 100],
    processingTimeRange: [0, 10],
    searchQuery: '',
    status: 'all',
    userTypes: [],
    tags: []
  });

  const [savedPresets] = useState<FilterPreset[]>([
    {
      id: '1',
      name: 'High Quality',
      filters: {
        confidenceRange: [80, 100],
        status: 'completed'
      }
    },
    {
      id: '2',
      name: 'Recent Activity',
      filters: {
        dateRange: {
          from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          to: new Date()
        }
      }
    },
    {
      id: '3',
      name: 'Quick Analyses',
      filters: {
        processingTimeRange: [0, 3],
        analysisTypes: ['quick', 'standard']
      }
    }
  ]);

  const analysisTypes = [
    'Standard Analysis',
    'Premium Analysis',
    'Batch Analysis',
    'Quick Analysis',
    'Comparative Analysis'
  ];

  const userTypes = [
    'Free User',
    'Premium User',
    'Enterprise User',
    'Trial User'
  ];

  const availableTags = [
    'high-priority',
    'mobile-design',
    'web-design',
    'ui-kit',
    'prototype',
    'final-design',
    'iteration'
  ];

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (array: string[], value: string, key: keyof FilterState) => {
    const newArray = array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];
    updateFilter(key, newArray as any);
  };

  const clearAllFilters = () => {
    setFilters({
      dateRange: { from: null, to: null },
      analysisTypes: [],
      confidenceRange: [0, 100],
      processingTimeRange: [0, 10],
      searchQuery: '',
      status: 'all',
      userTypes: [],
      tags: []
    });
  };

  const applyPreset = (preset: FilterPreset) => {
    setFilters(prev => ({ ...prev, ...preset.filters }));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.analysisTypes.length > 0) count++;
    if (filters.confidenceRange[0] > 0 || filters.confidenceRange[1] < 100) count++;
    if (filters.processingTimeRange[0] > 0 || filters.processingTimeRange[1] < 10) count++;
    if (filters.searchQuery) count++;
    if (filters.status !== 'all') count++;
    if (filters.userTypes.length > 0) count++;
    if (filters.tags.length > 0) count++;
    return count;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className={cn("w-full max-w-4xl max-h-[90vh] overflow-auto", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Advanced Filters
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary">
                  {getActiveFiltersCount()} active
                </Badge>
              )}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quick Presets */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Quick Presets</Label>
            <div className="flex flex-wrap gap-2">
              {savedPresets.map(preset => (
                <Button
                  key={preset.id}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(preset)}
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Search Query */}
          <div>
            <Label htmlFor="search" className="text-sm font-medium mb-2 block">
              Search Query
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search analyses, batch names, user emails..."
                value={filters.searchQuery}
                onChange={(e) => updateFilter('searchQuery', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Date From</Label>
              <DatePicker
                date={filters.dateRange.from}
                onDateChange={(date) => updateFilter('dateRange', { ...filters.dateRange, from: date })}
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Date To</Label>
              <DatePicker
                date={filters.dateRange.to}
                onDateChange={(date) => updateFilter('dateRange', { ...filters.dateRange, to: date })}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Status</Label>
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Analysis Types */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Analysis Types</Label>
            <div className="grid grid-cols-2 gap-2">
              {analysisTypes.map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={filters.analysisTypes.includes(type)}
                    onCheckedChange={() => toggleArrayFilter(filters.analysisTypes, type, 'analysisTypes')}
                  />
                  <Label htmlFor={type} className="text-sm">{type}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Confidence Range */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Confidence Score Range: {filters.confidenceRange[0]}% - {filters.confidenceRange[1]}%
            </Label>
            <Slider
              value={filters.confidenceRange}
              onValueChange={(value) => updateFilter('confidenceRange', value as [number, number])}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>

          {/* Processing Time Range */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Processing Time Range: {filters.processingTimeRange[0]}s - {filters.processingTimeRange[1]}s
            </Label>
            <Slider
              value={filters.processingTimeRange}
              onValueChange={(value) => updateFilter('processingTimeRange', value as [number, number])}
              max={10}
              min={0}
              step={0.5}
              className="w-full"
            />
          </div>

          {/* User Types */}
          <div>
            <Label className="text-sm font-medium mb-2 block">User Types</Label>
            <div className="grid grid-cols-2 gap-2">
              {userTypes.map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`user-${type}`}
                    checked={filters.userTypes.includes(type)}
                    onCheckedChange={() => toggleArrayFilter(filters.userTypes, type, 'userTypes')}
                  />
                  <Label htmlFor={`user-${type}`} className="text-sm">{type}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Tags</Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <Badge
                  key={tag}
                  variant={filters.tags.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleArrayFilter(filters.tags, tag, 'tags')}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  onApplyFilters(filters);
                  onClose();
                }}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
