
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  X, 
  SortAsc,
  SortDesc,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  FileImage
} from 'lucide-react';
import { AnalysisFilters } from '@/hooks/useAnalysisFilters';

interface AnalysisFiltersPanelProps {
  filters: AnalysisFilters;
  onFilterChange: (key: keyof AnalysisFilters, value: any) => void;
  onResetFilters: () => void;
  resultCount: number;
}

export const AnalysisFiltersPanel: React.FC<AnalysisFiltersPanelProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  resultCount
}) => {
  const hasActiveFilters = 
    filters.searchTerm !== '' ||
    filters.statusFilter !== 'all' ||
    filters.typeFilter !== 'all' ||
    filters.dateRange !== 'all';

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search analyses..."
          value={filters.searchTerm}
          onChange={(e) => onFilterChange('searchTerm', e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filters.statusFilter === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('statusFilter', 
            filters.statusFilter === 'completed' ? 'all' : 'completed'
          )}
          className="text-xs"
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Button>
        
        <Button
          variant={filters.statusFilter === 'processing' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('statusFilter', 
            filters.statusFilter === 'processing' ? 'all' : 'processing'
          )}
          className="text-xs"
        >
          <Clock className="h-3 w-3 mr-1" />
          Processing
        </Button>
        
        <Button
          variant={filters.typeFilter === 'batch' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('typeFilter', 
            filters.typeFilter === 'batch' ? 'all' : 'batch'
          )}
          className="text-xs"
        >
          <BarChart3 className="h-3 w-3 mr-1" />
          Batch
        </Button>
        
        <Button
          variant={filters.typeFilter === 'individual' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('typeFilter', 
            filters.typeFilter === 'individual' ? 'all' : 'individual'
          )}
          className="text-xs"
        >
          <FileImage className="h-3 w-3 mr-1" />
          Individual
        </Button>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-2 gap-3">
        <Select 
          value={filters.dateRange} 
          onValueChange={(value) => onFilterChange('dateRange', value)}
        >
          <SelectTrigger>
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Past week</SelectItem>
            <SelectItem value="month">Past month</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={`${filters.sortBy}-${filters.sortOrder}`} 
          onValueChange={(value) => {
            const [sortBy, sortOrder] = value.split('-');
            onFilterChange('sortBy', sortBy);
            onFilterChange('sortOrder', sortOrder);
          }}
        >
          <SelectTrigger>
            {filters.sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4 mr-2" />
            ) : (
              <SortDesc className="h-4 w-4 mr-2" />
            )}
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest first</SelectItem>
            <SelectItem value="date-asc">Oldest first</SelectItem>
            <SelectItem value="name-asc">Name A-Z</SelectItem>
            <SelectItem value="name-desc">Name Z-A</SelectItem>
            <SelectItem value="confidence-desc">Highest confidence</SelectItem>
            <SelectItem value="confidence-asc">Lowest confidence</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filter Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {resultCount} results
          </Badge>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="text-xs h-6 px-2"
            >
              <X className="h-3 w-3 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
        
        <Button variant="outline" size="sm" className="text-xs">
          <Filter className="h-3 w-3 mr-1" />
          Save filter
        </Button>
      </div>
    </div>
  );
};
