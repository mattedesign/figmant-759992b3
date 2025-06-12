
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

import { corsHeaders } from './utils/cors.ts';
import { ClaudeMessage, AttachmentData } from './utils/types.ts';
import { logClaudeUsage } from './utils/logging.ts';
import { getClaudeSettings } from './utils/claudeSettings.ts';
import { processAttachmentsForVision } from './utils/imageProcessor.ts';

serve(async (req) => {
  console.log('=== CLAUDE AI FUNCTION START ===');
  console.log('Request method:', req.method);
  
  const startTime = Date.now();

  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  let userId: string | null = null;
  let requestType = 'unknown';

  try {
    const requestBody = await req.json();
    console.log('Request received with attachments:', requestBody.attachments?.length || 0);
    
    const message = requestBody.message || requestBody.prompt || '';
    const attachments = requestBody.attachments || [];
    const uploadIds = requestBody.uploadIds || [];
    requestType = requestBody.requestType || 'analysis';
    
    console.log('Extracted parameters:', { 
      messageLength: message?.length || 0, 
      attachmentsCount: attachments.length,
      uploadIdsCount: uploadIds.length,
      requestType
    });

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      console.error('Invalid message received:', { message, type: typeof message });
      throw new Error('Message is required and must be a non-empty string');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration not found');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('Supabase client initialized');

    // Get user ID from auth header
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser(
          authHeader.replace('Bearer ', '')
        );
        if (user && !authError) {
          userId = user.id;
          console.log('User authenticated:', userId);
        }
      } catch (error) {
        console.log('Auth check failed, proceeding without user context');
      }
    }

    const claudeSettings = await getClaudeSettings(supabase);
    
    console.log('Starting enhanced attachment processing with website support...');
    const visionContent = await processAttachmentsForVision(supabase, attachments);
    
    let messageContent: string | Array<{ type: 'text' | 'image'; text?: string; source?: any }>;
    
    if (visionContent.length === 0) {
      messageContent = message;
      console.log('Using simple text message format');
    } else {
      messageContent = [
        { type: 'text', text: message },
        ...visionContent
      ];
      console.log('Using complex message format with attachments');
    }

    console.log('Final message content structure:', {
      isSimpleString: typeof messageContent === 'string',
      hasImages: Array.isArray(messageContent) && messageContent.some(item => item.type === 'image'),
      hasWebsiteContent: Array.isArray(messageContent) && messageContent.some(item => 
        item.type === 'text' && item.text && item.text.includes('[Website:')
      ),
      contentLength: Array.isArray(messageContent) ? messageContent.length : 1
    });

    const messages: ClaudeMessage[] = [
      {
        role: 'user',
        content: messageContent
      }
    ];

    console.log('Sending request to Claude API...', {
      model: claudeSettings.model,
      messageType: typeof messageContent,
      hasImages: Array.isArray(messageContent) && messageContent.some(item => item.type === 'image'),
      hasWebsiteContent: Array.isArray(messageContent) && messageContent.some(item => 
        item.type === 'text' && item.text && item.text.includes('[Website:')
      )
    });

    const claudePayload = {
      model: claudeSettings.model,
      max_tokens: 4000,
      system: claudeSettings.systemPrompt,
      messages: messages
    };

    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeSettings.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(claudePayload)
    });

    console.log('Claude API response received:', {
      status: claudeResponse.status,
      statusText: claudeResponse.statusText,
      ok: claudeResponse.ok
    });

    if (!claudeResponse.ok) {
      const errorData = await claudeResponse.text();
      console.error('Claude API error response:', {
        status: claudeResponse.status,
        statusText: claudeResponse.statusText,
        errorData: errorData
      });

      await logClaudeUsage(
        supabase,
        userId || 'unknown',
        requestType,
        false,
        undefined,
        undefined,
        Date.now() - startTime,
        `Claude API error: ${claudeResponse.status} - ${errorData}`,
        claudeSettings.model
      );

      throw new Error(`Claude API error: ${claudeResponse.status} - ${errorData}`);
    }

    const claudeData = await claudeResponse.json();
    console.log('Claude API response data:', {
      hasContent: !!claudeData.content,
      contentLength: claudeData.content?.length || 0,
      contentType: claudeData.content?.[0]?.type,
      usage: claudeData.usage
    });

    const analysis = claudeData.content?.[0]?.text || 'No analysis available';
    const responseTime = Date.now() - startTime;

    const tokensUsed = claudeData.usage?.input_tokens + claudeData.usage?.output_tokens || 0;
    const estimatedCost = tokensUsed * 0.0001;

    console.log('Analysis extracted:', {
      analysisLength: analysis.length,
      tokensUsed,
      responseTime,
      estimatedCost
    });

    await logClaudeUsage(
      supabase,
      userId || 'system',
      requestType,
      true,
      tokensUsed,
      estimatedCost,
      responseTime,
      undefined,
      claudeSettings.model
    );

    const response = {
      analysis,
      success: true,
      attachmentsProcessed: visionContent.length,
      debugInfo: {
        totalAttachments: attachments.length,
        processedContent: visionContent.length,
        imagesProcessed: visionContent.filter(item => item.type === 'image').length,
        textItemsProcessed: visionContent.filter(item => item.type === 'text').length,
        websiteContentFetched: visionContent.filter(item => 
          item.type === 'text' && item.text && item.text.includes('[Website:')
        ).length,
        settingsSource: 'admin_settings',
        model: claudeSettings.model,
        messageReceived: !!message,
        messageLength: message.length,
        tokensUsed,
        responseTimeMs: responseTime,
        estimatedCost,
        enhancedProcessing: true,
        websiteSupport: true,
        userId: userId
      }
    };

    console.log('Sending successful response with enhanced processing and website support');
    console.log('=== CLAUDE AI FUNCTION END ===');

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('=== ERROR IN CLAUDE AI FUNCTION ===');
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        await logClaudeUsage(
          supabase,
          userId || 'unknown',
          requestType,
          false,
          undefined,
          undefined,
          Date.now() - startTime,
          error.message,
          undefined
        );
      }
    } catch (logError) {
      console.error('Failed to log error usage:', logError);
    }
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
        success: false,
        debugInfo: {
          errorType: error.name,
          timestamp: new Date().toISOString(),
          settingsSource: 'admin_settings',
          responseTimeMs: Date.now() - startTime,
          enhancedProcessing: true,
          websiteSupport: true,
          userId: userId
        }
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
