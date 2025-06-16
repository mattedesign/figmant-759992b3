
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  Download, 
  Filter, 
  Search,
  TrendingUp,
  Eye,
  Archive
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InteractiveDashboardActionsProps {
  onRefresh?: () => void;
  onExport?: () => void;
  onFilter?: (filters: any) => void;
  onSearch?: (query: string) => void;
  isLoading?: boolean;
  dataCount?: number;
}

export const InteractiveDashboardActions: React.FC<InteractiveDashboardActionsProps> = ({
  onRefresh,
  onExport,
  onFilter,
  onSearch,
  isLoading = false,
  dataCount = 0
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = useCallback(async () => {
    if (!onExport) return;
    
    setIsExporting(true);
    try {
      await onExport();
      toast({
        title: "Export Successful",
        description: "Dashboard data has been exported successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Failed to export dashboard data. Please try again.",
      });
    } finally {
      setIsExporting(false);
    }
  }, [onExport, toast]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  }, [searchQuery, onSearch]);

  const quickFilters = [
    { label: 'Completed', value: 'completed', icon: TrendingUp },
    { label: 'In Progress', value: 'in_progress', icon: Eye },
    { label: 'Pending', value: 'pending', icon: Archive }
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gray-50 p-4 rounded-lg">
      {/* Search and Filters */}
      <div className="flex flex-1 items-center gap-3">
        <form onSubmit={handleSearch} className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search analyses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </form>
        
        <div className="flex gap-2">
          {quickFilters.map((filter) => (
            <Badge
              key={filter.value}
              variant="outline"
              className="cursor-pointer hover:bg-blue-50 hover:border-blue-200 flex items-center gap-1"
              onClick={() => onFilter?.({ status: filter.value })}
            >
              <filter.icon className="h-3 w-3" />
              {filter.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 hidden sm:block">
          {dataCount} items
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={isExporting || dataCount === 0}
          className="flex items-center gap-2"
        >
          <Download className={`h-4 w-4 ${isExporting ? 'animate-pulse' : ''}`} />
          Export
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFilter?.({})}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>
    </div>
  );
};
