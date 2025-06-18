import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { useUserCredits } from '@/hooks/useUserCredits';

interface FigmantChatAnalysisRequest {
  message: string;
  attachments: ChatAttachment[];
  promptTemplate?: string;
  analysisType?: string;
}

interface FigmantChatAnalysisResponse {
  analysis: string;
  uploadIds?: string[];
  debugInfo?: {
    settingsSource?: string;
    attachmentsProcessed?: number;
    [key: string]: any;
  };
}

// Add the missing hook for fetching figmant prompt templates
export const useFigmantPromptTemplates = () => {
  return useQuery({
    queryKey: ['figmant-prompt-templates'],
    queryFn: async () => {
      console.log('Fetching figmant prompt templates...');
      
      const { data, error } = await supabase
        .from('prompt_templates')
        .select('*')
        .eq('is_active', true)
        .order('display_name');
      
      if (error) {
        console.error('Error fetching figmant prompt templates:', error);
        throw error;
      }
      
      console.log('Figmant prompt templates fetched:', data?.length || 0);
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

const analyzeWithFigmantChat = async (request: FigmantChatAnalysisRequest): Promise<FigmantChatAnalysisResponse> => {
  console.log('=== FIGMANT CHAT ANALYSIS START ===');
  console.log('Starting Figmant chat analysis with:', {
    messageLength: request.message.length,
    attachmentsCount: request.attachments.length,
    analysisType: request.analysisType,
    hasPromptTemplate: !!request.promptTemplate
  });

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error('Authentication error:', authError);
    throw new Error('User not authenticated');
  }

  console.log('User authenticated:', user.id);

  // Check user access first
  console.log('Checking user access and deducting credits...');
  const { data: hasAccess, error: accessError } = await supabase
    .rpc('user_has_access', { user_id: user.id });

  if (accessError) {
    console.error('Error checking user access:', accessError);
    throw new Error('Unable to verify user access');
  }

  if (!hasAccess) {
    throw new Error('You need an active subscription or credits to perform analysis');
  }

  // Deduct credits for the analysis
  const { data: creditDeducted, error: creditError } = await supabase
    .rpc('deduct_analysis_credits', { 
      analysis_user_id: user.id,
      credits_to_deduct: 1,
      analysis_description: 'Figmant chat analysis'
    });

  if (creditError) {
    console.error('Error deducting credits:', creditError);
    throw new Error('Unable to process credit deduction');
  }

  if (!creditDeducted) {
    throw new Error('Insufficient credits for analysis');
  }

  // Process attachments - create database records for files that have upload paths
  const uploadIds: string[] = [];
  const processedAttachments: ChatAttachment[] = [];

  console.log('Processing attachments...');
  for (const attachment of request.attachments) {
    console.log('Processing attachment:', {
      id: attachment.id,
      type: attachment.type,
      name: attachment.name,
      status: attachment.status,
      hasUploadPath: !!attachment.uploadPath
    });

    if (attachment.type === 'file' && attachment.file && attachment.uploadPath && attachment.status === 'uploaded') {
      try {
        console.log('Creating database record for uploaded file:', {
          name: attachment.name,
          uploadPath: attachment.uploadPath,
          fileSize: attachment.file.size,
          mimeType: attachment.file.type
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
            use_case: 'figmant_chat'
          })
          .select('id')
          .single();

        if (dbError || !uploadRecord) {
          console.error('Failed to create upload record:', dbError);
          throw new Error(`Failed to create upload record for ${attachment.name}`);
        }

        uploadIds.push(uploadRecord.id);
        processedAttachments.push({
          ...attachment,
          uploadPath: attachment.uploadPath
        });

        console.log('Database record created successfully:', {
          uploadId: uploadRecord.id,
          fileName: attachment.name
        });
      } catch (error) {
        console.error('Error processing file attachment:', error);
        // Continue with other attachments even if one fails
      }
    } else {
      // For URL attachments or files without upload paths
      console.log('Adding non-file attachment:', {
        type: attachment.type,
        name: attachment.name,
        url: attachment.url
      });
      processedAttachments.push(attachment);
    }
  }

  // Prepare the payload for Claude AI
  const claudePayload = {
    message: request.message,
    attachments: processedAttachments,
    uploadIds,
    requestType: 'figmant_chat',
    analysisType: request.analysisType || 'general',
    promptTemplate: request.promptTemplate
  };

  console.log('Calling Claude AI edge function with payload:', {
    messageLength: claudePayload.message.length,
    attachmentsCount: claudePayload.attachments.length,
    uploadIdsCount: claudePayload.uploadIds.length,
    requestType: claudePayload.requestType,
    analysisType: claudePayload.analysisType
  });

  // Call the Claude AI edge function
  const { data, error } = await supabase.functions.invoke('claude-ai', {
    body: claudePayload
  });

  console.log('Claude AI function response:', {
    hasError: !!error,
    hasData: !!data,
    error: error,
    dataKeys: data ? Object.keys(data) : [],
    success: data?.success
  });

  if (error) {
    console.error('Claude AI function error:', error);
    throw new Error(`Analysis failed: ${error.message}`);
  }

  if (!data?.success) {
    console.error('Claude AI analysis failed:', data);
    throw new Error(data?.error || 'Analysis failed');
  }

  // Save the analysis result to chat history
  console.log('Saving analysis to chat history...');
  try {
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('chat_analysis_history')
      .insert({
        user_id: user.id,
        prompt_used: request.message,
        prompt_template_used: request.promptTemplate,
        analysis_results: { 
          response: data.analysis,
          attachments_processed: data.attachmentsProcessed || 0,
          figmant_context: {
            message: request.message,
            attachments_count: processedAttachments.length,
            upload_ids: uploadIds,
            analysis_type: request.analysisType
          }
        },
        confidence_score: 0.8,
        analysis_type: 'figmant_chat'
      })
      .select()
      .single();

    if (saveError) {
      console.error('Failed to save chat analysis to database:', saveError);
      // Don't throw error here - still return the analysis even if save fails
    } else {
      console.log('Figmant chat analysis successfully saved to database:', savedAnalysis.id);
    }
  } catch (saveError) {
    console.error('Error saving chat analysis:', saveError);
    // Continue - don't fail the entire operation if database save fails
  }

  console.log('Figmant chat analysis completed successfully:', {
    analysisLength: data.analysis?.length || 0,
    attachmentsProcessed: data.attachmentsProcessed || 0
  });

  console.log('=== FIGMANT CHAT ANALYSIS END ===');

  return {
    analysis: data.analysis,
    uploadIds: uploadIds.length > 0 ? uploadIds : undefined,
    debugInfo: data.debugInfo
  };
};

export const useFigmantChatAnalysis = () => {
  const queryClient = useQueryClient();
  const { refetchCredits } = useUserCredits();

  return useMutation({
    mutationFn: analyzeWithFigmantChat,
    onError: (error) => {
      console.error('Figmant chat analysis mutation error:', error);
    },
    onSuccess: (data) => {
      console.log('Figmant chat analysis mutation success:', {
        analysisLength: data.analysis.length,
        uploadIds: data.uploadIds?.length || 0
      });
      
      // Invalidate analysis-related queries and refresh credits
      console.log('Invalidating queries after successful Figmant analysis...');
      queryClient.invalidateQueries({ queryKey: ['design-analyses'] });
      queryClient.invalidateQueries({ queryKey: ['design-uploads'] });
      queryClient.invalidateQueries({ queryKey: ['chat-analysis-history'] });
      refetchCredits();
    }
  });
};
