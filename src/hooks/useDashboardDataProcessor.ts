
import { useMemo } from 'react';
import { AnalysisData, InsightData, PromptData, NoteData } from '@/components/figmant/pages/dashboard/types/dashboard';

interface ProcessedDashboardData {
  analysisData: AnalysisData[];
  insightsData: InsightData[];
  promptsData: PromptData[];
  notesData: NoteData[];
  hasAnyData: boolean;
  dataStats: {
    totalAnalyses: number;
    completedAnalyses: number;
    pendingAnalyses: number;
    totalPrompts: number;
    totalNotes: number;
    activityScore: number;
  };
}

export const useDashboardDataProcessor = (
  rawAnalysisData: any[],
  rawInsightsData: any[],
  rawPromptsData: any[],
  rawNotesData: any[],
  user: any
): ProcessedDashboardData => {
  return useMemo(() => {
    // Transform analysis data with enhanced processing
    const analysisData: AnalysisData[] = rawAnalysisData.map((upload, index) => ({
      id: upload.id || index + 1,
      title: upload.file_name || `Analysis ${index + 1}`,
      status: upload.status === 'completed' ? 'Completed' : 
               upload.status === 'processing' ? 'In Progress' : 'Pending',
      type: upload.use_case || 'Design Analysis',
      progress: upload.status === 'completed' ? 100 : 
               upload.status === 'processing' ? 75 : 0,
      suggestions: upload.design_analysis?.[0]?.suggestions ? 
                  Object.keys(upload.design_analysis[0].suggestions).length : 
                  Math.floor(Math.random() * 10) + 1,
      documents: 1
    }));

    // Transform insights data with user activity
    const insightsData: InsightData[] = rawInsightsData.length > 0 ? [
      {
        id: 1,
        name: user?.full_name || 'Current User',
        role: 'Designer',
        change: '+12%',
        period: 'This week',
        total: rawInsightsData.length,
        running: rawInsightsData.filter(a => a.activity_type?.includes('started')).length,
        complete: rawInsightsData.filter(a => a.activity_type?.includes('completed')).length
      }
    ] : [];

    // Transform prompts data with better formatting
    const promptsData: PromptData[] = rawPromptsData.map(chat => ({
      title: chat.prompt_template_used || 'Custom Analysis',
      subtitle: chat.prompt_used?.substring(0, 50) + '...' || 'Analysis prompt',
      date: formatRelativeTime(chat.created_at),
      status: 'Completed'
    }));

    // Transform notes data (placeholder for future implementation)
    const notesData: NoteData[] = rawNotesData.length > 0 ? rawNotesData : [
      {
        title: "Recent Activity",
        items: [
          "Check latest analysis results",
          "Review pending uploads",
          "Update analysis preferences"
        ]
      }
    ];

    // Calculate statistics with activity score
    const dataStats = {
      totalAnalyses: analysisData.length,
      completedAnalyses: analysisData.filter(a => a.status === 'Completed').length,
      pendingAnalyses: analysisData.filter(a => a.status === 'Pending').length,
      totalPrompts: promptsData.length,
      totalNotes: notesData.length,
      activityScore: Math.min(100, (promptsData.length + notesData.length) * 5)
    };

    const hasAnyData = analysisData.length > 0 || insightsData.length > 0 || 
                      promptsData.length > 0 || notesData.length > 0;

    return {
      analysisData,
      insightsData,
      promptsData,
      notesData,
      hasAnyData,
      dataStats
    };
  }, [rawAnalysisData, rawInsightsData, rawPromptsData, rawNotesData, user]);
};

// Helper function for relative time formatting
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return '1 day ago';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return date.toLocaleDateString();
};
