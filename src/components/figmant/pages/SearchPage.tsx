
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Clock, 
  FileText, 
  MessageSquare, 
  Star,
  Calendar,
  TrendingUp,
  Users,
  Tag
} from 'lucide-react';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';

export const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { data: analyses = [] } = useDesignAnalyses();

  const recentSearches = [
    'mobile app design',
    'accessibility analysis',
    'conversion optimization',
    'brand consistency'
  ];

  const popularTags = [
    'ui-design',
    'mobile',
    'web',
    'accessibility',
    'branding',
    'e-commerce',
    'dashboard',
    'landing-page'
  ];

  const searchResults = {
    analyses: analyses.filter(analysis => 
      analysis.analysis_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.id.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5),
    chats: [
      {
        id: '1',
        title: 'Mobile App Design Review',
        excerpt: 'Discussed improvements for mobile navigation and accessibility features...',
        date: '2024-01-15',
        type: 'chat'
      },
      {
        id: '2',
        title: 'E-commerce Homepage Analysis',
        excerpt: 'Conversation about conversion optimization and user flow improvements...',
        date: '2024-01-14',
        type: 'chat'
      }
    ],
    templates: [
      {
        id: '1',
        title: 'Landing Page Analysis Template',
        description: 'Comprehensive template for analyzing landing page effectiveness',
        category: 'web',
        downloads: 1234
      },
      {
        id: '2',
        title: 'Mobile UI Evaluation',
        description: 'Template focused on mobile user interface analysis',
        category: 'mobile',
        downloads: 987
      }
    ]
  };

  const filteredResults = () => {
    if (!searchTerm) return { analyses: [], chats: [], templates: [] };
    
    switch (activeTab) {
      case 'analyses':
        return { analyses: searchResults.analyses, chats: [], templates: [] };
      case 'chats':
        return { analyses: [], chats: searchResults.chats, templates: [] };
      case 'templates':
        return { analyses: [], chats: [], templates: searchResults.templates };
      default:
        return searchResults;
    }
  };

  const results = filteredResults();
  const totalResults = results.analyses.length + results.chats.length + results.templates.length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search</h1>
          <p className="text-gray-600">
            Find your analyses, chats, templates, and more
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search analyses, chats, templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 text-lg"
          />
          <Button 
            variant="outline" 
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Search Suggestions */}
        {!searchTerm && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Searches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Searches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchTerm(search)}
                      className="w-full text-left p-2 text-sm hover:bg-gray-50 rounded transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Popular Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge 
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => setSearchTerm(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search Results */}
        {searchTerm && (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Search Results for "{searchTerm}"
                </h2>
                <p className="text-gray-600">
                  {totalResults} results found
                </p>
              </div>
            </div>

            {/* Results Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">
                  All ({totalResults})
                </TabsTrigger>
                <TabsTrigger value="analyses">
                  Analyses ({searchResults.analyses.length})
                </TabsTrigger>
                <TabsTrigger value="chats">
                  Chats ({searchResults.chats.length})
                </TabsTrigger>
                <TabsTrigger value="templates">
                  Templates ({searchResults.templates.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {/* Analysis Results */}
                {results.analyses.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Analyses
                    </h3>
                    {results.analyses.map((analysis) => (
                      <Card key={analysis.id} className="hover:shadow-sm transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">
                                {analysis.analysis_type} Analysis
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">
                                Analysis ID: {analysis.id.slice(0, 8)}...
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(analysis.created_at).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  {Math.round((analysis.confidence_score || 0) * 100)}% confidence
                                </span>
                              </div>
                            </div>
                            <Badge variant="outline">Analysis</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Chat Results */}
                {results.chats.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Chats
                    </h3>
                    {results.chats.map((chat) => (
                      <Card key={chat.id} className="hover:shadow-sm transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">{chat.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">{chat.excerpt}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(chat.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <Badge variant="outline">Chat</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Template Results */}
                {results.templates.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Templates
                    </h3>
                    {results.templates.map((template) => (
                      <Card key={template.id} className="hover:shadow-sm transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">{template.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {template.downloads} downloads
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {template.category}
                                </Badge>
                              </div>
                            </div>
                            <Badge variant="outline">Template</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {totalResults === 0 && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try different keywords or browse by category
                    </p>
                    <Button onClick={() => setSearchTerm('')}>
                      Clear Search
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Quick Actions */}
        {!searchTerm && (
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common searches and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 justify-start"
                  onClick={() => setSearchTerm('recent analyses')}
                >
                  <FileText className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Recent Analyses</div>
                    <div className="text-sm text-gray-500">View your latest work</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 justify-start"
                  onClick={() => setSearchTerm('premium')}
                >
                  <Star className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Premium Features</div>
                    <div className="text-sm text-gray-500">Advanced analysis tools</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 justify-start"
                  onClick={() => setSearchTerm('templates')}
                >
                  <Tag className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">All Templates</div>
                    <div className="text-sm text-gray-500">Browse template library</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
