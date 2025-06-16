
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

interface FigmantChatRequest {
  message: string;
  attachments: ChatAttachment[];
  promptTemplate?: string;
  analysisType?: string;
}

interface FigmantChatResponse {
  analysis: string;
  uploadIds?: string[];
  promptUsed?: string;
  debugInfo?: any;
}

// Hook to get available prompt templates
export const useFigmantPromptTemplates = () => {
  return useQuery({
    queryKey: ['figmant-prompt-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('claude_prompt_examples')
        .select('*')
        .eq('is_active', true)
        .order('effectiveness_rating', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });
};

// Hook to get best prompt for a specific category
export const useBestFigmantPrompt = (category: string) => {
  return useQuery({
    queryKey: ['best-figmant-prompt', category],
    queryFn: async () => {
      if (!category) return null;
      
      const { data, error } = await supabase.rpc('get_best_prompt_for_category', {
        category_name: category
      });
      
      if (error) throw error;
      return data[0] || null;
    },
    enabled: !!category
  });
};

const analyzeWithFigmantChat = async (request: FigmantChatRequest): Promise<FigmantChatResponse> => {
  console.log('=== FIGMANT CHAT ANALYSIS START ===');
  console.log('Request:', {
    messageLength: request.message.length,
    attachmentsCount: request.attachments.length,
    hasPromptTemplate: !!request.promptTemplate,
    analysisType: request.analysisType
  });

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error('Authentication error:', authError);
    throw new Error('User not authenticated');
  }

  console.log('User authenticated:', user.id);

  // Process attachments - create database records for files that have upload paths
  const uploadIds: string[] = [];
  const processedAttachments: ChatAttachment[] = [];

  console.log('Processing attachments...');
  for (const attachment of request.attachments) {
    if (attachment.type === 'file' && attachment.file && attachment.uploadPath && attachment.status === 'uploaded') {
      try {
        console.log('Creating database record for uploaded file:', {
          name: attachment.name,
          uploadPath: attachment.uploadPath
        });

        // Create database record for the already uploaded file
        const { data: uploadRecord, error: dbError } = await supabase
          .from('design_uploads')
          .insert({
            user_id: user.id,
            file_name: attachment.file.name,
            file_path: attachment.uploadPath,
            file_size: attachment.file.size,
            file_type: attachment.file.type,
            use_case: 'figmant_chat_analysis'
          })
          .select('id')
          .single();

        if (dbError) {
          console.error('Database error creating upload record:', dbError);
          throw dbError;
        }

        uploadIds.push(uploadRecord.id);
        processedAttachments.push(attachment);
        console.log('Created upload record:', uploadRecord.id);
      } catch (error) {
        console.error('Error processing file attachment:', error);
        // Continue with other attachments
      }
    } else if (attachment.type === 'url') {
      // Handle URL attachments
      try {
        const { data: uploadRecord, error: dbError } = await supabase
          .from('design_uploads')
          .insert({
            user_id: user.id,
            file_name: attachment.name,
            source_url: attachment.url,
            use_case: 'figmant_chat_analysis',
            source_type: 'url'
          })
          .select('id')
          .single();

        if (dbError) {
          console.error('Database error creating URL record:', dbError);
          throw dbError;
        }

        uploadIds.push(uploadRecord.id);
        processedAttachments.push(attachment);
        console.log('Created URL record:', uploadRecord.id);
      } catch (error) {
        console.error('Error processing URL attachment:', error);
      }
    }
  }

  console.log('Processed attachments:', uploadIds.length);

  // Call Claude AI function
  const { data: claudeResponse, error: claudeError } = await supabase.functions.invoke('claude-ai', {
    body: {
      message: request.message,
      attachments: processedAttachments,
      promptTemplate: request.promptTemplate,
      analysisType: request.analysisType || 'figmant_chat',
      uploadIds: uploadIds
    }
  });

  if (claudeError) {
    console.error('Claude AI error:', claudeError);
    throw new Error(`Analysis failed: ${claudeError.message}`);
  }

  console.log('Claude AI response received:', !!claudeResponse);

  // Save the chat analysis to database
  try {
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('chat_analysis_history')
      .insert({
        user_id: user.id,
        prompt_used: request.message,
        prompt_template_used: request.promptTemplate || null,
        analysis_results: {
          response: claudeResponse.analysis || claudeResponse.response,
          attachments_processed: processedAttachments.length,
          upload_ids: uploadIds,
          debug_info: claudeResponse.debugInfo
        },
        confidence_score: claudeResponse.confidence_score || 0.8,
        analysis_type: request.analysisType || 'figmant_chat'
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving analysis history:', saveError);
      // Don't throw here as the analysis was successful
    } else {
      console.log('Analysis saved to history:', savedAnalysis.id);
    }
  } catch (error) {
    console.error('Failed to save analysis history:', error);
  }

  return {
    analysis: claudeResponse.analysis || claudeResponse.response || 'Analysis completed',
    uploadIds: uploadIds,
    promptUsed: request.promptTemplate || request.message,
    debugInfo: claudeResponse.debugInfo
  };
};

export const useFigmantChatAnalysis = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: analyzeWithFigmantChat,
    onError: (error) => {
      console.error('Figmant chat analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "An error occurred during analysis",
        variant: "destructive"
      });
    }
  });
};
