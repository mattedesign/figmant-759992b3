
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, Clock } from 'lucide-react';
import { AdvancedFilters } from '@/hooks/filters/types';

interface SearchSectionProps {
  searchTerm: string;
  searchHistory: string[];
  showSearchHistory: boolean;
  setShowSearchHistory: (show: boolean) => void;
  updateFilter: (key: keyof AdvancedFilters, value: any) => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  searchTerm,
  searchHistory,
  showSearchHistory,
  setShowSearchHistory,
  updateFilter
}) => {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search analyses, types, batch names..."
          value={searchTerm}
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
  );
};
