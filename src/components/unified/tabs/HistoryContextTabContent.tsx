
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  History, 
  Clock, 
  Target, 
  Users,
  TrendingUp,
  ExternalLink,
  Eye,
  GitBranch,
  Zap,
  Calendar,
  MessageSquare,
  FileText,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useChatAnalysisHistory } from '@/hooks/useChatAnalysisHistory';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';

interface RelatedAnalysis {
  id: string;
  type: 'premium' | 'chat' | 'wizard' | 'design';
  title: string;
  date: string;
  confidenceScore: number;
  isRelated: boolean;
  relationshipType: 'same_project' | 'similar_content' | 'follow_up' | 'comparison';
}

interface ProjectContext {
  projectName?: string;
  description?: string;
  goals?: string[];
  successMetrics?: string[];
  teamMembers?: string[];
}

interface HistoryContextTabContentProps {
  analysis: any;
  analysisType: string;
}

const TimelineItem: React.FC<{
  analysis: RelatedAnalysis;
  isFirst: boolean;
  isLast: boolean;
  onView: (analysis: RelatedAnalysis) => void;
  onPreview: (analysis: RelatedAnalysis) => void;
}> = ({ analysis, isFirst, isLast, onView, onPreview }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'premium': return Sparkles;
      case 'chat': return MessageSquare;
      case 'wizard': return Zap;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'premium': return 'text-purple-600 bg-purple-50';
      case 'chat': return 'text-blue-600 bg-blue-50';
      case 'wizard': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRelationshipBadge = (type: string) => {
    switch (type) {
      case 'same_project': return { label: 'Same Project', color: 'bg-blue-100 text-blue-800' };
      case 'similar_content': return { label: 'Similar Content', color: 'bg-green-100 text-green-800' };
      case 'follow_up': return { label: 'Follow Up', color: 'bg-purple-100 text-purple-800' };
      case 'comparison': return { label: 'Comparison', color: 'bg-orange-100 text-orange-800' };
      default: return { label: 'Related', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const Icon = getTypeIcon(analysis.type);
  const typeColor = getTypeColor(analysis.type);
  const relationship = getRelationshipBadge(analysis.relationshipType);

  return (
    <div className="relative flex items-start gap-4 group">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-6 top-12 w-0.5 h-20 bg-gray-200" />
      )}
      
      {/* Timeline Node */}
      <div className={`w-12 h-12 rounded-full ${typeColor} flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm z-10`}>
        <Icon className="h-5 w-5" />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 pb-8">
        <Card className="hover:shadow-md transition-all duration-200 group-hover:border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {analysis.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={`text-xs ${relationship.color}`}>
                    {relationship.label}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {analysis.type}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {Math.round(analysis.confidenceScore * 100)}% confidence
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  onMouseEnter={() => onPreview(analysis)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => onView(analysis)}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Open
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(analysis.date), 'MMM d, yyyy')}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(analysis.date), { addSuffix: true })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ProjectContextCard: React.FC<{ context: ProjectContext }> = ({ context }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!context.projectName && !context.description && !context.goals?.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5" />
            Project Context
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {context.projectName && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-1">Project Name</h4>
            <p className="text-gray-700">{context.projectName}</p>
          </div>
        )}
        
        {context.description && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-1">Description</h4>
            <p className="text-gray-700 text-sm leading-relaxed">{context.description}</p>
          </div>
        )}
        
        {isExpanded && (
          <>
            {context.goals && context.goals.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Analysis Goals</h4>
                <ul className="space-y-1">
                  {context.goals.map((goal, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <ArrowRight className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {context.successMetrics && context.successMetrics.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Success Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {context.successMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-700 p-2 bg-green-50 rounded">
                      <TrendingUp className="h-3 w-3 text-green-600 flex-shrink-0" />
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {context.teamMembers && context.teamMembers.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Team Members</h4>
                <div className="flex flex-wrap gap-2">
                  {context.teamMembers.map((member, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {member}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export const HistoryContextTabContent: React.FC<HistoryContextTabContentProps> = ({
  analysis,
  analysisType
}) => {
  const [previewAnalysis, setPreviewAnalysis] = useState<RelatedAnalysis | null>(null);
  const { data: chatAnalyses = [] } = useChatAnalysisHistory();
  const { data: designAnalyses = [] } = useDesignAnalyses();

  // Transform and combine analyses into RelatedAnalysis format
  const relatedAnalyses = useMemo((): RelatedAnalysis[] => {
    const allAnalyses = [
      ...chatAnalyses.map(a => ({
        id: a.id,
        type: 'chat' as const,
        title: a.analysis_results?.project_name || (typeof a.prompt_used === 'string' ? a.prompt_used.substring(0, 50) + '...' : 'Chat Analysis'),
        date: a.created_at,
        confidenceScore: a.confidence_score || 0.8,
        isRelated: true,
        relationshipType: 'similar_content' as const,
        originalData: a
      })),
      ...designAnalyses.map(a => ({
        id: a.id,
        type: (a.analysis_type === 'premium' ? 'premium' : 'design') as const,
        title: a.analysis_results?.project_name || a.analysis_results?.title || 'Design Analysis',
        date: a.created_at,
        confidenceScore: a.confidence_score || 0.8,
        isRelated: true,
        relationshipType: 'comparison' as const,
        originalData: a
      }))
    ];

    // Filter out current analysis and sort by date
    return allAnalyses
      .filter(a => a.id !== analysis.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 15); // Limit to 15 most recent
  }, [chatAnalyses, designAnalyses, analysis.id]);

  // Extract project context from analysis
  const projectContext = useMemo((): ProjectContext => {
    const results = analysis.analysis_results || {};
    
    return {
      projectName: results.project_name || analysis.title || undefined,
      description: results.project_description || results.summary?.substring(0, 200) || undefined,
      goals: results.analysis_goals || (analysis.prompt_used ? [analysis.prompt_used] : undefined),
      successMetrics: results.success_metrics || analysis.impact_summary?.key_metrics ? Object.keys(analysis.impact_summary.key_metrics) : undefined,
      teamMembers: results.team_members || undefined
    };
  }, [analysis]);

  const handleViewAnalysis = (relatedAnalysis: RelatedAnalysis) => {
    // Open analysis in new tab - this would be implemented based on routing structure
    console.log('Opening analysis:', relatedAnalysis);
    // window.open(`/analysis/${relatedAnalysis.type}/${relatedAnalysis.id}`, '_blank');
  };

  const handlePreviewAnalysis = (relatedAnalysis: RelatedAnalysis) => {
    setPreviewAnalysis(relatedAnalysis);
    console.log('Previewing analysis:', relatedAnalysis);
  };

  if (relatedAnalyses.length === 0 && Object.keys(projectContext).length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No History Available</h3>
          <p className="text-gray-500">This appears to be your first analysis. Future related analyses will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Project Context */}
      <ProjectContextCard context={projectContext} />

      {/* Related Analyses Timeline */}
      {relatedAnalyses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Related Analyses Timeline
              <Badge variant="outline">{relatedAnalyses.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatedAnalyses.map((relatedAnalysis, index) => (
                <TimelineItem
                  key={relatedAnalysis.id}
                  analysis={relatedAnalysis}
                  isFirst={index === 0}
                  isLast={index === relatedAnalyses.length - 1}
                  onView={handleViewAnalysis}
                  onPreview={handlePreviewAnalysis}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Analysis Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {relatedAnalyses.filter(a => a.type === 'chat').length}
              </div>
              <div className="text-sm text-gray-500">Chat Analyses</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {relatedAnalyses.filter(a => a.type === 'premium').length}
              </div>
              <div className="text-sm text-gray-500">Premium Analyses</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {relatedAnalyses.filter(a => a.type === 'design').length}
              </div>
              <div className="text-sm text-gray-500">Design Analyses</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(relatedAnalyses.reduce((acc, a) => acc + a.confidenceScore, 0) / relatedAnalyses.length * 100) || 0}%
              </div>
              <div className="text-sm text-gray-500">Avg Confidence</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
