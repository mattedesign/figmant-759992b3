import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, userId, requestType = 'analysis' } = await req.json();

    if (!prompt || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: prompt and userId' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get Claude settings from admin_settings
    const { data: settings, error: settingsError } = await supabase
      .rpc('get_claude_settings');

    if (settingsError || !settings || settings.length === 0) {
      console.error('Failed to get Claude settings:', settingsError);
      return new Response(
        JSON.stringify({ error: 'Claude AI is not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const claudeSettings = settings[0];

    if (!claudeSettings.claude_ai_enabled) {
      return new Response(
        JSON.stringify({ error: 'Claude AI is disabled' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    // Get Claude API key from admin settings with proper parsing
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', 'claude_api_key')
      .single();

    if (apiKeyError || !apiKeyData?.setting_value) {
      console.error('Claude API key not found:', apiKeyError);
      return new Response(
        JSON.stringify({ error: 'Claude API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Parse the API key - handle both old format (direct value) and new format (JSON with value property)
    let claudeApiKey;
    if (typeof apiKeyData.setting_value === 'object' && apiKeyData.setting_value && 'value' in apiKeyData.setting_value) {
      claudeApiKey = (apiKeyData.setting_value as any).value;
    } else {
      claudeApiKey = apiKeyData.setting_value as string;
    }

    console.log('Using Claude API key:', claudeApiKey ? claudeApiKey.substring(0, 10) + '...' : 'undefined');

    // Make request to Claude API
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: claudeSettings.claude_model,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `${claudeSettings.claude_system_prompt}\n\nUser request: ${prompt}`
          }
        ]
      })
    });

    if (!claudeResponse.ok) {
      const errorData = await claudeResponse.text();
      console.error('Claude API error:', errorData);
      
      // Log failed request
      await supabase.from('claude_usage_logs').insert({
        user_id: userId,
        request_type: requestType,
        request_data: { prompt, model: claudeSettings.claude_model },
        success: false,
        error_message: `Claude API error: ${claudeResponse.status} ${errorData}`
      });

      return new Response(
        JSON.stringify({ error: 'Failed to get response from Claude AI' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const claudeData = await claudeResponse.json();
    const responseText = claudeData.content[0]?.text || '';
    const tokensUsed = claudeData.usage?.input_tokens + claudeData.usage?.output_tokens || 0;
    
    // Estimate cost (rough estimation based on Claude pricing)
    const costPerToken = 0.00001; // Approximate cost per token
    const estimatedCost = tokensUsed * costPerToken;

    // Log successful request
    await supabase.from('claude_usage_logs').insert({
      user_id: userId,
      request_type: requestType,
      tokens_used: tokensUsed,
      cost_usd: estimatedCost,
      request_data: { prompt, model: claudeSettings.claude_model },
      response_data: claudeData,
      success: true
    });

    // Parse response if it's an insights request
    if (requestType === 'insights') {
      try {
        // Try to parse structured insights from Claude's response
        const insights = parseInsightsFromResponse(responseText);
        
        // Store insights in database
        for (const insight of insights) {
          await supabase.from('claude_insights').insert({
            user_id: userId,
            title: insight.title,
            description: insight.description,
            insight_type: insight.type,
            priority: insight.priority,
            impact_area: insight.impact,
            confidence_score: insight.confidence || 0.8,
            data_source: { prompt, model: claudeSettings.claude_model },
            recommendations: insight.recommendations || []
          });
        }
      } catch (parseError) {
        console.error('Failed to parse insights:', parseError);
      }
    }

    return new Response(
      JSON.stringify({ 
        response: responseText,
        tokensUsed,
        estimatedCost: estimatedCost.toFixed(4)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in claude-ai function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

function parseInsightsFromResponse(response: string) {
  // Simple parser to extract structured insights from Claude's response
  // This is a basic implementation - you might want to improve this based on Claude's response format
  const insights = [];
  
  try {
    // Look for common insight patterns in the response
    const lines = response.split('\n').filter(line => line.trim());
    
    let currentInsight = null;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Check if this line starts a new insight
      if (trimmedLine.includes('improvement') || trimmedLine.includes('issue') || 
          trimmedLine.includes('trend') || trimmedLine.includes('recommendation')) {
        
        if (currentInsight) {
          insights.push(currentInsight);
        }
        
        currentInsight = {
          title: trimmedLine.substring(0, 100),
          description: trimmedLine,
          type: detectInsightType(trimmedLine),
          priority: detectPriority(trimmedLine),
          impact: detectImpactArea(trimmedLine),
          confidence: 0.8
        };
      } else if (currentInsight && trimmedLine.length > 20) {
        // Add to description if we have a current insight
        currentInsight.description += ' ' + trimmedLine;
      }
    }
    
    if (currentInsight) {
      insights.push(currentInsight);
    }
    
    // If no structured insights found, create a general one
    if (insights.length === 0) {
      insights.push({
        title: 'AI Analysis Result',
        description: response.substring(0, 500),
        type: 'analysis',
        priority: 'medium',
        impact: 'general',
        confidence: 0.7
      });
    }
    
  } catch (error) {
    console.error('Error parsing insights:', error);
  }
  
  return insights;
}

function detectInsightType(text: string): string {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('issue') || lowerText.includes('problem')) return 'issue';
  if (lowerText.includes('improve') || lowerText.includes('enhance')) return 'improvement';
  if (lowerText.includes('trend') || lowerText.includes('pattern')) return 'trend';
  return 'analysis';
}

function detectPriority(text: string): string {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('critical') || lowerText.includes('urgent')) return 'critical';
  if (lowerText.includes('high') || lowerText.includes('important')) return 'high';
  if (lowerText.includes('low') || lowerText.includes('minor')) return 'low';
  return 'medium';
}

function detectImpactArea(text: string): string {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('conversion') || lowerText.includes('sale')) return 'conversion';
  if (lowerText.includes('engagement') || lowerText.includes('interaction')) return 'engagement';
  if (lowerText.includes('revenue') || lowerText.includes('money')) return 'revenue';
  return 'ux';
}
