
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  History, 
  Clock, 
  Eye, 
  TrendingUp,
  FileText,
  MessageSquare,
  Sparkles,
  Calendar,
  Search,
  Filter
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useChatAnalysisHistory } from '@/hooks/useChatAnalysisHistory';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { Input } from '@/components/ui/input';

interface HistoryTabContentProps {
  analysis: any;
  analysisType: string;
}

const HistoryItem: React.FC<{
  item: any;
  type: string;
  onView: (item: any) => void;
}> = ({ item, type, onView }) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'chat': return MessageSquare;
      case 'premium': return Sparkles;
      default: return FileText;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'chat': return 'text-blue-600 bg-blue-50';
      case 'premium': return 'text-purple-600 bg-purple-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const getTitle = () => {
    if (item.analysis_results?.title) {
      return item.analysis_results.title;
    }
    if (item.analysis_results?.project_name) {
      return item.analysis_results.project_name;
    }
    if (item.prompt_used && typeof item.prompt_used === 'string') {
      return item.prompt_used.length > 60 
        ? item.prompt_used.substring(0, 60) + '...'
        : item.prompt_used;
    }
    return `${type.charAt(0).toUpperCase() + type.slice(1)} Analysis`;
  };

  const Icon = getTypeIcon();
  const typeColor = getTypeColor();
  const title = getTitle();

  return (
    <Card className="hover:shadow-sm transition-shadow cursor-pointer" onClick={() => onView(item)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg ${typeColor} flex items-center justify-center flex-shrink-0`}>
            <Icon className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm text-gray-900 truncate">
                {title}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(item);
                }}
              >
                <Eye className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <Badge variant="outline" className="text-xs capitalize">
                {type}
              </Badge>
              
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(item.created_at), 'MMM d')}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</span>
              </div>
              
              {item.confidence_score && (
                <span>{Math.round(item.confidence_score * 100)}% confidence</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const HistoryTabContent: React.FC<HistoryTabContentProps> = ({
  analysis,
  analysisType
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  
  const { data: chatAnalyses = [] } = useChatAnalysisHistory();
  const { data: designAnalyses = [] } = useDesignAnalyses();

  // Combine all analyses
  const allAnalyses = [
    ...chatAnalyses.map(a => ({ ...a, type: 'chat' })),
    ...designAnalyses.map(a => ({ ...a, type: a.analysis_type === 'premium' ? 'premium' : 'design' }))
  ]
    .filter(a => a.id !== analysis.id) // Exclude current analysis
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Filter analyses based on search and type
  const filteredAnalyses = allAnalyses.filter(item => {
    const matchesSearch = !searchTerm || 
      (item.analysis_results?.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.analysis_results?.project_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof item.prompt_used === 'string' && item.prompt_used.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || item.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleViewAnalysis = (item: any) => {
    console.log('Viewing analysis:', item);
    // Navigate to analysis - this would be implemented based on routing
  };

  const analysisTypeCounts = {
    chat: allAnalyses.filter(a => a.type === 'chat').length,
    premium: allAnalyses.filter(a => a.type === 'premium').length,
    design: allAnalyses.filter(a => a.type === 'design').length
  };

  if (allAnalyses.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis History</h3>
          <p className="text-gray-500">This appears to be your first analysis. Future analyses will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Analysis History</h3>
          <p className="text-sm text-gray-500">{allAnalyses.length} total analyses</p>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-blue-50 rounded">
            <div className="text-lg font-bold text-blue-600">{analysisTypeCounts.chat}</div>
            <div className="text-xs text-gray-500">Chat</div>
          </div>
          <div className="p-2 bg-purple-50 rounded">
            <div className="text-lg font-bold text-purple-600">{analysisTypeCounts.premium}</div>
            <div className="text-xs text-gray-500">Premium</div>
          </div>
          <div className="p-2 bg-green-50 rounded">
            <div className="text-lg font-bold text-green-600">{analysisTypeCounts.design}</div>
            <div className="text-xs text-gray-500">Design</div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search analyses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
              >
                <option value="all">All Types</option>
                <option value="chat">Chat</option>
                <option value="premium">Premium</option>
                <option value="design">Design</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis List */}
      <div className="space-y-3">
        {filteredAnalyses.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No analyses match your search criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredAnalyses.map((item) => (
            <HistoryItem
              key={item.id}
              item={item}
              type={item.type}
              onView={handleViewAnalysis}
            />
          ))
        )}
      </div>

      {/* Load More */}
      {filteredAnalyses.length > 10 && (
        <div className="text-center">
          <Button variant="outline">
            Load More Analyses
          </Button>
        </div>
      )}
    </div>
  );
};
