
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

interface ChatAnalysisRequest {
  message: string;
  attachments: ChatAttachment[];
}

interface ChatAnalysisResponse {
  analysis: string;
  uploadIds?: string[];
  batchId?: string;
  debugInfo?: {
    settingsSource?: string;
    attachmentsProcessed?: number;
    [key: string]: any;
  };
}

const analyzeWithChatAPI = async (request: ChatAnalysisRequest): Promise<ChatAnalysisResponse> => {
  console.log('=== CHAT ANALYSIS START ===');
  console.log('Starting chat analysis with:', {
    messageLength: request.message.length,
    attachmentsCount: request.attachments.length,
    attachments: request.attachments.map(att => ({
      id: att.id,
      type: att.type,
      name: att.name,
      status: att.status,
      hasUploadPath: !!att.uploadPath,
      hasUrl: !!att.url,
      uploadPath: att.uploadPath
    }))
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
    console.log('Processing attachment:', {
      id: attachment.id,
      type: attachment.type,
      name: attachment.name,
      status: attachment.status,
      hasUploadPath: !!attachment.uploadPath,
      hasUrl: !!attachment.url
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
            use_case: 'chat_analysis'
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

  console.log('Processed attachments summary:', {
    totalProcessed: processedAttachments.length,
    uploadIds: uploadIds,
    attachmentTypes: processedAttachments.map(att => att.type)
  });

  // Prepare the payload for Claude AI (simplified - edge function will get settings)
  const claudePayload = {
    message: request.message,
    attachments: processedAttachments,
    uploadIds
  };

  console.log('Calling Claude AI edge function with payload:', {
    messageLength: claudePayload.message.length,
    attachmentsCount: claudePayload.attachments.length,
    uploadIdsCount: claudePayload.uploadIds.length,
    attachmentDetails: claudePayload.attachments.map(att => ({
      type: att.type,
      name: att.name,
      hasUploadPath: !!att.uploadPath,
      hasUrl: !!att.url
    }))
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
    success: data?.success,
    settingsSource: data?.debugInfo?.settingsSource
  });

  if (error) {
    console.error('Claude AI function error:', error);
    throw new Error(`Analysis failed: ${error.message}`);
  }

  if (!data?.success) {
    console.error('Claude AI analysis failed:', data);
    throw new Error(data?.error || 'Analysis failed');
  }

  // CRITICAL FIX: Save the chat analysis result to database for persistence
  console.log('Saving chat analysis to database...');
  try {
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('design_analysis')
      .insert({
        design_upload_id: uploadIds[0] || null, // Use first upload ID if available
        user_id: user.id,
        analysis_type: 'chat_analysis',
        prompt_used: request.message,
        analysis_results: { 
          response: data.analysis,
          attachments_processed: data.attachmentsProcessed || 0,
          chat_context: {
            message: request.message,
            attachments_count: processedAttachments.length,
            upload_ids: uploadIds
          }
        },
        confidence_score: 0.8
      })
      .select()
      .single();

    if (saveError) {
      console.error('Failed to save chat analysis to database:', saveError);
      // Don't throw error here - still return the analysis even if save fails
    } else {
      console.log('Chat analysis successfully saved to database:', savedAnalysis.id);
    }
  } catch (saveError) {
    console.error('Error saving chat analysis:', saveError);
    // Continue - don't fail the entire operation if database save fails
  }

  console.log('Chat analysis completed successfully:', {
    analysisLength: data.analysis?.length || 0,
    attachmentsProcessed: data.attachmentsProcessed || 0,
    settingsSource: data.debugInfo?.settingsSource
  });

  console.log('=== CHAT ANALYSIS END ===');

  return {
    analysis: data.analysis,
    uploadIds: uploadIds.length > 0 ? uploadIds : undefined,
    debugInfo: data.debugInfo
  };
};

export const useChatAnalysis = () => {
  const queryClient = useQueryClient();

  return {
    analyzeWithChat: useMutation({
      mutationFn: analyzeWithChatAPI,
      onError: (error) => {
        console.error('Chat analysis mutation error:', error);
      },
      onSuccess: (data) => {
        console.log('Chat analysis mutation success:', {
          analysisLength: data.analysis.length,
          uploadIds: data.uploadIds?.length || 0
        });
        
        // CRITICAL: Invalidate all analysis-related queries to refresh the UI
        console.log('Invalidating analysis queries after successful chat analysis...');
        queryClient.invalidateQueries({ queryKey: ['design-analyses'] });
        queryClient.invalidateQueries({ queryKey: ['design-uploads'] });
        queryClient.invalidateQueries({ queryKey: ['chat-analysis-history'] });
      }
    })
  };
};
