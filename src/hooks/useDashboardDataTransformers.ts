
import { AnalysisData, InsightData, PromptData, NoteData } from '@/components/figmant/pages/dashboard/types/dashboard';

// Transform design uploads to AnalysisData format
export const transformToAnalysisData = (uploads: any[]): AnalysisData[] => {
  return uploads.map((upload, index) => ({
    id: index + 1,
    title: upload.file_name || 'Untitled Analysis',
    status: upload.status === 'completed' ? 'Completed' : 
           upload.status === 'processing' ? 'In Progress' : 'Pending',
    type: upload.use_case || 'Design Analysis',
    progress: upload.status === 'completed' ? 100 : 
             upload.status === 'processing' ? 75 : 0,
    suggestions: upload.design_analysis?.[0]?.suggestions ? 
                Object.keys(upload.design_analysis[0].suggestions).length : 0,
    documents: 1
  }));
};

// Transform activity logs to InsightData format
export const transformToInsightData = (activities: any[], user: any): InsightData[] => {
  // Create mock insights based on user activity
  const baseInsights = [
    {
      id: 1,
      name: user?.full_name || 'Current User',
      role: 'Designer',
      change: '+12%',
      period: 'This week',
      total: activities.length,
      running: activities.filter(a => a.activity_type === 'analysis_started').length,
      complete: activities.filter(a => a.activity_type === 'analysis_completed').length
    }
  ];
  
  return baseInsights;
};

// Transform chat history to PromptData format
export const transformToPromptData = (chats: any[]): PromptData[] => {
  return chats.map(chat => ({
    title: chat.prompt_template_used || 'Custom Analysis',
    subtitle: chat.prompt_used?.substring(0, 50) + '...' || 'Analysis prompt',
    date: formatRelativeTime(chat.created_at),
    status: 'Completed'
  }));
};

// Transform notes data (placeholder for now)
export const transformToNoteData = (notes: any[]): NoteData[] => {
  // Return default notes for now
  return [
    {
      title: "Recent Activity",
      items: [
        "Check latest analysis results",
        "Review pending uploads",
        "Update analysis preferences"
      ]
    }
  ];
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
