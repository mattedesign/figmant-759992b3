
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('=== FIGMANT CHAT ANALYSIS FUNCTION START ===');
  console.log('Request method:', req.method);
  
  const startTime = Date.now();

  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  let userId: string | null = null;
  let requestType = 'figmant_chat_analysis';

  try {
    const requestBody = await req.json();
    console.log('🔥 FIGMANT CHAT - Request received:', {
      hasMessage: !!requestBody.message,
      messageLength: requestBody.message?.length || 0,
      attachmentsCount: requestBody.attachments?.length || 0,
      templateCategory: requestBody.template?.category || 'none',
      analysisType: requestBody.analysis_type || 'unknown'
    });
    
    const message = requestBody.message || '';
    const attachments = requestBody.attachments || [];
    const template = requestBody.template || { category: 'competitor' };
    const analysisType = requestBody.analysis_type || 'figmant_chat_analysis';
    
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

    // Call the existing claude-ai function to do the actual analysis
    console.log('🔥 FIGMANT CHAT - Calling claude-ai function...');
    
    const { data: claudeData, error: claudeError } = await supabase.functions.invoke('claude-ai', {
      body: {
        message: message,
        attachments: attachments,
        requestType: analysisType,
        template: template
      }
    });

    console.log('🔥 FIGMANT CHAT - Claude response:', {
      hasData: !!claudeData,
      hasError: !!claudeError,
      success: claudeData?.success
    });

    if (claudeError) {
      console.error('Claude function error:', claudeError);
      throw new Error(`Analysis service error: ${claudeError.message}`);
    }

    if (!claudeData) {
      console.error('No data returned from Claude function');
      throw new Error('No analysis data returned from service');
    }

    if (!claudeData.success) {
      console.error('Claude function returned unsuccessful result:', claudeData);
      throw new Error(claudeData.error || 'Analysis failed');
    }

    const analysis = claudeData.analysis || 'Analysis completed successfully';
    const responseTime = Date.now() - startTime;

    console.log('🔥 FIGMANT CHAT - Analysis completed successfully:', {
      analysisLength: analysis.length,
      responseTime,
      userId: userId
    });

    const response = {
      analysis,
      response: analysis, // For backward compatibility
      success: true,
      confidence_score: 85,
      debugInfo: {
        responseTimeMs: responseTime,
        userId: userId,
        analysisType: analysisType,
        templateCategory: template.category,
        claudeData: claudeData.debugInfo
      }
    };

    console.log('🔥 FIGMANT CHAT - Sending successful response');
    console.log('=== FIGMANT CHAT ANALYSIS FUNCTION END ===');

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('=== ERROR IN FIGMANT CHAT ANALYSIS FUNCTION ===');
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
        success: false,
        debugInfo: {
          errorType: error.name,
          timestamp: new Date().toISOString(),
          responseTimeMs: Date.now() - startTime,
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
