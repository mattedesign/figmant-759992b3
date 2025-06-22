
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, attachments = [], template, sessionId, originalMessage, contextEnhanced } = await req.json()

    console.log('🚀 ENHANCED FIGMANT ANALYSIS - Starting:', {
      sessionId,
      originalLength: originalMessage?.length || 0,
      contextualLength: message?.length || 0,
      attachmentsCount: attachments.length,
      contextEnhanced
    });

    // Get Claude API key from environment
    const claudeApiKey = Deno.env.get('CLAUDE_API_KEY')
    if (!claudeApiKey) {
      throw new Error('Claude API key not configured')
    }

    // Build the enhanced prompt
    let enhancedPrompt = `You are Figmant, an advanced UX/UI design analysis expert. You provide professional, actionable insights based on comprehensive design analysis.

ANALYSIS FRAMEWORK:
- Visual Hierarchy & Information Architecture
- User Experience Flow & Interaction Design  
- Accessibility & Usability Standards
- Brand Consistency & Design System Alignment
- Conversion Optimization & Business Impact
- Mobile Responsiveness & Cross-Platform Consistency

RESPONSE FORMAT:
Provide your analysis in structured sections with clear, actionable recommendations. Focus on both immediate improvements and strategic design direction.

`;

    // Add template context if provided
    if (template?.content) {
      enhancedPrompt += `ANALYSIS TEMPLATE CONTEXT:\n${template.content}\n\n`;
    }

    // Add the user's message (which may include conversation context)
    enhancedPrompt += `USER REQUEST:\n${message}`;

    // Add attachment context
    if (attachments.length > 0) {
      enhancedPrompt += `\n\nATTACHMENTS PROVIDED:\n`;
      attachments.forEach((att, index) => {
        enhancedPrompt += `${index + 1}. ${att.name} (${att.type})\n`;
      });
      enhancedPrompt += `\nPlease reference these attachments in your analysis when relevant.`;
    }

    // Add enhanced context instruction
    if (contextEnhanced) {
      enhancedPrompt += `\n\nIMPORTANT: This request includes conversation history and context. Use this information to provide more personalized and relevant insights that build upon previous discussions.`;
    }

    console.log('🎯 ENHANCED FIGMANT ANALYSIS - Prompt prepared:', {
      totalLength: enhancedPrompt.length,
      hasTemplate: !!template?.content,
      attachmentsIncluded: attachments.length,
      contextEnhanced
    });

    // Call Claude API
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: enhancedPrompt
          }
        ]
      })
    });

    if (!claudeResponse.ok) {
      const errorData = await claudeResponse.text();
      console.error('❌ ENHANCED FIGMANT ANALYSIS - Claude API error:', errorData);
      throw new Error(`Claude API error: ${claudeResponse.status} ${errorData}`);
    }

    const data = await claudeResponse.json();
    const analysis = data.content?.[0]?.text;

    if (!analysis) {
      throw new Error('No analysis content received from Claude');
    }

    console.log('✅ ENHANCED FIGMANT ANALYSIS - Success:', {
      sessionId,
      analysisLength: analysis.length,
      contextUsed: contextEnhanced,
      attachmentsProcessed: attachments.length
    });

    return new Response(
      JSON.stringify({
        analysis,
        analysisType: 'enhanced_figmant_chat',
        confidenceScore: contextEnhanced ? 0.92 : 0.85,
        contextUsed: contextEnhanced,
        sessionId,
        attachmentsProcessed: attachments.length,
        tokenEstimate: Math.ceil(enhancedPrompt.length / 4)
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('❌ ENHANCED FIGMANT ANALYSIS - Error:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        analysis: `I apologize, but I encountered a technical issue during the enhanced analysis. Your conversation context has been preserved, and you can try your request again.

If this issue persists, please try:
1. Refreshing the page
2. Starting a new conversation
3. Checking your internet connection

Your conversation history and attachments remain saved for when the system is available.`,
        analysisType: 'error_fallback',
        confidenceScore: 0.0,
        contextUsed: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 to avoid breaking the UI
      }
    )
  }
})
