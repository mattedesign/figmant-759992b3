
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  FileText, 
  Brain, 
  AlertCircle, 
  CheckCircle,
  TrendingUp,
  Settings,
  Copy,
  Download,
  ChevronDown,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  StickyNote,
  Eye,
  EyeOff,
  Filter,
  Search
} from 'lucide-react';
import { getAnalysisSummary } from '@/utils/analysisAttachments';
import { useToast } from '@/hooks/use-toast';

interface AnalysisSection {
  id: string;
  title: string;
  content: string;
  type: 'executive_summary' | 'findings' | 'recommendations' | 'implementation' | 'risks' | 'general';
  confidence: number;
  isExpanded: boolean;
  isBookmarked: boolean;
  userNotes: string;
}

interface DetailsTabContentProps {
  analysis: any;
  analysisType: string;
}

export const DetailsTabContent: React.FC<DetailsTabContentProps> = ({
  analysis,
  analysisType
}) => {
  const { toast } = useToast();
  const [sections, setSections] = useState<AnalysisSection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSectionTypes, setSelectedSectionTypes] = useState<string[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Parse analysis results into structured sections
  const parsedSections = useMemo(() => {
    const results = analysis.analysis_results;
    if (!results) return [];

    const sections: AnalysisSection[] = [];
    
    // Executive Summary
    if (results.response || results.summary) {
      const content = results.response || results.summary;
      const summaryMatch = content.match(/(?:executive summary|summary)[:\s]*\n?((?:[^\n]+\n?){1,10})/i);
      
      sections.push({
        id: 'executive_summary',
        title: 'Executive Summary',
        content: summaryMatch ? summaryMatch[1].trim() : content.substring(0, 500) + '...',
        type: 'executive_summary',
        confidence: analysis.confidence_score || 0.85,
        isExpanded: true,
        isBookmarked: false,
        userNotes: ''
      });
    }

    // Key Findings
    if (results.response) {
      const findingsMatch = results.response.match(/(?:key findings|findings|analysis)[:\s]*\n?((?:[^\n]+\n?){1,15})/i);
      if (findingsMatch) {
        sections.push({
          id: 'findings',
          title: 'Key Findings',
          content: findingsMatch[1].trim(),
          type: 'findings',
          confidence: analysis.confidence_score || 0.85,
          isExpanded: true,
          isBookmarked: false,
          userNotes: ''
        });
      }
    }

    // Recommendations
    if (analysis.suggestions || results.recommendations) {
      const recommendations = analysis.suggestions || results.recommendations;
      const content = typeof recommendations === 'string' ? recommendations : JSON.stringify(recommendations, null, 2);
      
      sections.push({
        id: 'recommendations',
        title: 'Recommendations',
        content: content,
        type: 'recommendations',
        confidence: analysis.confidence_score || 0.85,
        isExpanded: true,
        isBookmarked: false,
        userNotes: ''
      });
    }

    // Implementation Guidelines
    if (results.response) {
      const implementationMatch = results.response.match(/(?:implementation|next steps|action items)[:\s]*\n?((?:[^\n]+\n?){1,10})/i);
      if (implementationMatch) {
        sections.push({
          id: 'implementation',
          title: 'Implementation Guidelines',
          content: implementationMatch[1].trim(),
          type: 'implementation',
          confidence: analysis.confidence_score || 0.85,
          isExpanded: false,
          isBookmarked: false,
          userNotes: ''
        });
      }
    }

    // Risk Assessment
    if (analysis.improvement_areas && analysis.improvement_areas.length > 0) {
      sections.push({
        id: 'risks',
        title: 'Risk Assessment & Areas for Improvement',
        content: analysis.improvement_areas.join('\n• '),
        type: 'risks',
        confidence: analysis.confidence_score || 0.85,
        isExpanded: false,
        isBookmarked: false,
        userNotes: ''
      });
    }

    // Full Analysis (if not already captured)
    if (results.analysis && results.analysis !== results.response) {
      sections.push({
        id: 'full_analysis',
        title: 'Detailed Analysis',
        content: results.analysis,
        type: 'general',
        confidence: analysis.confidence_score || 0.85,
        isExpanded: false,
        isBookmarked: false,
        userNotes: ''
      });
    }

    return sections;
  }, [analysis]);

  // Initialize sections state
  React.useEffect(() => {
    setSections(parsedSections);
  }, [parsedSections]);

  // Filter sections based on search and filters
  const filteredSections = useMemo(() => {
    return sections.filter(section => {
      // Search filter
      if (searchTerm && !section.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !section.content.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Type filter
      if (selectedSectionTypes.length > 0 && !selectedSectionTypes.includes(section.type)) {
        return false;
      }

      // Bookmarks filter
      if (showBookmarksOnly && !section.isBookmarked) {
        return false;
      }

      return true;
    });
  }, [sections, searchTerm, selectedSectionTypes, showBookmarksOnly]);

  const toggleSection = (sectionId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, isExpanded: !section.isExpanded }
        : section
    ));
  };

  const toggleBookmark = (sectionId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, isBookmarked: !section.isBookmarked }
        : section
    ));
    
    toast({
      title: "Bookmark Updated",
      description: "Section bookmark status has been updated.",
    });
  };

  const updateNotes = (sectionId: string, notes: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, userNotes: notes }
        : section
    ));
  };

  const copyToClipboard = async (content: string, title: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to Clipboard",
        description: `${title} has been copied to your clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy content to clipboard.",
        variant: "destructive",
      });
    }
  };

  const exportAnalysis = (format: 'pdf' | 'word' | 'text') => {
    const content = sections.map(section => 
      `${section.title}\n${'='.repeat(section.title.length)}\n\n${section.content}\n\n${section.userNotes ? `Notes: ${section.userNotes}\n\n` : ''}`
    ).join('\n');

    // For now, just copy to clipboard - would integrate with actual export libraries
    copyToClipboard(content, `Analysis Export (${format.toUpperCase()})`);
    
    toast({
      title: `Export Started`,
      description: `Analysis export in ${format.toUpperCase()} format has been copied to clipboard.`,
    });
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'executive_summary': return Brain;
      case 'findings': return Eye;
      case 'recommendations': return TrendingUp;
      case 'implementation': return CheckCircle;
      case 'risks': return AlertCircle;
      default: return FileText;
    }
  };

  const getSectionColor = (type: string) => {
    switch (type) {
      case 'executive_summary': return 'border-l-blue-500 bg-blue-50';
      case 'findings': return 'border-l-green-500 bg-green-50';
      case 'recommendations': return 'border-l-purple-500 bg-purple-50';
      case 'implementation': return 'border-l-orange-500 bg-orange-50';
      case 'risks': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const sectionTypes = ['executive_summary', 'findings', 'recommendations', 'implementation', 'risks', 'general'];

  if (sections.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Detailed Analysis Available</h3>
          <p className="text-gray-500">This analysis doesn't contain structured sections for detailed view.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Analysis Controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Detailed Analysis
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportAnalysis('text')}
                className="h-8"
              >
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
                className={`h-8 ${showBookmarksOnly ? 'bg-blue-50 border-blue-200' : ''}`}
              >
                {showBookmarksOnly ? <BookmarkCheck className="h-3 w-3 mr-1" /> : <Bookmark className="h-3 w-3 mr-1" />}
                Bookmarks
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search analysis content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                multiple
                value={selectedSectionTypes}
                onChange={(e) => setSelectedSectionTypes(Array.from(e.target.selectedOptions, option => option.value))}
                className="border border-gray-300 rounded-md text-sm px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                {sectionTypes.map(type => (
                  <option key={type} value={type}>
                    {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Export Options */}
          <div className="flex items-center gap-2 pt-2 border-t">
            <span className="text-sm text-gray-600">Export as:</span>
            <Button variant="ghost" size="sm" onClick={() => exportAnalysis('pdf')} className="h-7 px-2 text-xs">
              PDF
            </Button>
            <Button variant="ghost" size="sm" onClick={() => exportAnalysis('word')} className="h-7 px-2 text-xs">
              Word
            </Button>
            <Button variant="ghost" size="sm" onClick={() => exportAnalysis('text')} className="h-7 px-2 text-xs">
              Text
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Sections */}
      <div className="space-y-4">
        {filteredSections.map((section) => {
          const Icon = getSectionIcon(section.type);
          const colorClasses = getSectionColor(section.type);
          
          return (
            <Card 
              key={section.id} 
              className={`border-l-4 ${colorClasses} hover:shadow-md transition-all duration-200`}
            >
              <Collapsible
                open={section.isExpanded}
                onOpenChange={() => toggleSection(section.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer hover:bg-white/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white shadow-sm">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{section.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              Confidence: {Math.round(section.confidence * 100)}%
                            </Badge>
                            {section.isBookmarked && (
                              <Badge variant="default" className="text-xs bg-blue-600">
                                <BookmarkCheck className="h-3 w-3 mr-1" />
                                Bookmarked
                              </Badge>
                            )}
                            {section.userNotes && (
                              <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                                <StickyNote className="h-3 w-3 mr-1" />
                                Has Notes
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(section.id);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          {section.isBookmarked ? 
                            <BookmarkCheck className="h-4 w-4 text-blue-600" /> :
                            <Bookmark className="h-4 w-4" />
                          }
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(section.content, section.title);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        
                        {section.isExpanded ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    {/* Section Content */}
                    <div className="prose prose-sm max-w-none mb-4">
                      <div className="bg-white p-4 rounded-lg border text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {section.content}
                      </div>
                    </div>
                    
                    {/* User Notes */}
                    <div className="border-t pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <StickyNote className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Personal Notes</span>
                      </div>
                      <textarea
                        placeholder="Add your notes about this section..."
                        value={section.userNotes}
                        onChange={(e) => updateNotes(section.id, e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>

      {filteredSections.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Sections Found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters.</p>
          </CardContent>
        </Card>
      )}

      {/* Analysis Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Analysis Metadata
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Analysis ID:</span>
                <span className="font-mono">{analysis.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type:</span>
                <span>{analysisType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Sections:</span>
                <span>{sections.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Bookmarked Sections:</span>
                <span>{sections.filter(s => s.isBookmarked).length}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span>{new Date(analysis.created_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Overall Confidence:</span>
                <span>{Math.round((analysis.confidence_score || 0.8) * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sections with Notes:</span>
                <span>{sections.filter(s => s.userNotes).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Word Count:</span>
                <span>{sections.reduce((acc, s) => acc + s.content.split(' ').length, 0)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
