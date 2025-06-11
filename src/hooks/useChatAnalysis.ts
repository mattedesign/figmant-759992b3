
import { useMutation } from '@tanstack/react-query';
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
}

const analyzeWithChatAPI = async (request: ChatAnalysisRequest): Promise<ChatAnalysisResponse> => {
  console.log('Starting chat analysis with:', {
    messageLength: request.message.length,
    attachmentsCount: request.attachments.length
  });

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  // Process attachments - create database records for files that have upload paths
  const uploadIds: string[] = [];
  const processedAttachments: ChatAttachment[] = [];

  for (const attachment of request.attachments) {
    if (attachment.type === 'file' && attachment.file && attachment.uploadPath && attachment.status === 'uploaded') {
      try {
        console.log('Creating database record for uploaded file:', attachment.name);

        // Create database record for the already uploaded file
        const { data: uploadRecord, error: dbError } = await supabase
          .from('design_uploads')
          .insert({
            user_id: user.id,
            file_name: attachment.file.name,
            file_path: attachment.uploadPath,
            file_size: attachment.file.size,
            mime_type: attachment.file.type,
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

        console.log('Database record created successfully:', uploadRecord.id);
      } catch (error) {
        console.error('Error processing file attachment:', error);
        // Continue with other attachments even if one fails
      }
    } else {
      // For URL attachments or files without upload paths
      processedAttachments.push(attachment);
    }
  }

  // Get Claude settings
  const { data: settingsData, error: settingsError } = await supabase
    .rpc('get_claude_settings');

  if (settingsError) {
    console.error('Failed to get Claude settings:', settingsError);
    throw new Error('Failed to get Claude AI configuration');
  }

  const settings = Array.isArray(settingsData) ? settingsData[0] : settingsData;
  
  if (!settings?.claude_ai_enabled) {
    throw new Error('Claude AI is not enabled. Please contact your administrator.');
  }

  console.log('Claude settings retrieved:', {
    enabled: settings.claude_ai_enabled,
    model: settings.claude_model
  });

  // Call the Claude AI edge function
  const { data, error } = await supabase.functions.invoke('claude-ai', {
    body: {
      message: request.message,
      attachments: processedAttachments,
      uploadIds,
      model: settings.claude_model,
      systemPrompt: settings.claude_system_prompt
    }
  });

  if (error) {
    console.error('Claude AI function error:', error);
    throw new Error(`Analysis failed: ${error.message}`);
  }

  if (!data?.success) {
    console.error('Claude AI analysis failed:', data);
    throw new Error(data?.error || 'Analysis failed');
  }

  console.log('Chat analysis completed successfully');

  return {
    analysis: data.analysis,
    uploadIds: uploadIds.length > 0 ? uploadIds : undefined
  };
};

export const useChatAnalysis = () => {
  return {
    analyzeWithChat: useMutation({
      mutationFn: analyzeWithChatAPI,
      onError: (error) => {
        console.error('Chat analysis mutation error:', error);
      },
      onSuccess: (data) => {
        console.log('Chat analysis completed:', {
          analysisLength: data.analysis.length,
          uploadIds: data.uploadIds?.length || 0
        });
      }
    })
  };
};
