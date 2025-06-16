
import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Clock, 
  Star, 
  Filter,
  X,
  FileText,
  BarChart3,
  TrendingUp,
  History
} from 'lucide-react';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface SmartSearchPanelProps {
  onResultSelect: (analysis: any) => void;
  className?: string;
}

interface SearchResult {
  id: string;
  type: 'analysis' | 'recommendation' | 'insight';
  title: string;
  description: string;
  analysis: any;
  score: number;
  highlights: string[];
}

export const SmartSearchPanel: React.FC<SmartSearchPanelProps> = ({
  onResultSelect,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const { data: analyses = [] } = useDesignAnalyses();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('figmant-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save search term to recent searches
  const saveSearch = (term: string) => {
    if (term.trim() && !recentSearches.includes(term)) {
      const updated = [term, ...recentSearches.slice(0, 4)];
      setRecentSearches(updated);
      localStorage.setItem('figmant-recent-searches', JSON.stringify(updated));
    }
  };

  // Smart search algorithm
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const results: SearchResult[] = [];
    const searchLower = searchTerm.toLowerCase();

    analyses.forEach(analysis => {
      let score = 0;
      const highlights: string[] = [];

      // Search in analysis title/filename
      const title = analysis.design_upload?.file_name || 
                   analysis.batch_analysis?.name || 
                   `Analysis ${analysis.id.slice(0, 8)}`;
      
      if (title.toLowerCase().includes(searchLower)) {
        score += 10;
        highlights.push('title');
      }

      // Search in analysis type
      if (analysis.analysis_type?.toLowerCase().includes(searchLower)) {
        score += 8;
        highlights.push('type');
      }

      // Search in recommendations
      if (analysis.impact_summary?.recommendations) {
        analysis.impact_summary.recommendations.forEach((rec: any) => {
          if (rec.title?.toLowerCase().includes(searchLower) ||
              rec.description?.toLowerCase().includes(searchLower)) {
            score += 6;
            highlights.push('recommendation');
          }
        });
      }

      // Search in analysis results
      const analysisText = JSON.stringify(analysis.analysis_results || {}).toLowerCase();
      if (analysisText.includes(searchLower)) {
        score += 3;
        highlights.push('content');
      }

      if (score > 0) {
        results.push({
          id: analysis.id,
          type: 'analysis',
          title,
          description: analysis.impact_summary?.summary || 'No description available',
          analysis,
          score,
          highlights
        });

        // Add individual recommendations as separate results
        if (analysis.impact_summary?.recommendations) {
          analysis.impact_summary.recommendations.forEach((rec: any, index: number) => {
            if (rec.title?.toLowerCase().includes(searchLower) ||
                rec.description?.toLowerCase().includes(searchLower)) {
              results.push({
                id: `${analysis.id}-rec-${index}`,
                type: 'recommendation',
                title: rec.title || `Recommendation ${index + 1}`,
                description: rec.description || '',
                analysis,
                score: score - 1,
                highlights: ['recommendation']
              });
            }
          });
        }
      }
    });

    return results.sort((a, b) => b.score - a.score).slice(0, 20);
  }, [searchTerm, analyses]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      saveSearch(term);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'analysis':
        return BarChart3;
      case 'recommendation':
        return Star;
      case 'insight':
        return TrendingUp;
      default:
        return FileText;
    }
  };

  const getHighlightColor = (highlight: string) => {
    switch (highlight) {
      case 'title':
        return 'bg-blue-100 text-blue-800';
      case 'type':
        return 'bg-green-100 text-green-800';
      case 'recommendation':
        return 'bg-yellow-100 text-yellow-800';
      case 'content':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={cn("h-full flex flex-col bg-white", className)}>
      {/* Search Header */}
      <div className="flex-none p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search analyses, recommendations, insights..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 pr-10"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={clearSearch}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {!searchTerm ? (
          // Recent searches and suggestions
          <div className="p-4 space-y-6">
            {recentSearches.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Recent Searches
                </h3>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="w-full text-left p-2 rounded-md hover:bg-gray-50 text-sm text-gray-600"
                    >
                      <Clock className="h-3 w-3 inline mr-2" />
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Quick Filters
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'high confidence',
                  'recent analyses',
                  'recommendations',
                  'visual hierarchy',
                  'conversion optimization'
                ].map((filter) => (
                  <Button
                    key={filter}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearch(filter)}
                    className="text-xs"
                  >
                    <Filter className="h-3 w-3 mr-1" />
                    {filter}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Search results
          <div className="p-4">
            {searchResults.length > 0 ? (
              <div className="space-y-3">
                <div className="text-sm text-gray-600 mb-4">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchTerm}"
                </div>
                
                {searchResults.map((result) => {
                  const Icon = getResultIcon(result.type);
                  const createdDate = result.analysis.created_at ? 
                    new Date(result.analysis.created_at) : new Date();
                  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

                  return (
                    <Card 
                      key={result.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => onResultSelect(result.analysis)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Icon className="h-4 w-4 text-blue-600" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900 truncate">
                                {result.title}
                              </h4>
                              <Badge variant="secondary" className="text-xs">
                                {result.type}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {result.description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                {result.highlights.map((highlight, index) => (
                                  <Badge 
                                    key={index}
                                    variant="secondary" 
                                    className={cn("text-xs", getHighlightColor(highlight))}
                                  >
                                    {highlight}
                                  </Badge>
                                ))}
                              </div>
                              
                              <span className="text-xs text-gray-500">
                                {timeAgo}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or browse your recent analyses.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
