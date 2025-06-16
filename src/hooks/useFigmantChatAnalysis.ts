
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

        if (dbError || !uploadRecord) {
          console.error('Failed to create upload record:', dbError);
          throw new Error(`Failed to create upload record for ${attachment.name}`);
        }

        uploadIds.push(uploadRecord.id);
        processedAttachments.push({
          ...attachment,
          uploadPath: attachment.uploadPath
        });

        console.log('Database record created:', uploadRecord.id);
      } catch (error) {
        console.error('Error processing file attachment:', error);
      }
    } else {
      // For URL attachments or files without upload paths
      processedAttachments.push(attachment);
    }
  }

  // Build the enhanced prompt using the prompt template if provided
  let finalPrompt = request.message;
  
  if (request.promptTemplate) {
    console.log('Using custom prompt template for analysis');
    finalPrompt = `${request.promptTemplate}\n\nUser Request: ${request.message}`;
  } else {
    // Use a default comprehensive analysis prompt
    finalPrompt = `You are an expert UX analyst with deep expertise in conversion optimization, user psychology, and design best practices. 

Please analyze the provided content and respond to the user's request with comprehensive, actionable insights.

User Request: ${request.message}`;
  }

  // Prepare the payload for Claude AI
  const claudePayload = {
    message: finalPrompt,
    attachments: processedAttachments,
    uploadIds,
    requestType: 'figmant_chat_analysis'
  };

  console.log('Calling Claude AI with enhanced prompt...');

  // Call the Claude AI edge function
  const { data, error } = await supabase.functions.invoke('claude-ai', {
    body: claudePayload
  });

  console.log('Claude AI response:', {
    hasError: !!error,
    hasData: !!data,
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

  // Save the chat analysis result to database for persistence
  console.log('Saving figmant chat analysis to database...');
  try {
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('design_analysis')
      .insert({
        design_upload_id: uploadIds[0] || null,
        user_id: user.id,
        analysis_type: request.analysisType || 'figmant_chat_analysis',
        prompt_used: finalPrompt,
        analysis_results: { 
          response: data.analysis,
          attachments_processed: data.attachmentsProcessed || 0,
          figmant_context: {
            original_message: request.message,
            prompt_template_used: !!request.promptTemplate,
            analysis_type: request.analysisType,
            attachments_count: processedAttachments.length,
            upload_ids: uploadIds
          }
        },
        confidence_score: 0.8
      })
      .select()
      .single();

    if (saveError) {
      console.error('Failed to save figmant analysis to database:', saveError);
    } else {
      console.log('Figmant analysis successfully saved:', savedAnalysis.id);
    }
  } catch (saveError) {
    console.error('Error saving figmant analysis:', saveError);
  }

  console.log('=== FIGMANT CHAT ANALYSIS COMPLETE ===');

  return {
    analysis: data.analysis,
    uploadIds: uploadIds.length > 0 ? uploadIds : undefined,
    promptUsed: finalPrompt,
    debugInfo: data.debugInfo
  };
};

export const useFigmantChatAnalysis = () => {
  const { toast } = useToast();

  return {
    analyzeWithFigmantChat: useMutation({
      mutationFn: analyzeWithFigmantChat,
      onError: (error) => {
        console.error('Figmant chat analysis error:', error);
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: error instanceof Error ? error.message : 'An unexpected error occurred',
        });
      },
      onSuccess: (data) => {
        console.log('Figmant chat analysis success:', {
          analysisLength: data.analysis.length,
          uploadIds: data.uploadIds?.length || 0
        });
        
        toast({
          title: "Analysis Complete",
          description: "Your analysis has been completed and saved.",
        });
      }
    })
  };
};
