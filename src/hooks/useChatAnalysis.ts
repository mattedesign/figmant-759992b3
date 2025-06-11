
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { useBatchUploadDesign } from './useBatchUploadDesign';
import { useChatUseCaseMapping } from './useChatUseCaseMapping';

interface ChatAnalysisRequest {
  message: string;
  attachments: ChatAttachment[];
}

interface ChatAnalysisResponse {
  analysis: string;
  uploadIds: string[];
  batchId?: string;
}

export const useChatAnalysis = () => {
  const { toast } = useToast();
  const batchUpload = useBatchUploadDesign();
  const { getCategoryForUseCase } = useChatUseCaseMapping();

  const analyzeWithChat = useMutation({
    mutationFn: async ({ message, attachments }: ChatAnalysisRequest): Promise<ChatAnalysisResponse> => {
      // Map the user's message to a proper use case ID
      const useCaseId = getCategoryForUseCase(message);
      
      // Extract files and URLs from attachments
      const files = attachments
        .filter(att => att.type === 'file' && att.file)
        .map(att => att.file!);
      
      const urls = attachments
        .filter(att => att.type === 'url' && att.url)
        .map(att => att.url!);

      // If we have attachments, process them for analysis
      if (files.length > 0 || urls.length > 0) {
        const batchName = `Chat Analysis - ${new Date().toLocaleDateString()}`;
        const analysisGoals = `User Request: ${message}`;

        // Use existing batch upload system
        const result = await batchUpload.mutateAsync({
          files,
          urls,
          contextFiles: [],
          useCase: useCaseId,
          batchName,
          analysisGoals,
          analysisPreferences: {
            auto_comparative: files.length > 1 || urls.length > 1,
            context_integration: true,
            analysis_depth: 'detailed'
          }
        });

        return {
          analysis: `I've successfully uploaded and started analyzing your ${files.length + urls.length} item(s). Based on your request: "${message}", I'll provide detailed insights tailored to ${useCaseId} optimization. The analysis results are now available below.`,
          uploadIds: result.uploads.map(u => u.id),
          batchId: result.batchId
        };
      } else {
        // Handle text-only queries with helpful guidance
        return {
          analysis: `I'd be happy to help with "${message}". To provide specific analysis and recommendations, please upload some designs (images, PDFs) or share website URLs. I can analyze them for conversion optimization, user experience improvements, visual hierarchy, and more.`,
          uploadIds: []
        };
      }
    },
    onSuccess: () => {
      toast({
        title: "Analysis Complete",
        description: "Your design analysis is ready! Check the results below.",
      });
    },
    onError: (error) => {
      console.error('Chat analysis failed:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "I encountered an error while processing your request. Please try again.",
      });
    }
  });

  return { analyzeWithChat };
};
